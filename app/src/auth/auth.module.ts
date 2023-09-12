import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {AuthService} from "../../services/auth/auth.service";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {AuthRefreshTokenMiddleware} from "app/middlewares/auth-refresh-token/auth-refresh-token.middleware";
import {AuthController} from "./controllers/auth.controller";
import {PrismaModule} from "../../controllers/prisma/prisma.module";
import {UtilsModule} from "../../controllers/utils/utils.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [PrismaModule, UtilsModule],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthRefreshTokenMiddleware).forRoutes({
            path: "auth/refresh-token",
            method: RequestMethod.POST,
        });
        consumer.apply(AuthTokenMiddleware).forRoutes({
            path: "auth/logout",
            method: RequestMethod.POST,
        });
    }
}
