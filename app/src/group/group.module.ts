import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {NotificationsModule} from "app/controllers/notifications/notifications.module";
import {PrismaModule} from "app/controllers/prisma/prisma.module";
import {UtilsModule} from "app/controllers/utils/utils.module";
import {AuthTokenMiddleware} from "app/middlewares/auth-token/auth-token.middleware";
import {GroupService} from "app/services/group/group.service";
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
