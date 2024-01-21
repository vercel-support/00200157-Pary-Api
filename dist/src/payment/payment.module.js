"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const auth_token_middleware_1 = require("../../middlewares/auth-token/auth-token.middleware");
const notifications_module_1 = require("../notifications/notifications.module");
const prisma_module_1 = require("../prisma/prisma.module");
const utils_module_1 = require("../utils/utils.module");
const payment_controller_1 = require("./controllers/payment.controller");
const payment_service_1 = require("./services/payment.service");
const party_service_1 = require("../party/services/party.service");
const pusher_module_1 = require("../pusher/pusher.module");
let PaymentModule = class PaymentModule {
    configure(consumer) {
        consumer.apply(auth_token_middleware_1.AuthTokenMiddleware).forRoutes({
            path: "payment/init-payment",
            method: common_1.RequestMethod.POST
        });
    }
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, party_service_1.PartyService],
        imports: [prisma_module_1.PrismaModule, utils_module_1.UtilsModule, notifications_module_1.NotificationsModule, pusher_module_1.PusherModule]
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map