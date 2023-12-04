import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {UtilsService} from "../../utils/services/utils.service";
import {PrismaService} from "../../db/services/prisma.service";
import {NotificationsService} from "../../notifications/services/notifications.service";
import {CreateGroupDto} from "app/src/group/dto/CreateGroup.dto";
import {PaginationDto} from "../dto/Pagination.dto";
import {JoinRequestDto} from "../../party/dto/JoinRequestDto";
import {UpdateGroupDto} from "../dto/UpdateGroup.dto";
import {UsernameDto} from "../../party/dto/User.dto";

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

    async updateGroup(groupBody: UpdateGroupDto, userId: string) {
        const {id, name, description, ageRange, showInFeed, isPrivate} = groupBody;

        const group = await this.prisma.group.update({
            where: {
                id,
                leaderId: userId,
            },
            data: {
                name,
                description,
                ageRange,
                private: isPrivate,
                showInFeed,
            },
        });

        return group;
    }

    async getOwnGroups(paginationDto: PaginationDto, userId: string) {
        const {page, limit} = paginationDto;
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
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                },
                leader: {
                    select: {
                        username: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true,
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
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
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

    async getInvitedGroups(paginationDto: PaginationDto, userId: string) {
        const {page, limit} = paginationDto;
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                invitedGroups: {
                    include: {
                        group: {
                            include: {
                                members: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {
                                                    take: 1,
                                                    select: {
                                                        url: true,
                                                        id: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                leader: {
                                    select: {
                                        username: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true,
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
                                                profilePictures: {
                                                    take: 1,
                                                    select: {
                                                        url: true,
                                                        id: true,
                                                    },
                                                },
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
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true,
                            },
                        },
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
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
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
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
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
                invitations: {
                    include: {
                        invitingUser: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
                            },
                        },
                        invitedUser: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return group;
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

    async inviteToGroup(groupId: string, usernameDto: UsernameDto, userId: string) {
        const {username} = usernameDto;

        const hasPermissions = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId,
                    },
                    {
                        moderators: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
        });

        if (!hasPermissions) {
            throw new BadRequestException("No tienes permisos para invitar.");
        }

        const invitedUser = await this.prisma.user.findUnique({
            where: {username},
            select: {
                id: true,
                expoPushToken: true,
            },
        });

        if (!invitedUser) {
            throw new NotFoundException("No se encontró el usuario a invitar.");
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

        const invitation = await this.prisma.groupInvitation.create({
            data: {
                groupId: groupId,
                invitedUserId: invitedUser.id,
                invitingUserId: userId,
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
            await this.prisma.groupInvitation.update({
                where: {id: invitation.id},
                data: {status: "ACCEPTED"},
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

        const joinRequest = await this.prisma.membershipRequest.findFirst({
            where: {
                groupId,
                userId,
            },
        });

        if (joinRequest) {
            await this.prisma.membershipRequest.delete({
                where: {id: joinRequest.id},
            });
        }

        return true;
    }

    async cancelInvitation(groupId: string, UsernameDto: UsernameDto, userId: string) {
        const {username} = UsernameDto;

        const hasPermissions = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId,
                    },
                    {
                        moderators: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
        });

        if (!hasPermissions) {
            throw new BadRequestException("No tienes permisos para invitar.");
        }
        const invitedUser = await this.prisma.user.findUnique({
            where: {username},
            select: {
                id: true,
                expoPushToken: true,
            },
        });

        if (!invitedUser) {
            throw new NotFoundException("No se encontró el usuario a cancelar la invitación.");
        }

        const invitation = await this.prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: invitedUser.id,
            },
        });

        if (invitation) {
            return this.prisma.groupInvitation.delete({
                where: {id: invitation.id},
            });
        } else {
            return false;
        }
    }

    async acceptJoinRequest(groupId: string, userId: string, joinRequestDto: JoinRequestDto) {
        const {userId: requesterUserId} = joinRequestDto;

        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId,
                    },
                    {
                        moderators: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            include: {
                moderators: {
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
        if (!group) {
            throw new NotFoundException("Group not found");
        }
        const joinRequest = await this.prisma.membershipRequest.findFirst({
            where: {
                groupId,
                userId: requesterUserId,
            },
        });

        if (!joinRequest) {
            throw new NotFoundException("Join request not found");
        }

        await this.prisma.membershipRequest.update({
            where: {
                id: joinRequest.id,
            },
            data: {
                status: "ACCEPTED",
            },
        });

        await this.prisma.groupMember.create({
            data: {
                groupId,
                userId: requesterUserId,
            },
        });
        this.notifications.sendGroupJoinAcceptedNotification(requesterUserId, group);

        return true;
    }

    async declineJoinRequest(groupId: string, userId: string, joinRequestDto: JoinRequestDto) {
        const {userId: requesterUserId} = joinRequestDto;

        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });
        if (!group) {
            throw new NotFoundException("Group not found");
        }

        const joinRequest = await this.prisma.membershipRequest.findFirst({
            where: {
                groupId,
                OR: [
                    {
                        userId: requesterUserId,
                    },
                    {
                        groupId,
                    },
                ],
                status: "PENDING",
            },
        });

        if (!joinRequest) {
            throw new NotFoundException("Join request not found");
        }
        if (joinRequest.status === "ACCEPTED" || joinRequest.status === "DECLINED") {
            throw new BadRequestException("Solicitud ya procesada");
        }
        await this.prisma.membershipRequest.update({
            where: {
                id: joinRequest.id,
            },
            data: {
                status: "DECLINED",
            },
        });
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

    async getJoinRequests(userId: string) {
        return await this.prisma.membershipRequest.findMany({
            where: {
                OR: [
                    {
                        group: {
                            leaderId: userId,
                        },
                    },
                    {
                        group: {
                            moderators: {
                                some: {
                                    userId: userId,
                                },
                            },
                        },
                    },
                ],
                status: "PENDING",
            },
            include: {
                group: {
                    include: {
                        leader: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
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
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true,
                                            },
                                        },
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
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true,
                                            },
                                        },
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
                },
                user: {
                    select: {
                        username: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true,
                            },
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                    },
                },
            },
        });
    }

    async getGroupInvitations(userId: string) {
        return await this.prisma.membershipRequest.findMany({
            where: {
                OR: [
                    {
                        group: {
                            leaderId: userId,
                        },
                    },
                    {
                        group: {
                            moderators: {
                                some: {
                                    userId: userId,
                                },
                            },
                        },
                    },
                ],
                status: "PENDING",
            },
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true,
                            },
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                    },
                },
                group: {
                    select: {
                        leader: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true,
                                    },
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                            },
                        },
                        members: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true,
                                            },
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
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
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true,
                                            },
                                        },
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
        });
    }

    async requestJoin(groupId: string, userId: string) {
        // Obtenemos la información del group.
        const group = await this.prisma.group.findUnique({
            where: {id: groupId},
        });

        if (!group) {
            throw new NotFoundException("Grupo no encontrado");
        }

        // Verificar si el usuario ya es un miembro del grupo.
        const isUserMember = await this.prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId,
                },
            },
        });

        if (isUserMember) {
            throw new InternalServerErrorException("El usuario ya es miembro de este grupo");
        }

        // Si el group es público
        if (!group.private) {
            // Unir el usuario al group
            await this.prisma.groupMember.create({
                data: {
                    groupId,
                    userId,
                },
            });
            return true;
        } else {
            // Verificar si el usuario o grupo ya ha solicitado unirse al grupo.
            const existingRequest = await this.prisma.membershipRequest.findUnique({
                where: {
                    userId_groupId: {
                        userId,
                        groupId,
                    },
                    status: "PENDING",
                },
            });

            if (existingRequest) {
                throw new Error("Ya has solicitado unirte a este grupo");
            }
            await this.prisma.membershipRequest.create({
                data: {
                    userId,
                    groupId,
                    type: "SOLO",
                },
            });

            return true;
        }
    }

    async deleteMember(groupId: string, usernameDto: UsernameDto, userId: string) {
        const {username} = usernameDto;
        // Obtenemos la información del group.
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId,
                    },
                    {
                        moderators: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
        });

        if (!group) {
            throw new NotFoundException("Grupo no encontrado, o no tienes permisos");
        }

        const targetUser = await this.prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });

        if (!targetUser) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Verificar si el usuario ya es un miembro del grupo.
        const isUserMember = await this.prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId: targetUser.id,
                    groupId,
                },
            },
        });

        if (!isUserMember) {
            throw new InternalServerErrorException("El usuario ya es miembro de este grupo");
        }

        // Verificar si el usuario ya es un miembro del grupo.
        await this.prisma.userGroupModerator.delete({
            where: {
                userId_groupId: {
                    userId: targetUser.id,
                    groupId,
                },
            },
        });

        await this.prisma.membershipRequest.deleteMany({
            where: {
                userId: targetUser.id,
                groupId,
            },
        });
    }

    async deleteMod(groupId: string, usernameDto: UsernameDto, userId: string) {
        const {username} = usernameDto;
        // Obtenemos la información del group.
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId,
                    },
                    {
                        moderators: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
        });

        if (!group) {
            throw new NotFoundException("Grupo no encontrado, o no tienes permisos");
        }

        const targetUser = await this.prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });

        if (!targetUser) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Verificar si el usuario ya es un miembro del grupo.
        const isUserMember = await this.prisma.userGroupModerator.delete({
            where: {
                userId_groupId: {
                    userId: targetUser.id,
                    groupId,
                },
            },
        });

        if (!isUserMember) {
            throw new InternalServerErrorException("El usuario ya es miembro de este grupo");
        }

        await this.prisma.membershipRequest.deleteMany({
            where: {
                userId: targetUser.id,
                groupId,
            },
        });
    }

    async addMemberToModList(groupId: string, usernameDto: UsernameDto, userId: string) {
        const {username} = usernameDto;
        // Obtenemos la información del group.
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                leaderId: userId,
            },
        });

        if (!group) {
            throw new NotFoundException("Grupo no encontrado, o no tienes permisos");
        }

        const targetUser = await this.prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });

        if (!targetUser) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Verificar si el usuario ya es un miembro del grupo.
        const isUserMember = await this.prisma.userGroupModerator.create({
            data: {
                userId: targetUser.id,
                groupId,
            },
        });

        if (!isUserMember) {
            throw new InternalServerErrorException("El usuario ya es mod de este grupo");
        }
    }
}
