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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../db/services/prisma.service");
const notifications_service_1 = require("../../notifications/services/notifications.service");
const utils_service_1 = require("../../utils/services/utils.service");
const axios_1 = require("axios");
const main_1 = require("../../../main");
let PaymentService = class PaymentService {
    constructor(prisma, utils, notifications) {
        this.prisma = prisma;
        this.utils = utils;
        this.notifications = notifications;
    }
    async initPayment(initPaymentDto, userId) {
        const { partyId, ticketId, groupId } = initPaymentDto;
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                members: {
                    none: {
                        id: userId
                    }
                }
            }
        });
        if (!party) {
            throw new common_1.InternalServerErrorException("Carrete No encontrado, o ya eres miembro");
        }
        const ticket = await this.prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        });
        if (!ticket) {
            throw new common_1.InternalServerErrorException("Ticket no encontrado");
        }
        if (ticket.price === 0) {
            throw new common_1.InternalServerErrorException("Ticket gratis");
        }
        let groupConnection = {};
        if (groupId) {
            const group = await this.prisma.group.findUnique({
                where: {
                    id: groupId
                }
            });
            if (!group) {
                throw new common_1.InternalServerErrorException("Grupo no encontrado");
            }
            groupConnection = {
                connect: {
                    id: groupId
                }
            };
        }
        const response = await axios_1.default
            .post("https://api.fintoc.com/v1/payment_intents", {
            amount: ticket.price,
            currency: "clp",
            metadata: {
                partyId,
                ticketId,
                groupId,
                userId
            }
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${main_1.FINTOC_SECRET_KEY}`
            }
        })
            .catch(error => {
            throw new common_1.InternalServerErrorException(error);
        })
            .then(response => {
            return response.data;
        });
        if (response.widget_token) {
            const newPayment = await this.prisma.paymentIntent.create({
                data: {
                    currency: response.currency,
                    amount: response.amount,
                    paymentIntentId: response.id,
                    widgetToken: response.widget_token,
                    party: {
                        connect: {
                            id: partyId
                        }
                    },
                    ticket: {
                        connect: {
                            id: ticketId
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    group: groupConnection
                }
            });
            return newPayment;
        }
        throw new common_1.InternalServerErrorException("Error al crear el pago");
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        notifications_service_1.NotificationsService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map