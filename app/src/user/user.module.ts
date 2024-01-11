import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthTokenMiddleware } from "app/middlewares/auth-token/auth-token.middleware";
import { UserService } from "app/src/user/services/user.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UtilsModule } from "../utils/utils.module";
import { UserController } from "./controllers/user.controller";
import { PusherModule } from "../pusher/pusher.module";

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [PrismaModule, UtilsModule, NotificationsModule, PusherModule]
})
export class UserModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthTokenMiddleware).forRoutes(UserController);
	}
}
