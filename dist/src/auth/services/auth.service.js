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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const main_1 = require("../../../main");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_service_1 = require("../../db/services/prisma.service");
const utils_service_1 = require("../../utils/services/utils.service");
const client = new google_auth_library_1.OAuth2Client();
let AuthService = class AuthService {
    constructor(prisma, utils) {
        this.prisma = prisma;
        this.utils = utils;
    }
    async signInUser(googleUser) {
        const { idToken } = googleUser;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_AUTH_WEB_TOKEN
        });
        const payload = ticket.getPayload();
        if (!payload)
            throw new common_1.InternalServerErrorException("Invalid access token.");
        let user = await this.prisma.user.findUnique({
            where: {
                assignedGoogleID: googleUser.user.id
            },
            select: {
                id: true
            }
        });
        if (!user) {
            const generatedUsername = `${googleUser.user.givenName ?? ""}${googleUser.user.familyName ?? ""}${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;
            const userLocation = await this.prisma.location.create({
                data: {
                    name: "",
                    latitude: 0,
                    longitude: 0,
                    timestamp: new Date(),
                    address: ""
                }
            });
            user = await this.prisma.$transaction([
                this.prisma.user.create({
                    data: {
                        username: generatedUsername,
                        name: googleUser.user.givenName ?? "",
                        email: googleUser.user.email,
                        lastName: googleUser.user.familyName ?? "",
                        assignedGoogleID: googleUser.user.id,
                        lastLogin: new Date(),
                        createdAt: new Date(),
                        birthDate: new Date(),
                        socialMedia: {
                            instagram: ""
                        },
                        locationId: userLocation.id
                    },
                    include: this.utils.getUserFields()
                })
            ]);
        }
        const accessToken = (0, jsonwebtoken_1.sign)({ id: user.id }, main_1.JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = (0, jsonwebtoken_1.sign)({ id: user.id }, main_1.JWT_REFRESH_SECRET, {
            expiresIn: "4weeks"
        });
        user = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                accessToken,
                refreshToken,
                lastLogin: new Date()
            },
            include: this.utils.getUserFields()
        });
        console.log("User: ", user);
        return user;
    }
    async logoutUser(userId) {
        const response = await this.prisma.user.update({
            where: { id: userId },
            data: {
                accessToken: "",
                refreshToken: "",
                expoPushToken: "",
                webSocketId: ""
            }
        });
        const currentToken = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                accessToken: true
            }
        });
        return true;
    }
    async refreshToken(userId) {
        const accessToken = (0, jsonwebtoken_1.sign)({ id: userId }, main_1.JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = (0, jsonwebtoken_1.sign)({ id: userId }, main_1.JWT_REFRESH_SECRET, {
            expiresIn: "4weeks"
        });
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                accessToken,
                refreshToken
            },
            include: this.utils.getUserFields()
        });
        return user;
    }
    async createToken(userId) {
        return (0, jsonwebtoken_1.sign)({ id: userId }, main_1.JWT_SECRET, { expiresIn: "1d" });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map