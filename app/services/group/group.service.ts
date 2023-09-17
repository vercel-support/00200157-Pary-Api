import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UtilsService} from "../utils/utils.service";
import {PrismaService} from "../db/prisma.service";
import {NotificationsService} from "../notifications/notifications.service";
import {CreateGroupDto} from "app/dtos/group/CreateGroup.dto";

@Injectable()
export class GroupService {
    constructor(
        private prisma: PrismaService,
        private utils: UtilsService,
        private notifications: NotificationsService,
    ) {}

    async createGroup(groupBody: CreateGroupDto, userId: string) {
        const {name, description, inviteUserNames, ageRange, showInFeed, isPrivate} = groupBody;

        const inviter = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {name: true, username: true, id: true},
        });

        if (!inviter) {
            throw new NotFoundException("User not found.");
        }

        const userGroupsSize = await this.prisma.group.count({
            where: {
                leaderId: userId,
            },
        });

        if (userGroupsSize >= 5) {
            throw new BadRequestException("You can only create up to 5 groups.");
        }

        const group = await this.prisma.group.create({
            data: {
                name,
                description,
                leaderId: userId,
                ageRange,
                private: isPrivate,
                showInFeed,
            },
        });

        await this.prisma.groupMember.create({
            data: {
                groupId: group.id,
                userId,
            },
        });

        if (inviteUserNames) {
            const users = await this.prisma.user.findMany({
                where: {
                    username: {
                        in: inviteUserNames,
                    },
                },
                select: {
                    id: true,
                    username: true,
                    expoPushToken: true,
                },
            });

            for (const user of users) {
                if (user.id === userId) continue;
                const response = await this.prisma.groupInvitation.create({
                    data: {
                        groupId: group.id,
                        invitedUserId: user.id,
                        invitingUserId: userId,
                    },
                });
                if (response) {
                    this.notifications.sendGroupInviteNotification(user.expoPushToken, inviter, group.name, group.id);
                }
            }
        }
        return group;
    }

    async getOwnGroups(page: number, limit: number, userId: string) {
        const skip = page * limit;
        const groups = await this.prisma.group.findMany({
            where: {
                OR: [{members: {some: {userId}}}, {leaderId: userId}, {moderators: {some: {userId}}}],
            },
            take: limit,
            skip: skip,
            orderBy: {name: "asc"},
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {take: 1},
                            },
                        },
                    },
                },
                leader: {
                    select: {
                        username: true,
                        name: true,
                        lastName: true,
                        profilePictures: {take: 1},
                    },
                },
                moderators: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {take: 1},
                                verified: true,
                                isCompany: true,
                                gender: true,
                            },
                        },
                    },
                },
            },
        });

        const totalGroups = await this.prisma.group.count({
            where: {
                OR: [{members: {some: {userId}}}, {leaderId: userId}, {moderators: {some: {userId}}}],
            },
        });

        const hasNextPage = page * limit < totalGroups;
        const nextPage = hasNextPage ? page + 1 : null;

        return {groups, hasNextPage, nextPage};
    }

    async getInvitedGroups(page: number, limit: number, userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                invitedGroups: {
                    select: {
                        group: {
                            include: {
                                members: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {take: 1},
                                            },
                                        },
                                    },
                                },
                                leader: {
                                    select: {
                                        username: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {take: 1},
                                    },
                                },
                                moderators: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {take: 1},
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const totalGroups = user.invitedGroups.length;

        const hasNextPage = page * limit < totalGroups;
        const nextPage = hasNextPage ? page + 1 : null;

        return {groups: user.invitedGroups, hasNextPage, nextPage};
    }

    async getGroup(groupId: string) {
        const group = await this.prisma.group.findUnique({
            where: {id: groupId},
            include: {
                leader: {
                    select: {
                        username: true,
                        name: true,
                        lastName: true,
                        profilePictures: {take: 1},
                        description: true,
                        birthDate: true,
                        gender: true,
                        musicInterest: true,
                        deportsInterest: true,
                        artAndCultureInterest: true,
                        techInterest: true,
                        hobbiesInterest: true,
                        verified: true,
                        location: {
                            select: {
                                name: true,
                            },
                        },
                        createdAt: true,
                        lastLogin: true,
                        isCompany: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {take: 1},
                                description: true,
                                birthDate: true,
                                gender: true,
                                musicInterest: true,
                                deportsInterest: true,
                                artAndCultureInterest: true,
                                techInterest: true,
                                hobbiesInterest: true,
                                verified: true,
                                location: {
                                    select: {
                                        name: true,
                                    },
                                },
                                createdAt: true,
                                lastLogin: true,
                                isCompany: true,
                            },
                        },
                    },
                },
                moderators: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {take: 1},
                                description: true,
                                birthDate: true,
                                gender: true,
                                musicInterest: true,
                                deportsInterest: true,
                                artAndCultureInterest: true,
                                techInterest: true,
                                hobbiesInterest: true,
                                verified: true,
                                location: {
                                    select: {
                                        name: true,
                                    },
                                },
                                createdAt: true,
                                lastLogin: true,
                                isCompany: true,
                            },
                        },
                    },
                },
            },
        });

        return group;
    }

    async updateGroup(groupId: string, groupBody: CreateGroupDto, userId: string) {
        const group = await this.prisma.group.findUnique({
            where: {id: groupId},
            select: {
                leaderId: true,
                moderators: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        if (!group) {
            throw new NotFoundException("Group not found.");
        }

        if (group.leaderId === userId || group.moderators.some(moderator => moderator.userId === userId)) {
            return await this.prisma.group.update({
                where: {id: groupId},
                data: groupBody,
            });
        }
        throw new BadRequestException("Only the group leader and moderators can update the group.");
    }

    async deleteGroup(groupId: string, userId: string) {
        const group = await this.prisma.group.findUnique({
            where: {id: groupId},
            select: {
                leaderId: true,
            },
        });

        if (!group) {
            throw new NotFoundException("Group not found.");
        }

        if (group.leaderId !== userId) {
            throw new BadRequestException("Only the group leader and moderators can update the group.");
        }

        await this.prisma.group.delete({
            where: {id: groupId},
        });

        return true;
    }

    /* async removePartyFromGroup(groupId: string, userId: string) {} */

    async inviteToGroup(groupId: string, userIdToInvite: string, userId: string) {
        const invitingUser = await this.prisma.user.findUnique({
            where: {id: userId},
        });

        if (!invitingUser) {
            throw new NotFoundException("User not found.");
        }
        const isMember = await this.prisma.groupMember.findFirst({
            where: {
                groupId: groupId,
                userId: userId,
            },
        });

        if (!isMember) {
            throw new BadRequestException("You are not a member of this group.");
        }

        const group = await this.prisma.group.findUnique({
            where: {id: groupId},
            select: {
                leaderId: true,
                id: true,
                name: true,
                moderators: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        if (group.leaderId !== userId && !group.moderators.some(moderator => moderator.userId === userId)) {
            throw new BadRequestException("Only the group leader and moderators can update the group.");
        }

        const invitation = await this.prisma.groupInvitation.create({
            data: {
                groupId: groupId,
                invitedUserId: userIdToInvite,
                invitingUserId: invitingUser.id,
            },
        });

        const invitedUser = await this.prisma.user.findUnique({
            where: {id: userIdToInvite},
            select: {
                expoPushToken: true,
            },
        });

        const inviter = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                username: true,
                name: true,
            },
        });

        this.notifications.sendGroupInviteNotification(invitedUser.expoPushToken, inviter, group.name, group.id);
        return invitation;
    }

    async acceptInvitation(groupId: string, userId: string) {
        const invitation = await this.prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: userId,
            },
        });

        if (invitation) {
            await this.prisma.groupInvitation.delete({
                where: {id: invitation.id},
            });
        }

        await this.prisma.groupMember.create({
            data: {
                groupId: groupId,
                userId: userId,
            },
        });

        const members = await this.prisma.group.findMany({
            where: {
                id: groupId,
            },
            select: {
                members: {
                    select: {
                        user: {
                            select: {
                                expoPushToken: true,
                            },
                        },
                    },
                },
            },
        });

        if (members) {
            const expoTokens = members.flatMap(member =>
                member.members.map(groupMember => groupMember.user.expoPushToken),
            );
            this.notifications.sendNewGroupMemberNotification(expoTokens, userId, groupId);
        }

        return true;
    }

    async declineInvitation(groupId: string, userId: string) {
        const invitation = await this.prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: userId,
            },
        });

        if (invitation) {
            await this.prisma.groupInvitation.delete({
                where: {id: invitation.id},
            });
        }

        return true;
    }

    async cancelInvitation(groupId: string, userIdToCancel: string) {
        const invitation = await this.prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: userIdToCancel,
            },
        });

        if (invitation) {
            await this.prisma.groupInvitation.delete({
                where: {id: invitation.id},
            });
        }
        //TODO: Enviar notificacion al usuario que declino la invitacion

        return true;
    }

    async leaveGroup(groupId: string, userId: string) {
        const group = await this.prisma.group.findUnique({
            where: {id: groupId},
        });

        if (!group) {
            throw new NotFoundException("User not found.");
        }

        // If the user is the owner of the group
        if (group.leaderId === userId) {
            // Delete all group invitations related to this group
            await this.prisma.groupInvitation.deleteMany({
                where: {groupId: groupId},
            });

            // Delete all group members
            await this.prisma.groupMember.deleteMany({
                where: {groupId: groupId},
            });

            await this.prisma.partyGroup.deleteMany({
                where: {groupId: groupId},
            });

            // Delete the group itself
            await this.prisma.group.delete({
                where: {id: groupId},
            });

            return true;
        } else {
            // If the user is not the owner but a member of the group
            const isMember = await this.prisma.groupMember.findFirst({
                where: {
                    groupId: groupId,
                    userId,
                },
            });

            if (!isMember) {
                throw new BadRequestException("You are not a member of this group.");
            }

            // Delete all group invitations from and to the user related to this group
            await this.prisma.groupInvitation.deleteMany({
                where: {
                    groupId: groupId,
                    OR: [{invitedUserId: userId}, {invitingUserId: userId}],
                },
            });

            // Remove the user from the group
            await this.prisma.groupMember.delete({
                where: {
                    userId_groupId: {
                        groupId: groupId,
                        userId,
                    },
                },
            });

            return true;
        }
    }
}
