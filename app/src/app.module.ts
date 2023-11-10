import {Module} from "@nestjs/common";
import {NotificationsService} from "../services/notifications/notifications.service";
import {AuthModule} from "./auth/auth.module";
import {FeedModule} from "./feed/feed.module";
import {GroupModule} from "./group/group.module";
import {PartyModule} from "./party/party.module";
import {UserModule} from "./user/user.module";
import {ExpoService} from "app/services/expo/expo.service";
import {PrismaService} from "app/services/db/prisma.service";
import {UtilsService} from "../services/utils/utils.service";
import {AuthService} from "app/services/auth/auth.service";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";

@Module({
    imports: [AuthModule, FeedModule, GroupModule, PartyModule, UserModule],
    providers: [AppService, PrismaService, UtilsService, ExpoService, NotificationsService, AuthService],
    controllers: [AppController],
})
export class AppModule {}
