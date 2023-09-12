import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {UserController} from "./controllers/user.controller";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {UserService} from "app/services/user/user.service";
import {PrismaModule} from "../prisma/prisma.module";
import {UtilsModule} from "../utils/utils.module";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [PrismaModule, UtilsModule],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(UserController);
    }
}
