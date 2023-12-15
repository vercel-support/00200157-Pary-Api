import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthTokenMiddleware } from "app/middlewares/auth-token/auth-token.middleware";
import { NotificationsModule } from "app/src/notifications/notifications.module";
import { PartyService } from "app/src/party/services/party.service";
import { PrismaModule } from "app/src/prisma/prisma.module";
import { UtilsModule } from "app/src/utils/utils.module";
import { PartyController } from "./controllers/party.controller";

@Module({
	controllers: [PartyController],
	providers: [PartyService],
	imports: [PrismaModule, UtilsModule, NotificationsModule],
})
export class PartyModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthTokenMiddleware).forRoutes(PartyController);
	}
}
