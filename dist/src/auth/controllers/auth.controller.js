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
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const main_1 = require("../../../main");
const SignIn_dto_1 = require("../dto/SignIn.dto");
const auth_service_1 = require("../services/auth.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_service_1 = require("../../utils/services/utils.service");
let AuthController = class AuthController {
    constructor(authService, utils) {
        this.authService = authService;
        this.utils = utils;
    }
    async signIn(googleUser) {
        return await this.authService.signInUser(googleUser);
    }
    async logout(request) {
        return await this.authService.logoutUser(request.raw.decoded.id);
    }
    async refreshToken(request) {
        return await this.authService.refreshToken(request.raw.decoded.id);
    }
    async testToken(bearerToken) {
        if (!bearerToken) {
            throw new common_1.ForbiddenException("No token provided.");
        }
        const token = this.utils.extractToken(bearerToken);
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, main_1.JWT_SECRET);
            if (typeof decoded === "object" && "id" in decoded) {
                return { message: "Access token is valid." };
            }
            throw new common_1.InternalServerErrorException("Invalid access token.");
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to authenticate token.");
        }
    }
    async testRefreshToken(bearerToken) {
        if (!bearerToken) {
            throw new common_1.ForbiddenException("No token provided.");
        }
        const token = this.utils.extractToken(bearerToken);
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, main_1.JWT_REFRESH_SECRET);
            if (typeof decoded === "object" && "id" in decoded) {
                return { message: "Access token is valid." };
            }
            throw new common_1.InternalServerErrorException("Invalid access token.");
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to authenticate token.");
        }
    }
    async createToken(id) {
        return this.authService.createToken(id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("signIn"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignIn_dto_1.GoogleUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)("logout"),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("refresh-token"),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)("test-token"),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testToken", null);
__decorate([
    (0, common_1.Post)("test-refresh-token"),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testRefreshToken", null);
__decorate([
    (0, common_1.Get)("create-token/:id"),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        utils_service_1.UtilsService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map