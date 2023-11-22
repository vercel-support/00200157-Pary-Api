import {Module} from "@nestjs/common";
import {UtilsModule} from "../utils/utils.module";
import {PrismaModule} from "../prisma/prisma.module";
import {ExpoService} from "./services/expo.service";

@Module({
    providers: [ExpoService],
    exports: [ExpoService],
    imports: [PrismaModule, UtilsModule],
})
export class ExpoModule {}
