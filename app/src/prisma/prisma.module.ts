import { Module } from "@nestjs/common";
import { PrismaService } from "app/src/db/services/prisma.service";
import { UtilsModule } from "../utils/utils.module";

@Module({
	providers: [PrismaService],
	exports: [PrismaService],
	imports: [UtilsModule],
})
export class PrismaModule {}
