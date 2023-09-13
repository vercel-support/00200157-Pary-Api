import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {PartyController} from "./controllers/party.controller";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {PartyService} from "app/services/party/party.service";

@Module({
    controllers: [PartyController],
    providers: [PartyService],
})
export class PartyModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(PartyController);
    }
}
