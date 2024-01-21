import { PrismaService } from "../../db/services/prisma.service";
import { NotificationsService } from "../../notifications/services/notifications.service";
import { UtilsService } from "../../utils/services/utils.service";
import { InitPaymentDto } from "../dto/InitPayment.dto";
export declare class PaymentService {
    private prisma;
    private utils;
    private notifications;
    constructor(prisma: PrismaService, utils: UtilsService, notifications: NotificationsService);
    initPayment(initPaymentDto: InitPaymentDto, userId: string): Promise<{
        id: string;
        amount: number;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        type: "FINTOC";
        widgetToken: string;
        paymentIntentId: string;
        createdAt: Date;
        partyId: string;
        userId: string;
        ticketId: string;
        groupId: string;
    }>;
}
