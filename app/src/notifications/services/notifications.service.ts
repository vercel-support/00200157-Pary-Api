import { Injectable } from "@nestjs/common";
import { Party, PartyType } from "@prisma/client";
import { User } from "app/types";
import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { PrismaService } from "../../db/services/prisma.service";
import { ExpoService } from "../../expo/services/expo.service";

@Injectable()
export class NotificationsService {
	constructor(
		private prisma: PrismaService,
		private expo: ExpoService
	) {}

	async sendNewFollowerNotification(pushToken: string, followerId: string) {
		if (pushToken === "" || !Expo.isExpoPushToken(pushToken)) {
			return false;
		}
		const follower = await this.prisma.user.findUnique({
			where: { id: followerId },
			select: { name: true, username: true }
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
					username: follower.username
				},
				type: "follow"
			}
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
			}
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
		partyType: PartyType
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
					partyId: partyId
				},
				type: "partyInvite"
			}
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
			where: { id: newMemberId },
			select: { name: true, username: true }
		});
		const group = await this.prisma.group.findUnique({ where: { id: groupId }, select: { name: true } });
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
			}
		};

		// Envía la notificación
		try {
			const receipts = await this.expo.sendPushNotificationsAsync([message]);
			console.log(receipts);
		} catch (error) {
			console.error("Error sending push notification:", error);
		}
	}

	async sendUserAcceptedPartyInvitationNotification(newMemberId: string, partyId: string) {
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
		if (newMember === null || party === null) return;

		const message: ExpoPushMessage = {
			to: party.owner.expoPushToken,
			sound: "default",
			title: "Invitacion a carrete aceptada",
			body: `@${newMember.username} se ha unido al carrete ${party.name}.`,
			priority: "normal",
			data: {
				url: `/news/party/${partyId}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
				params: {
					partyId
				},
				type: "partyNewMember"
			}
		};

		// Envía la notificación
		try {
			const receipts = await this.expo.sendPushNotificationsAsync([message]);
		} catch (error) {
			console.error("Error sending push notification:", error);
		}
	}

	async sendPartyJoinAcceptedSoloNotification(userId: string, party) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { expoPushToken: true, username: true }
		});
		if (user === null || !party.moderators) return;
		const pushTokens: string[] = party.moderators.map(moderator => moderator.expoPushToken);
		const userMessage: ExpoPushMessage = {
			to: [user.expoPushToken, ...pushTokens],
			sound: "default",
			title: "Solicitud aceptada",
			body: "Tu solicitud para unirte al carrete ha sido aceptada.",
			priority: "normal",
			data: {
				url: `/news/party/${party.id}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
				params: {
					partyId: party.id
				},
				type: "partyNewMember"
			}
		};
		const modMessage: ExpoPushMessage = {
			to: [user.expoPushToken, ...pushTokens],
			sound: "default",
			title: "Nuevo miembr@ en el Carrete!",
			body: `@${user.username} se ha unido al carrete.`,
			priority: "normal",
			data: {
				url: `/news/party/${party.id}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
				params: {
					partyId: party.id
				},
				type: "partyNewMember"
			}
		};

		try {
			await this.expo.sendPushNotificationsAsync([userMessage, modMessage]);
		} catch (error) {
			//console.error("Error sending push notification:", error);
			return false;
		}
	}

	async sendPartyJoinAcceptedGroupNotification(groupId: string, party) {
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
		if (group === null) return;
		const messageToGroup: ExpoPushMessage = {
			to: group.members.map(member => member.user.expoPushToken),
			sound: "default",
			title: "Nuevo ingreso a un carrete como grupo!",
			body: `Tu grupo ${group.name} se ha unido al carrete ${party.name}.`,
			priority: "normal",
			data: {
				url: `/news/party/${party.id}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
				params: {
					partyId: party.id
				},
				type: "partyNewMember"
			}
		};
		const messageToMods: ExpoPushMessage = {
			to: party.moderators.map(moderator => moderator.expoPushToken),
			sound: "default",
			title: "Solicitud aceptada a un grupo",
			body: `Se ha aceptado la solicitud de ${group.name} para unirse al carrete ${party.name}.`,
			priority: "normal",
			data: {
				url: `/news/party/${party.id}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
				params: {
					partyId: party.id
				},
				type: "partyNewMember"
			}
		};

		// Envía la notificación
		try {
			const receipts = await this.expo.sendPushNotificationsAsync([messageToGroup, messageToMods]);
			console.log(receipts);
		} catch (error) {
			console.error("Error sending push notification:", error);
			return false;
		}
		return true;
	}

	async sendGroupJoinAcceptedNotification(userId: string, group) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { expoPushToken: true, username: true }
		});
		if (user === null) return;
		const pushTokens: string[] = group.moderators.map(moderator => moderator.expoPushToken);
		const userMessage: ExpoPushMessage = {
			to: [user.expoPushToken, ...pushTokens],
			sound: "default",
			title: "Solicitud aceptada",
			body: "Tu solicitud para unirte al grupo ha sido aceptada.",
			priority: "normal",
			data: {
				url: `/feed/group/${group.id}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
				params: {
					groupId: group.id
				},
				type: "groupNewMember"
			}
		};
		const modMessage: ExpoPushMessage = {
			to: [user.expoPushToken, ...pushTokens],
			sound: "default",
			title: "Nuevo miembr@ en el Grupo!",
			body: `@${user.username} se ha unido a tu grupo.`,
			priority: "normal",
			data: {
				url: `/feed/group/${group.id}`, // Aquí puedes poner la URL o la ruta en la que el usuario puede ver la invitación al grupo
				params: {
					groupId: group.id
				},
				type: "groupNewMember"
			}
		};

		try {
			await this.expo.sendPushNotificationsAsync([userMessage, modMessage]);
		} catch (error) {
			console.error("Error sending push notification:", error);
			return false;
		}
	}
}
