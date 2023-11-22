import {Module} from "@nestjs/common";
import {NotificationsService} from "app/src/notifications/services/notifications.service";
import {UtilsModule} from "../utils/utils.module";
import {PrismaModule} from "../prisma/prisma.module";
import {ExpoModule} from "../expo/expo.module";

@Module({
    providers: [NotificationsService],
    exports: [NotificationsService],
    imports: [PrismaModule, UtilsModule, ExpoModule],
})
export class NotificationsModule {}
