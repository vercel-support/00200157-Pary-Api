import { Module } from "@nestjs/common";
import { NotificationsService } from "app/src/notifications/services/notifications.service";
import { ExpoModule } from "../expo/expo.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UtilsModule } from "../utils/utils.module";

@Module({
	providers: [NotificationsService],
	exports: [NotificationsService],
	imports: [PrismaModule, UtilsModule, ExpoModule],
})
export class NotificationsModule {}
