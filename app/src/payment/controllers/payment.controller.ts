import { Body, Controller, Get, Param, Post, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "../services/payment.service";
import { GetPreferenceIdDto } from "../dto/GetPreferenceId.dto";
import { InitPaymentDto } from "../dto/InitPayment.dto";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

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
		console.log(body);
		if (body.type) {
			switch (body.type) {
				case "link.credentials_changed": {
					const linkIdCredentialsChanged = body.data.id;
					console.log(linkIdCredentialsChanged);
					// Luego define y llama a un método para manejar el evento de cambio de credenciales.
					break;
				}
				case "link.refresh_intent.succeeded": {
					const linkIdRefreshSucceeded = body.data.id;
					console.log(linkIdRefreshSucceeded);
					// Luego define y llama a un método para manejar el evento de actualización de enlace.
					break;
				}
				case "account.refresh_intent.succeeded": {
					const accountIdRefreshSucceeded = body.data.id;
					console.log(accountIdRefreshSucceeded);
					// Luego define y llama a un método para manejar el evento de actualización de cuenta.
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
