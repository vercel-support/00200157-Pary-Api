"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const auth_token_middleware_1 = require("../../middlewares/auth-token/auth-token.middleware");
const user_service_1 = require("./services/user.service");
const notifications_module_1 = require("../notifications/notifications.module");
const prisma_module_1 = require("../prisma/prisma.module");
const utils_module_1 = require("../utils/utils.module");
const user_controller_1 = require("./controllers/user.controller");
const pusher_module_1 = require("../pusher/pusher.module");
let UserModule = class UserModule {
    configure(consumer) {
        consumer.apply(auth_token_middleware_1.AuthTokenMiddleware).forRoutes(user_controller_1.UserController);
    }
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        imports: [prisma_module_1.PrismaModule, utils_module_1.UtilsModule, notifications_module_1.NotificationsModule, pusher_module_1.PusherModule]
    })
], UserModule);
//# sourceMappingURL=user.module.js.map