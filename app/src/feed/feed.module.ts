import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthTokenMiddleware } from "app/middlewares/auth-token/auth-token.middleware";
import { FeedService } from "app/src/feed/services/feed.service";
import { NotificationsModule } from "app/src/notifications/notifications.module";
import { PrismaModule } from "app/src/prisma/prisma.module";
import { UtilsModule } from "app/src/utils/utils.module";
import { FeedController } from "./controllers/feed.controller";

@Module({
	controllers: [FeedController],
	providers: [FeedService],
	imports: [PrismaModule, UtilsModule, NotificationsModule]
})
export class FeedModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthTokenMiddleware).forRoutes(FeedController);
	}
}
