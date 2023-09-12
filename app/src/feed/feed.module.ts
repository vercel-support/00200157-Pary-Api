import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {FeedController} from "./controllers/feed.controller";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";

@Module({
    controllers: [FeedController],
})
export class FeedModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(FeedController);
    }
}
