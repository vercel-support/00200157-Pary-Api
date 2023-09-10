import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { expo, prisma } from "..";
import { PartyType, User } from "@prisma/client";
export type NotificationType = "follow" | "like" | "comment" | "message" | "newParty" | "partyUpdate" | "partyDelete" | "groupInvite" | "group" | "groupNewMember";

export async function sendNewFollowerNotification(pushToken: string, followerId: string) {
    if (pushToken === "" || !Expo.isExpoPushToken(pushToken)) {
        return;
    }
    const follower = await prisma.user.findUnique({ where: { id: followerId }, select: { name: true, username: true } });

    if (follower === null) return;

    const message: ExpoPushMessage = {
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
        },
    };
    //TODO: Handle the response from expo
    // Links: 
    // https://github.com/expo/expo-server-sdk-node
    // https://docs.expo.dev/push-notifications/sending-notifications/
    return expo.sendPushNotificationsAsync([message]);
}

export async function sendGroupInviteNotification(pushToken: string, inviter: Partial<User>, groupName: string, groupId: string) {
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
                groupId: groupId
            },
            type: "groupInvite"
        },
    };

    // Envía la notificación
    try {
        const receipts = await expo.sendPushNotificationsAsync([message]);
        console.log(receipts);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}

export async function sendPartyInviteNotification(pushToken: string, inviter: Partial<User>, partyName: string, partyId: string, partyType: PartyType) {
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
                partyId: partyId
            },
            type: "partyInvite"
        },
    };

    // Envía la notificación
    try {
        const receipts = await expo.sendPushNotificationsAsync([message]);
        console.log(receipts);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}

// create a new notification for the leader and the members of the group when a new member joins

export async function sendNewGroupMemberNotification(pushTokens: string[], newMemberId: string, groupId: string) {
    // Comprueba si el token es válido
    if (!pushTokens.every(token => token !== "" && Expo.isExpoPushToken(token))) {
        console.error(`Push token ${pushTokens} is not a valid Expo push token`);
        return;
    }


    const newMember = await prisma.user.findUnique({ where: { id: newMemberId }, select: { name: true, username: true } });
    const group = await prisma.group.findUnique({ where: { id: groupId }, select: { name: true } });
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
                groupId: groupId
            },
            type: "groupNewMember"
        },
    };

    // Envía la notificación
    try {
        const receipts = await expo.sendPushNotificationsAsync([message]);
        console.log(receipts);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}

export async function sendNewPartyMemberNotification(pushTokens: string[], newMemberId: string, partyId: string) {
    // Comprueba si el token es válido
    if (!pushTokens.every(token => token !== "" && Expo.isExpoPushToken(token))) {
        console.error(`Push token ${pushTokens} is not a valid Expo push token`);
        return;
    }


    const newMember = await prisma.user.findUnique({ where: { id: newMemberId }, select: { name: true, username: true } });
    const party = await prisma.party.findUnique({ where: { id: partyId }, select: { name: true } });
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
                partyId
            },
            type: "partyNewMember"
        },
    };

    // Envía la notificación
    try {
        const receipts = await expo.sendPushNotificationsAsync([message]);
        console.log(receipts);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}