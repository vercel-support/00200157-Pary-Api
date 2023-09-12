import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {PartyController} from "./controllers/party.controller";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";

@Module({
    controllers: [PartyController],
})
export class PartyModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(PartyController);
    }
}
