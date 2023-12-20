import { Module } from "@nestjs/common";
import { AuthService } from "app/src/auth/services/auth.service";
import { PrismaService } from "app/src/db/services/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { ExpoService } from "./expo/services/expo.service";
import { FeedModule } from "./feed/feed.module";
import { GroupModule } from "./group/group.module";
import { NotificationsService } from "./notifications/services/notifications.service";
import { PartyModule } from "./party/party.module";
import { UserModule } from "./user/user.module";
import { UtilsService } from "./utils/services/utils.service";

@Module({
	imports: [AuthModule, FeedModule, GroupModule, PartyModule, UserModule],
	providers: [PrismaService, UtilsService, ExpoService, NotificationsService, AuthService]
})
export class AppModule {}
