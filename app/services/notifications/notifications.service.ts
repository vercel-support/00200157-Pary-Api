import {Injectable} from "@nestjs/common";
import Expo, {ExpoPushMessage} from "expo-server-sdk";
import {User} from "types";
import {PrismaService} from "../db/prisma.service";
import {ExpoService} from "../expo/expo.service";
import {PartyType} from "@prisma/client";

@Injectable()
export class NotificationsService {
    constructor(
        private prisma: PrismaService,
        private expo: ExpoService,
    ) {}
    async sendNewFollowerNotification(pushToken: string, followerId: string) {
        if (pushToken === "" || !Expo.isExpoPushToken(pushToken)) {
            return false;
        }
        const follower = await this.prisma.user.findUnique({
            where: {id: followerId},
            select: {name: true, username: true},
        });

        if (follower === null) return false;

        const message: ExpoPushMessage = {
            to: pushToken,
            sound: "default",
            title: "Nuevo seguidor",
            body: `@${follower.username} te ha seguido.`,
            priority: "high",
            data: {
                url: `/feed/${follower.username}`,
                params: {
                    username: follower.username,
                },
                type: "follow",
            },
        };
        //TODO: Handle the response from expo
        // Links:
        // https://github.com/expo/expo-server-sdk-node
        // https://docs.expo.dev/push-notifications/sending-notifications/
        return this.expo.sendPushNotificationsAsync([message]);
    }

    async sendGroupInviteNotification(pushToken: string, inviter: Partial<User>, groupName: string, groupId: string) {
        // Comprueba si el token es válido
        if (pushToken === "" || !Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            return;
        }

        // Obtiene información del usuario que envió la invitación

        // Configura el mensaje de la notificación
        const message: ExpoPushMessage = {
            to: pushToken,
            sound: "default",
            title: "Invitación a un grupo",
            body: `@${inviter.username} te ha invitado al grupo ${groupName}.`,
            priority: "normal",
            data: {
                url: `/news/group/${groupId}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
                params: {
                    groupId: groupId,
                },
                type: "groupInvite",
            },
        };

        // Envía la notificación
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
            console.log(receipts);
        } catch (error) {
            console.error("Error sending push notification:", error);
        }
    }

    async sendPartyInviteNotification(
        pushToken: string,
        inviter: Partial<User>,
        partyName: string,
        partyId: string,
        partyType: PartyType,
    ) {
        // Comprueba si el token es válido
        if (pushToken === "" || !Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            return;
        }

        // Obtiene información del usuario que envió la invitación

        // Configura el mensaje de la notificación
        const message: ExpoPushMessage = {
            to: pushToken,
            sound: "default",
            title: `Invitación a un ${partyType}`,
            body: `@${inviter.username} te ha invitado a: ${partyName}.`,
            priority: "normal",
            data: {
                url: `/news/party/${partyId}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
                params: {
                    partyId: partyId,
                },
                type: "partyInvite",
            },
        };

        // Envía la notificación
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
            console.log(receipts);
        } catch (error) {
            console.error("Error sending push notification:", error);
        }
    }

    async sendNewGroupMemberNotification(pushTokens: string[], newMemberId: string, groupId: string) {
        // Comprueba si el token es válido
        if (!pushTokens.every(token => token !== "" && Expo.isExpoPushToken(token))) {
            console.error(`Push token ${pushTokens} is not a valid Expo push token`);
            return;
        }

        const newMember = await this.prisma.user.findUnique({
            where: {id: newMemberId},
            select: {name: true, username: true},
        });
        const group = await this.prisma.group.findUnique({where: {id: groupId}, select: {name: true}});
        if (newMember === null || group === null) return;

        // Configura el mensaje de la notificación
        const message: ExpoPushMessage = {
            to: pushTokens,
            sound: "default",
            title: "Nuevo miembro en el grupo",
            body: `@${newMember.username} se ha unido al grupo ${group.name}.`,
            priority: "normal",
            data: {
                url: `/news/group/${groupId}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
                params: {
                    groupId: groupId,
                },
                type: "groupNewMember",
            },
        };

        // Envía la notificación
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
            console.log(receipts);
        } catch (error) {
            console.error("Error sending push notification:", error);
        }
    }

    async sendNewPartyMemberNotification(pushTokens: string[], newMemberId: string, partyId: string) {
        // Comprueba si el token es válido
        if (!pushTokens.every(token => token !== "" && Expo.isExpoPushToken(token))) {
            console.error(`Push token ${pushTokens} is not a valid Expo push token`);
            return;
        }

        const newMember = await this.prisma.user.findUnique({
            where: {id: newMemberId},
            select: {name: true, username: true},
        });
        const party = await this.prisma.party.findUnique({where: {id: partyId}, select: {name: true}});
        if (newMember === null || party === null) return;

        // Configura el mensaje de la notificación
        const message: ExpoPushMessage = {
            to: pushTokens,
            sound: "default",
            title: "Nuevo miembro en el evento",
            body: `@${newMember.username} se ha unido al grupo ${party.name}.`,
            priority: "normal",
            data: {
                url: `/news/party/${partyId}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
                params: {
                    partyId,
                },
                type: "partyNewMember",
            },
        };

        // Envía la notificación
        try {
            const receipts = await this.expo.sendPushNotificationsAsync([message]);
            console.log(receipts);
        } catch (error) {
            console.error("Error sending push notification:", error);
        }
    }
}
