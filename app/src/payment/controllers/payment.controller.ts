import { Body, Controller, Get, Param, Post, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "../services/payment.service";
import { GetPreferenceIdDto } from "../dto/GetPreferenceId.dto";
import { InitPaymentDto } from "../dto/InitPayment.dto";
import { PrismaService } from "app/src/db/services/prisma.service";
import { PartyService } from "app/src/party/services/party.service";
import { PusherService } from "app/src/pusher/services/pusher.service";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly pusherService: PusherService,
		private readonly prisma: PrismaService,
		private readonly partyService: PartyService
	) {}

	@Post("init-payment")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async initPayment(@Body() initPaymentDto: InitPaymentDto, @Req() request: any) {
		return await this.paymentService.initPayment(initPaymentDto, request.raw.decoded.id);
	}

	@Post("webhook")
	async webhook(@Body() body: any, @Req() request: any) {
		if (body.type) {
			switch (body.type) {
				case "payment_intent.succeeded": {
					const { id: paymentId, metadata } = body.data;
					const { userId, partyId, ticketId, groupId } = metadata;

					if (!userId || !partyId || !ticketId) return;

					await this.partyService.joinUserOrGroupToParty(partyId, userId, ticketId, groupId);
					await this.prisma.paymentIntent.update({
						where: {
							paymentIntentId: paymentId
						},
						data: {
							status: "succeeded"
						}
					});

					this.pusherService.triggerToUser(userId, "payment-completed", {
						partyId,
						userId,
						ticketId,
						paymentId,
						groupId
					});
					break;
				}
				case "payment_intent.failed": {
					const { id: paymentId } = body.data;
					this.prisma.paymentIntent
						.update({
							where: {
								paymentIntentId: paymentId,
								status: {
									not: "succeeded"
								}
							},
							data: {
								status: "failed"
							}
						})
						.catch(err => console.log(err));
					break;
				}
				case "link.refresh_intent.succeeded": {
					break;
				}
				// ... manejar otros tipos de eventos
				default:
					// Tipo de evento inesperado
					console.log(`Unhandled event type ${body.type}`);
			}
		}
		return "ok";
	}

	/* @Post("test")
	async test(@Body() body: any) {
		console.log(body);
		const parties = await this.prisma.party.findMany({
			include: {
				tickets: true,
				members: true
			}
		});

		for (const party of parties) {
			if (party.tickets.length > 0) {
				party.members.forEach(async member => {
					if (!member.userId || !party.tickets[0] || !party.id) return;
					console.log("Creating ownership", member.userId, party.tickets[0].id, party.id);

					await this.prisma.ticketOwnership.create({
						data: {
							userId: member.userId,
							ticketId: party.tickets[0].id,
							partyId: party.id
						}
					});
				});
			} else {
				let baseTicket = await this.prisma.ticketBase.findFirst({
					where: {
						name: "Entrada General",
						creatorId: party.ownerId
					}
				});
				if (!baseTicket) {
					baseTicket = await this.prisma.ticketBase.create({
						data: {
							name: "Entrada General",
							description: "Entrada general.",
							type: "GRATIS",
							creator: {
								connect: {
									id: party.ownerId
								}
							}
						}
					});
				}
				const defaultTicket = await this.prisma.ticket.create({
					data: {
						stock: 200,
						price: 0,
						base: {
							connect: {
								id: baseTicket.id
							}
						}
					}
				});
				await this.prisma.party.update({
					where: {
						id: party.id
					},
					data: {
						tickets: {
							connect: {
								id: defaultTicket.id
							}
						}
					}
				});
			}
		}
		return "ok";
	} */
}
