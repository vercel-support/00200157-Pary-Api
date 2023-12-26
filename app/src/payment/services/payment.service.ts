import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../db/services/prisma.service";
import { NotificationsService } from "../../notifications/services/notifications.service";
import { UtilsService } from "../../utils/services/utils.service";
import { GetPreferenceIdDto } from "../dto/GetPreferenceId.dto";

@Injectable()
export class PaymentService {
	constructor(
		private prisma: PrismaService,
		private utils: UtilsService,
		private notifications: NotificationsService
	) {}

	async getPreferenceId(getPreferenceId: GetPreferenceIdDto, userId: string) {
		const { payerEmail, items } = getPreferenceId;

		const response = await this.utils.getMercadoPagoPreferenceId(payerEmail, items);
		console.log("mp response", response);
		/* 
		await this.prisma.payment.create({
			data: {
				userId,
				preferenceId
			}
		}); */

		return response;
	}
}
