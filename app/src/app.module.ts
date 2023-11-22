import {Module} from "@nestjs/common";
import {NotificationsService} from "./notifications/services/notifications.service";
import {AuthModule} from "./auth/auth.module";
import {FeedModule} from "./feed/feed.module";
import {GroupModule} from "./group/group.module";
import {PartyModule} from "./party/party.module";
import {UserModule} from "./user/user.module";
import {PrismaService} from "app/src/db/services/prisma.service";
import {UtilsService} from "./utils/services/utils.service";
import {AuthService} from "app/src/auth/services/auth.service";
import {ExpoService} from "./expo/services/expo.service";

@Module({
    imports: [AuthModule, FeedModule, GroupModule, PartyModule, UserModule],
    providers: [PrismaService, UtilsService, ExpoService, NotificationsService, AuthService],
})
export class AppModule {}
