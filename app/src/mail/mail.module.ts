import { Module } from "@nestjs/common";
import { MailService } from "app/src/mail/services/mail.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UtilsModule } from "../utils/utils.module";

@Module({
	providers: [MailService],
	exports: [MailService],
	imports: [PrismaModule, UtilsModule]
})
export class MailModule {}
