import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {GroupController} from "./controllers/group.controller";
import {GroupService} from "app/services/group/group.service";

@Module({
    controllers: [GroupController],
    providers: [GroupService],
})
export class GroupModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(GroupController);
    }
}
