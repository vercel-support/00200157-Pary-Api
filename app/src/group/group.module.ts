import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {GroupController} from "./controllers/group.controller";

@Module({
    controllers: [GroupController],
})
export class GroupModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(GroupController);
    }
}
