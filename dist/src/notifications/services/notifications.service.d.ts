import { PartyType } from "@prisma/client";
import { User } from "app/types";
import { PrismaService } from "../../db/services/prisma.service";
import { ExpoService } from "../../expo/services/expo.service";
export declare class NotificationsService {
    private prisma;
    private expo;
    constructor(prisma: PrismaService, expo: ExpoService);
    sendNewFollowerNotification(pushToken: string, followerId: string): Promise<false | import("expo-server-sdk").ExpoPushTicket[]>;
    sendGroupInviteNotification(pushToken: string, inviter: Partial<User>, groupName: string, groupId: string): Promise<void>;
    sendPartyInviteNotification(pushToken: string, inviter: Partial<User>, partyName: string, partyId: string, partyType: PartyType): Promise<void>;
    sendNewGroupMemberNotification(pushTokens: string[], newMemberId: string, groupId: string): Promise<void>;
    sendUserAcceptedPartyInvitationNotification(newMemberId: string, partyId: string): Promise<void>;
    sendPartyJoinAcceptedSoloNotification(userId: string, party: any): Promise<boolean>;
    sendPartyJoinAcceptedGroupNotification(groupId: string, party: any): Promise<boolean>;
    sendGroupJoinAcceptedNotification(userId: string, group: any): Promise<boolean>;
}
