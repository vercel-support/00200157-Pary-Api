import { Body, Controller, Get, Param, Post, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "../services/payment.service";
import { GetPreferenceIdDto } from "../dto/GetPreferenceId.dto";
import { InitPaymentDto } from "../dto/InitPayment.dto";
import { WebsocketGateway } from "app/src/websockets/websocket.gateway";
import { PrismaService } from "app/src/db/services/prisma.service";
import { PartyService } from "app/src/party/services/party.service";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly websocketService: WebsocketGateway,
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
		console.log(initPaymentDto);
		return await this.paymentService.initPayment(initPaymentDto, request.raw.decoded.id);
	}

	@Post("webhook")
	async webhook(@Body() body: any) {
		if (body.type) {
			switch (body.type) {
				case "payment_intent.succeeded": {
					const { id: paymentId, metadata } = body.data;
					const { userId, partyId, ticketId, groupId } = metadata;
					const user = await this.prisma.user.findUnique({
						where: {
							id: userId
						},
						select: {
							webSocketId: true
						}
					});
					console.log("Pago aceptado", user.webSocketId, {
						partyId,
						userId,
						ticketId,
						paymentId,
						groupId
					});

					await this.partyService.joinUserOrGroupToParty(partyId, userId, ticketId, groupId);
					await this.prisma.paymentIntent.update({
						where: {
							paymentIntentId: paymentId
						},
						data: {
							status: "succeeded"
						}
					});

					this.websocketService.server.to(user.webSocketId).emit("payment-completed", {
						partyId,
						userId,
						ticketId,
						paymentId,
						groupId
					});
					break;
				}
				case "payment_intent.failed": {
					console.log("Pago Fallido", body.data);
					const { id: paymentId } = body.data;
					await this.prisma.paymentIntent.update({
						where: {
							paymentIntentId: paymentId
						},
						data: {
							status: "failed"
						}
					});
					break;
				}
				case "link.refresh_intent.succeeded": {
					const linkIdRefreshSucceeded = body.data.id;
					console.log(linkIdRefreshSucceeded);
					// Luego define y llama a un método para manejar el evento de actualización de enlace.
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
