import { Body, Controller, Get, Param, Post, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "../services/payment.service";
import { GetPreferenceIdDto } from "../dto/GetPreferenceId.dto";

@ApiTags("Payment")
@ApiBearerAuth()
@Controller("payment")
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post("preference-id")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async getOwnParties(@Body() getPreferenceId: GetPreferenceIdDto, @Req() request: any) {
		console.log(getPreferenceId);
		return await this.paymentService.getPreferenceId(getPreferenceId, request.raw.decoded.id);
	}
}
