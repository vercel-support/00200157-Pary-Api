"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth/services/auth.service");
const prisma_service_1 = require("./db/services/prisma.service");
const auth_module_1 = require("./auth/auth.module");
const expo_service_1 = require("./expo/services/expo.service");
const feed_module_1 = require("./feed/feed.module");
const group_module_1 = require("./group/group.module");
const notifications_service_1 = require("./notifications/services/notifications.service");
const party_module_1 = require("./party/party.module");
const payment_module_1 = require("./payment/payment.module");
const pusher_module_1 = require("./pusher/pusher.module");
const user_module_1 = require("./user/user.module");
const utils_service_1 = require("./utils/services/utils.service");
const mail_module_1 = require("./mail/mail.module");
const mail_service_1 = require("./mail/services/mail.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, feed_module_1.FeedModule, group_module_1.GroupModule, party_module_1.PartyModule, user_module_1.UserModule, payment_module_1.PaymentModule, pusher_module_1.PusherModule, mail_module_1.MailModule],
        providers: [prisma_service_1.PrismaService, utils_service_1.UtilsService, expo_service_1.ExpoService, notifications_service_1.NotificationsService, auth_service_1.AuthService, mail_service_1.MailService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map