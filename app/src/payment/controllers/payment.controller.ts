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
}
