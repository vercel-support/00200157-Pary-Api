import { PaymentService } from "../services/payment.service";
import { InitPaymentDto } from "../dto/InitPayment.dto";
import { PrismaService } from "app/src/db/services/prisma.service";
import { PartyService } from "app/src/party/services/party.service";
import { PusherService } from "app/src/pusher/services/pusher.service";
export declare class PaymentController {
    private readonly paymentService;
    private readonly pusherService;
    private readonly prisma;
    private readonly partyService;
    constructor(paymentService: PaymentService, pusherService: PusherService, prisma: PrismaService, partyService: PartyService);
    initPayment(initPaymentDto: InitPaymentDto, request: any): Promise<{
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
    webhook(body: any): Promise<string>;
}
