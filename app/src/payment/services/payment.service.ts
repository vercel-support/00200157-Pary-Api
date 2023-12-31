import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../db/services/prisma.service";
import { NotificationsService } from "../../notifications/services/notifications.service";
import { UtilsService } from "../../utils/services/utils.service";
import { GetPreferenceIdDto } from "../dto/GetPreferenceId.dto";
import { InitPaymentDto } from "../dto/InitPayment.dto";
import axios from "axios";
import { FINTOC_SECRET_KEY } from "app/main";

@Injectable()
export class PaymentService {
	constructor(
		private prisma: PrismaService,
		private utils: UtilsService,
		private notifications: NotificationsService
	) {}
	async initPayment(initPaymentDto: InitPaymentDto, userId: string) {
		const { partyId, ticketId, groupId } = initPaymentDto;
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

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

		console.log(ticket.price);
		const response = await axios
			.post(
				"https://api.fintoc.com/v1/payment_intents",
				{
					amount: 5000,
					currency: "clp",
					metadata: {
						partyId,
						ticketId,
						groupId,
						userId
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
				console.log(JSON.stringify(error.response.data));
				throw new InternalServerErrorException(error);
			})
			.then(response => {
				return response.data;
			});

		console.log("FinToc Response: ", response);

		if (response.widget_token) {
			const newPayment = await this.prisma.paymentIntent.create({
				data: {
					currency: response.currency,
					amount: response.amount,
					paymentIntentId: response.id,
					widgetToken: response.widget_token,
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
			console.log(newPayment);
			return newPayment;
		}
		throw new InternalServerErrorException("Error al crear el pago");
	}
}
