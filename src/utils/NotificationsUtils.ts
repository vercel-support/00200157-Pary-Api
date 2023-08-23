import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { expo, prisma } from "..";

export async function sendNewFollowerNotification(pushToken: string, followerId: string) {
    if (!Expo.isExpoPushToken(pushToken)) {
        return;
    }
    const follower = await prisma.user.findUnique({ where: { id: followerId }, select: { name: true, username: true } });

    if (follower === null) return;

    const message: ExpoPushMessage = {
        to: pushToken,
        sound: "default",
        title: "Nuevo seguidor",
        body: `@${follower!.username} te ha seguido.`,
        priority: "high",
        data: {
            url: `/main/feed/${follower.name}`, params: {
                username: follower.username
            }
        },
    };
    //TODO: Handle the response from expo
    // Links: 
    // https://github.com/expo/expo-server-sdk-node
    // https://docs.expo.dev/push-notifications/sending-notifications/
    return expo.sendPushNotificationsAsync([message]);
}