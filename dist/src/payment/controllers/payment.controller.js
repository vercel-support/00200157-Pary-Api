"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("../services/payment.service");
const InitPayment_dto_1 = require("../dto/InitPayment.dto");
const prisma_service_1 = require("../../db/services/prisma.service");
const party_service_1 = require("../../party/services/party.service");
const pusher_service_1 = require("../../pusher/services/pusher.service");
let PaymentController = class PaymentController {
    constructor(paymentService, pusherService, prisma, partyService) {
        this.paymentService = paymentService;
        this.pusherService = pusherService;
        this.prisma = prisma;
        this.partyService = partyService;
    }
    async initPayment(initPaymentDto, request) {
        return await this.paymentService.initPayment(initPaymentDto, request.raw.decoded.id);
    }
    async webhook(body) {
        if (body.type) {
            console.log("Nuevo WebHook", body.type, body.data?.metadata);
            switch (body.type) {
                case "payment_intent.succeeded": {
                    const { id: paymentId, metadata } = body.data;
                    const { userId, partyId, ticketId, groupId } = metadata;
                    const user = await this.prisma.user.findUnique({
                        where: {
                            id: userId
                        },
                        select: {
                            webSocketId: true
                        }
                    });
                    await this.partyService.joinUserOrGroupToParty(partyId, userId, ticketId, groupId);
                    await this.prisma.paymentIntent.update({
                        where: {
                            paymentIntentId: paymentId
                        },
                        data: {
                            status: "succeeded"
                        }
                    });
                    this.pusherService.triggerToUser(userId, "payment-completed", {
                        partyId,
                        userId,
                        ticketId,
                        paymentId,
                        groupId
                    });
                    break;
                }
                case "payment_intent.failed": {
                    const { id: paymentId } = body.data;
                    this.prisma.paymentIntent
                        .update({
                        where: {
                            paymentIntentId: paymentId,
                            status: {
                                not: "succeeded"
                            }
                        },
                        data: {
                            status: "failed"
                        }
                    })
                        .catch(err => console.log(err));
                    break;
                }
                case "link.refresh_intent.succeeded": {
                    break;
                }
                default:
                    console.log(`Unhandled event type ${body.type}`);
            }
        }
        return "ok";
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)("init-payment"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InitPayment_dto_1.InitPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initPayment", null);
__decorate([
    (0, common_1.Post)("webhook"),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "webhook", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)("Payment"),
    (0, common_1.Controller)("payment"),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        pusher_service_1.PusherService,
        prisma_service_1.PrismaService,
        party_service_1.PartyService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map