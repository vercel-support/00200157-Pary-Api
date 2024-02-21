import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { FINTOC_SECRET_KEY } from "app/main";
import axios from "axios";
import { PrismaService } from "../../db/services/prisma.service";
import { InitPaymentDto } from "../dto/InitPayment.dto";

@Injectable()
export class PaymentService {
	constructor(private readonly prisma: PrismaService) {}
	async initPayment(initPaymentDto: InitPaymentDto, userId: string) {
		const { partyId, ticketId, groupId, selectedGroupMembers } = initPaymentDto;
		const party = await this.prisma.party.findUnique({
			where: {
				id: partyId,
				members: {
					none: {
						id: userId
					}
				}
			}
		});

		if (!party) {
			throw new InternalServerErrorException("Carrete No encontrado, o ya eres miembro");
		}

		const ticket = await this.prisma.ticket.findUnique({
			where: {
				id: ticketId
			}
		});

		if (!ticket) {
			throw new InternalServerErrorException("Ticket no encontrado");
		}

		if (ticket.price === 0) {
			throw new InternalServerErrorException("Ticket gratis");
		}
		let groupConnection = {};
		if (groupId) {
			const group = await this.prisma.group.findUnique({
				where: {
					id: groupId
				}
			});

			if (!group) {
				throw new InternalServerErrorException("Grupo no encontrado");
			}
			groupConnection = {
				connect: {
					id: groupId
				}
			};
		}

		const parsedSelectedGroupMembers: string[] | undefined = groupId ? Array.from(selectedGroupMembers) : undefined;
		const price = parsedSelectedGroupMembers ? ticket.price * parsedSelectedGroupMembers.length : ticket.price;
		console.log(
			"Price: ",
			price,
			"Parsed: ",
			parsedSelectedGroupMembers,
			"Selected: ",
			selectedGroupMembers,
			"Group: ",
			groupId,
			ticket.price,
			parsedSelectedGroupMembers.length,
			ticket.price * parsedSelectedGroupMembers.length
		);
		const response = await axios
			.post(
				"https://api.fintoc.com/v1/payment_intents",
				{
					amount: price,
					currency: "clp",
					metadata: {
						partyId,
						ticketId,
						groupId,
						userId,
						selectedGroupMembers: JSON.stringify(parsedSelectedGroupMembers)
					}
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${FINTOC_SECRET_KEY}`
					}
				}
			)
			.catch(error => {
				throw new InternalServerErrorException(error);
			})
			.then(response => {
				return response.data;
			});

		if (response.widget_token) {
			const newPayment = await this.prisma.paymentIntent.create({
				data: {
					currency: response.currency,
					amount: response.amount,
					paymentIntentId: response.id,
					widgetToken: response.widget_token,
					selectedGroupMembers: [...parsedSelectedGroupMembers],
					party: {
						connect: {
							id: partyId
						}
					},
					ticket: {
						connect: {
							id: ticketId
						}
					},
					user: {
						connect: {
							id: userId
						}
					},
					group: groupConnection
				}
			});
			return newPayment;
		}
		throw new InternalServerErrorException("Error al crear el pago");
	}
}
