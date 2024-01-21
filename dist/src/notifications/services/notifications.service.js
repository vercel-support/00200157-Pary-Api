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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const expo_server_sdk_1 = require("expo-server-sdk");
const prisma_service_1 = require("../../db/services/prisma.service");
const expo_service_1 = require("../../expo/services/expo.service");
let NotificationsService = class NotificationsService {
    constructor(prisma, expo) {
        this.prisma = prisma;
        this.expo = expo;
    }
    async sendNewFollowerNotification(pushToken, followerId) {
        if (pushToken === "" || !expo_server_sdk_1.default.isExpoPushToken(pushToken)) {
            return false;
        }
        const follower = await this.prisma.user.findUnique({
            where: { id: followerId },
            select: { name: true, username: true }
        });
        if (follower === null)
            return false;
        const message = {
            to: pushToken,
            sound: "default",
            title: "Nuevo seguidor",
            body: `@${follower.username} te ha seguido.`,
            priority: "high",
            data: {
                url: `/feed/${follower.username}`,
                params: {
                    username: follower.username
                },
                type: "follow"
            }
        };
        return this.expo.sendPushNotificationsAsync([message]);
    }
    async sendGroupInviteNotification(pushToken, inviter, groupName, groupId) {
        if (pushToken === "" || !expo_server_sdk_1.default.isExpoPushToken(pushToken)) {
            return;
        }
        const message = {
            to: pushToken,
            sound: "default",
            title: "Invitación a un grupo",
            body: `@${inviter.username} te ha invitado al grupo ${groupName}.`,
            priority: "normal",
            data: {
                url: `/news/group/${groupId}`,
                params: {
                    groupId: groupId
                },
                type: "groupInvite"
            }
        };
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
            console.log(receipts);
        }
        catch (error) {
            console.error("Error sending push notification:", error);
        }
    }
    async sendPartyInviteNotification(pushToken, inviter, partyName, partyId, partyType) {
        if (pushToken === "" || !expo_server_sdk_1.default.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            return;
        }
        const message = {
            to: pushToken,
            sound: "default",
            title: `Invitación a un ${partyType}`,
            body: `@${inviter.username} te ha invitado a: ${partyName}.`,
            priority: "normal",
            data: {
                url: `/news/party/${partyId}`,
                params: {
                    partyId: partyId
                },
                type: "partyInvite"
            }
        };
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
            console.log(receipts);
        }
        catch (error) {
            console.error("Error sending push notification:", error);
        }
    }
    async sendNewGroupMemberNotification(pushTokens, newMemberId, groupId) {
        if (!pushTokens.every(token => token !== "" && expo_server_sdk_1.default.isExpoPushToken(token))) {
            console.error(`Push token ${pushTokens} is not a valid Expo push token`);
            return;
        }
        const newMember = await this.prisma.user.findUnique({
            where: { id: newMemberId },
            select: { name: true, username: true }
        });
        const group = await this.prisma.group.findUnique({ where: { id: groupId }, select: { name: true } });
        if (newMember === null || group === null)
            return;
        const message = {
            to: pushTokens,
            sound: "default",
            title: "Nuevo miembro en el grupo",
            body: `@${newMember.username} se ha unido al grupo ${group.name}.`,
            priority: "normal",
            data: {
                url: `/news/group/${groupId}`,
                params: {
                    groupId: groupId
                },
                type: "groupNewMember"
            }
        };
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
            console.log(receipts);
        }
        catch (error) {
            console.error("Error sending push notification:", error);
        }
    }
    async sendUserAcceptedPartyInvitationNotification(newMemberId, partyId) {
        const newMember = await this.prisma.user.findUnique({
            where: { id: newMemberId },
            select: { name: true, username: true }
        });
        const party = await this.prisma.party.findUnique({
            where: { id: partyId },
            select: {
                name: true,
                owner: {
                    select: {
                        expoPushToken: true
                    }
                }
            }
        });
        if (newMember === null || party === null)
            return;
        const message = {
            to: party.owner.expoPushToken,
            sound: "default",
            title: "Invitacion a carrete aceptada",
            body: `@${newMember.username} se ha unido al carrete ${party.name}.`,
            priority: "normal",
            data: {
                url: `/news/party/${partyId}`,
                params: {
                    partyId
                },
                type: "partyNewMember"
            }
        };
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
        }
        catch (error) {
            console.error("Error sending push notification:", error);
        }
    }
    async sendPartyJoinAcceptedSoloNotification(userId, party) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { expoPushToken: true, username: true }
        });
        if (user === null || !party.moderators)
            return;
        const pushTokens = party.moderators.map(moderator => moderator.expoPushToken);
        const userMessage = {
            to: [user.expoPushToken, ...pushTokens],
            sound: "default",
            title: "Solicitud aceptada",
            body: "Tu solicitud para unirte al carrete ha sido aceptada.",
            priority: "normal",
            data: {
                url: `/news/party/${party.id}`,
                params: {
                    partyId: party.id
                },
                type: "partyNewMember"
            }
        };
        const modMessage = {
            to: [user.expoPushToken, ...pushTokens],
            sound: "default",
            title: "Nuevo miembr@ en el Carrete!",
            body: `@${user.username} se ha unido al carrete.`,
            priority: "normal",
            data: {
                url: `/news/party/${party.id}`,
                params: {
                    partyId: party.id
                },
                type: "partyNewMember"
            }
        };
        try {
            await this.expo.sendPushNotificationsAsync([userMessage, modMessage]);
        }
        catch (error) {
            return false;
        }
    }
    async sendPartyJoinAcceptedGroupNotification(groupId, party) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            select: {
                name: true,
                members: {
                    select: {
                        user: {
                            select: {
                                expoPushToken: true
                            }
                        }
                    }
                }
            }
        });
        if (group === null)
            return;
        const messageToGroup = {
            to: group.members.map(member => member.user.expoPushToken),
            sound: "default",
            title: "Nuevo ingreso a un carrete como grupo!",
            body: `Tu grupo ${group.name} se ha unido al carrete ${party.name}.`,
            priority: "normal",
            data: {
                url: `/news/party/${party.id}`,
                params: {
                    partyId: party.id
                },
                type: "partyNewMember"
            }
        };
        const messageToMods = {
            to: party.moderators.map(moderator => moderator.expoPushToken),
            sound: "default",
            title: "Solicitud aceptada a un grupo",
            body: `Se ha aceptado la solicitud de ${group.name} para unirse al carrete ${party.name}.`,
            priority: "normal",
            data: {
                url: `/news/party/${party.id}`,
                params: {
                    partyId: party.id
                },
                type: "partyNewMember"
            }
        };
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([messageToGroup, messageToMods]);
            console.log(receipts);
        }
        catch (error) {
            console.error("Error sending push notification:", error);
            return false;
        }
        return true;
    }
    async sendGroupJoinAcceptedNotification(userId, group) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { expoPushToken: true, username: true }
        });
        if (user === null)
            return;
        const pushTokens = group.moderators.map(moderator => moderator.expoPushToken);
        const userMessage = {
            to: [user.expoPushToken, ...pushTokens],
            sound: "default",
            title: "Solicitud aceptada",
            body: "Tu solicitud para unirte al grupo ha sido aceptada.",
            priority: "normal",
            data: {
                url: `/feed/group/${group.id}`,
                params: {
                    groupId: group.id
                },
                type: "groupNewMember"
            }
        };
        const modMessage = {
            to: [user.expoPushToken, ...pushTokens],
            sound: "default",
            title: "Nuevo miembr@ en el Grupo!",
            body: `@${user.username} se ha unido a tu grupo.`,
            priority: "normal",
            data: {
                url: `/feed/group/${group.id}`,
                params: {
                    groupId: group.id
                },
                type: "groupNewMember"
            }
        };
        try {
            await this.expo.sendPushNotificationsAsync([userMessage, modMessage]);
        }
        catch (error) {
            console.error("Error sending push notification:", error);
            return false;
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        expo_service_1.ExpoService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map