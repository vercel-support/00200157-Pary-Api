"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRefreshTokenMiddleware = void 0;
const common_1 = require("@nestjs/common");
const main_1 = require("../../main");
const jsonwebtoken_1 = require("jsonwebtoken");
let AuthRefreshTokenMiddleware = class AuthRefreshTokenMiddleware {
    use(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) {
            throw new common_1.HttpException("No se ha proporcionado un token.", 401);
        }
        (0, jsonwebtoken_1.verify)(token, main_1.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                throw new common_1.HttpException("Refresh Token inválido.", 403);
            }
            if (!decoded || typeof decoded === "string") {
                throw new common_1.HttpException("Refresh Token inválido.", 403);
            }
            req.decoded = decoded;
            next();
        });
    }
};
exports.AuthRefreshTokenMiddleware = AuthRefreshTokenMiddleware;
exports.AuthRefreshTokenMiddleware = AuthRefreshTokenMiddleware = __decorate([
    (0, common_1.Injectable)()
], AuthRefreshTokenMiddleware);
//# sourceMappingURL=auth-refresh-token.middleware.js.map