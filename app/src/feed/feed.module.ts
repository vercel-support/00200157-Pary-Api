import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {FeedController} from "./controllers/feed.controller";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {FeedService} from "app/services/feed/feed.service";
import {PrismaModule} from "app/controllers/prisma/prisma.module";
import {UtilsModule} from "app/controllers/utils/utils.module";
import {NotificationsModule} from "app/controllers/notifications/notifications.module";

@Module({
    controllers: [FeedController],
    providers: [FeedService],
    imports: [PrismaModule, UtilsModule, NotificationsModule],
})
export class FeedModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(FeedController);
    }
}
