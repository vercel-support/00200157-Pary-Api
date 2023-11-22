import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {NotificationsModule} from "app/src/notifications/notifications.module";
import {PrismaModule} from "app/src/prisma/prisma.module";
import {UtilsModule} from "app/src/utils/utils.module";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {GroupService} from "app/src/group/services/group.service";
import {GroupController} from "./controllers/group.controller";

@Module({
    controllers: [GroupController],
    providers: [GroupService],
    imports: [PrismaModule, UtilsModule, NotificationsModule],
})
export class GroupModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthTokenMiddleware).forRoutes(GroupController);
    }
}
