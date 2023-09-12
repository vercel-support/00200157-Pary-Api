import {Module} from "@nestjs/common";
import {NotificationsService} from "app/services/notifications/notifications.service";
import {UtilsModule} from "../utils/utils.module";
import {PrismaModule} from "../prisma/prisma.module";
import {ExpoModule} from "../expo/expo.module";

@Module({
    providers: [NotificationsService],
    exports: [NotificationsService],
    imports: [PrismaModule, UtilsModule, ExpoModule],
})
export class NotificationsModule {}
