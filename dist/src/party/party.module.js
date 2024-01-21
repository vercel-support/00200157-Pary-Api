"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyModule = void 0;
const common_1 = require("@nestjs/common");
const auth_token_middleware_1 = require("../../middlewares/auth-token/auth-token.middleware");
const notifications_module_1 = require("../notifications/notifications.module");
const party_service_1 = require("./services/party.service");
const prisma_module_1 = require("../prisma/prisma.module");
const utils_module_1 = require("../utils/utils.module");
const party_controller_1 = require("./controllers/party.controller");
let PartyModule = class PartyModule {
    configure(consumer) {
        consumer.apply(auth_token_middleware_1.AuthTokenMiddleware).forRoutes(party_controller_1.PartyController);
    }
};
exports.PartyModule = PartyModule;
exports.PartyModule = PartyModule = __decorate([
    (0, common_1.Module)({
        controllers: [party_controller_1.PartyController],
        providers: [party_service_1.PartyService],
        imports: [prisma_module_1.PrismaModule, utils_module_1.UtilsModule, notifications_module_1.NotificationsModule]
    })
], PartyModule);
//# sourceMappingURL=party.module.js.map