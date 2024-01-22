import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../db/services/prisma.service";

@Injectable()
export class MailService {
	constructor(private prisma: PrismaService) {}

	async sendMailVerificationToken(mail: string) {}
}
