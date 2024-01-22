import { Module } from "@nestjs/common";
import { AuthService } from "app/src/auth/services/auth.service";
import { PrismaService } from "app/src/db/services/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { ExpoService } from "./expo/services/expo.service";
import { FeedModule } from "./feed/feed.module";
import { GroupModule } from "./group/group.module";
import { NotificationsService } from "./notifications/services/notifications.service";
import { PartyModule } from "./party/party.module";
import { PaymentModule } from "./payment/payment.module";
import { PusherModule } from "./pusher/pusher.module";
import { UserModule } from "./user/user.module";
import { UtilsService } from "./utils/services/utils.service";
import { MailModule } from "./mail/mail.module";
import { MailService } from "./Mail/services/Mail.service";

@Module({
	imports: [AuthModule, FeedModule, GroupModule, PartyModule, UserModule, PaymentModule, PusherModule, MailModule],
	providers: [PrismaService, UtilsService, ExpoService, NotificationsService, AuthService, MailService]
})
export class AppModule {}
