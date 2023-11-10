import {Module} from "@nestjs/common";
import {NotificationsService} from "./services/notifications/notifications.service";
import {AuthModule} from "./src/auth/auth.module";
import {FeedModule} from "./src/feed/feed.module";
import {GroupModule} from "./src/group/group.module";
import {PartyModule} from "./src/party/party.module";
import {UserModule} from "./src/user/user.module";
import {ExpoService} from "app/services/expo/expo.service";
import {PrismaService} from "app/services/db/prisma.service";
import {UtilsService} from "./services/utils/utils.service";
import {AuthService} from "app/services/auth/auth.service";

@Module({
    imports: [AuthModule, FeedModule, GroupModule, PartyModule, UserModule],
    providers: [PrismaService, UtilsService, ExpoService, NotificationsService, AuthService],
})
export class AppModule {}
