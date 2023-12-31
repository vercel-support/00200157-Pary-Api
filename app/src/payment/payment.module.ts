import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthTokenMiddleware } from "app/middlewares/auth-token/auth-token.middleware";
import { NotificationsModule } from "app/src/notifications/notifications.module";
import { PrismaModule } from "app/src/prisma/prisma.module";
import { UtilsModule } from "app/src/utils/utils.module";
import { WebSocketsModule } from "../websockets/websockets.module";
import { PaymentController } from "./controllers/payment.controller";
import { PaymentService } from "./services/payment.service";
import { PartyService } from "../party/services/party.service";

@Module({
	controllers: [PaymentController],
	providers: [PaymentService, PartyService],
	imports: [PrismaModule, UtilsModule, NotificationsModule, WebSocketsModule]
})
export class PaymentModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthTokenMiddleware).forRoutes({
			path: "payment/init-payment",
			method: RequestMethod.POST
		});
	}
}
