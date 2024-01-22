import { PrismaService } from "../../db/services/prisma.service";
export declare class MailService {
    private prisma;
    constructor(prisma: PrismaService);
    sendMailVerificationToken(mail: string): Promise<void>;
}
