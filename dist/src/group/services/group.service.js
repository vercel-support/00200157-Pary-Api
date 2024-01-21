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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../db/services/prisma.service");
const notifications_service_1 = require("../../notifications/services/notifications.service");
const utils_service_1 = require("../../utils/services/utils.service");
let GroupService = class GroupService {
    constructor(prisma, utils, notifications) {
        this.prisma = prisma;
        this.utils = utils;
        this.notifications = notifications;
    }
    async createGroup(groupBody, userId) {
        const { name, description, inviteUserNames, ageRange, showInFeed, isPrivate } = groupBody;
        const inviter = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                username: true,
                socialMedia: true,
                id: true
            }
        });
        if (!inviter) {
            throw new common_1.NotFoundException("User not found.");
        }
        const userGroupsSize = await this.prisma.group.count({
            where: {
                leaderId: userId
            }
        });
        if (userGroupsSize >= 5) {
            throw new common_1.BadRequestException("You can only create up to 5 groups.");
        }
        const group = await this.prisma.group.create({
            data: {
                name,
                description,
                leaderId: userId,
                ageRange,
                private: isPrivate,
                showInFeed
            }
        });
        await this.prisma.groupMember.create({
            data: {
                groupId: group.id,
                userId
            }
        });
        if (inviteUserNames) {
            const users = await this.prisma.user.findMany({
                where: {
                    username: {
                        in: inviteUserNames
                    }
                },
                select: {
                    id: true,
                    username: true,
                    socialMedia: true,
                    expoPushToken: true
                }
            });
            for (const user of users) {
                if (user.id === userId)
                    continue;
                const response = await this.prisma.groupInvitation.create({
                    data: {
                        groupId: group.id,
                        invitedUserId: user.id,
                        invitingUserId: userId
                    }
                });
                if (response) {
                    this.notifications.sendGroupInviteNotification(user.expoPushToken, inviter, group.name, group.id);
                }
            }
        }
        return group;
    }
    async updateGroup(groupBody, userId) {
        const { id, name, description, ageRange, showInFeed, isPrivate } = groupBody;
        const group = await this.prisma.group.update({
            where: {
                id,
                leaderId: userId
            },
            data: {
                name,
                description,
                ageRange,
                private: isPrivate,
                showInFeed
            }
        });
        return group;
    }
    async getOwnGroups(paginationDto, userId) {
        const { page, limit } = paginationDto;
        const skip = page * limit;
        const groups = await this.prisma.group.findMany({
            where: {
                OR: [{ members: { some: { userId } } }, { leaderId: userId }, { moderators: { some: { userId } } }]
            },
            take: limit,
            skip: skip,
            orderBy: { name: "asc" },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true
                            }
                        }
                    }
                },
                leader: {
                    select: {
                        username: true,
                        socialMedia: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                        userType: true
                    }
                },
                moderators: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true
                            }
                        }
                    }
                }
            }
        });
        const totalGroups = await this.prisma.group.count({
            where: {
                OR: [{ members: { some: { userId } } }, { leaderId: userId }, { moderators: { some: { userId } } }]
            }
        });
        const hasNextPage = page * limit < totalGroups;
        const nextPage = hasNextPage ? page + 1 : null;
        return { groups, hasNextPage, nextPage };
    }
    async getInvitedGroups(paginationDto, userId) {
        const { page, limit } = paginationDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
                                                socialMedia: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {
                                                    take: 1,
                                                    select: {
                                                        url: true,
                                                        id: true
                                                    }
                                                },
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                                userType: true
                                            }
                                        }
                                    }
                                },
                                leader: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                },
                                moderators: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                socialMedia: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {
                                                    take: 1,
                                                    select: {
                                                        url: true,
                                                        id: true
                                                    }
                                                },
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                                userType: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const totalGroups = user.invitedGroups.length;
        const hasNextPage = page * limit < totalGroups;
        const nextPage = hasNextPage ? page + 1 : null;
        return { groups: user.invitedGroups, hasNextPage, nextPage };
    }
    async getGroup(groupId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: {
                leader: {
                    select: {
                        username: true,
                        socialMedia: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        description: true,
                        birthDate: true,
                        gender: true,
                        interests: true,
                        userType: true,
                        verified: true,
                        location: {
                            select: {
                                name: true
                            }
                        },
                        createdAt: true,
                        lastLogin: true,
                        isCompany: true
                    }
                },
                members: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                description: true,
                                birthDate: true,
                                gender: true,
                                interests: true,
                                userType: true,
                                verified: true,
                                location: {
                                    select: {
                                        name: true
                                    }
                                },
                                createdAt: true,
                                lastLogin: true,
                                isCompany: true
                            }
                        }
                    }
                },
                moderators: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                description: true,
                                birthDate: true,
                                gender: true,
                                interests: true,
                                userType: true,
                                verified: true,
                                location: {
                                    select: {
                                        name: true
                                    }
                                },
                                createdAt: true,
                                lastLogin: true,
                                isCompany: true
                            }
                        }
                    }
                },
                invitations: {
                    include: {
                        invitingUser: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true
                            }
                        },
                        invitedUser: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true
                            }
                        }
                    }
                },
                parties: {
                    select: {
                        partyId: true,
                        party: {
                            include: {
                                location: {
                                    select: {
                                        id: true,
                                        name: true,
                                        latitude: true,
                                        longitude: true,
                                        timestamp: true,
                                        address: true
                                    }
                                },
                                consumables: true,
                                covers: true,
                                owner: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                },
                                members: {
                                    select: {
                                        userId: true,
                                        user: {
                                            select: {
                                                username: true,
                                                socialMedia: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {
                                                    take: 1
                                                },
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                                userType: true
                                            }
                                        }
                                    }
                                },
                                moderators: {
                                    select: {
                                        userId: true,
                                        user: {
                                            select: {
                                                username: true,
                                                socialMedia: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {
                                                    take: 1
                                                },
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                                userType: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return group;
    }
    async deleteGroup(groupId, userId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            select: {
                leaderId: true
            }
        });
        if (!group) {
            throw new common_1.NotFoundException("Group not found.");
        }
        if (group.leaderId !== userId) {
            throw new common_1.BadRequestException("Only the group leader and moderators can update the group.");
        }
        await this.prisma.group.delete({
            where: { id: groupId }
        });
        return true;
    }
    async inviteToGroup(groupId, usernameDto, userId) {
        const { username } = usernameDto;
        const hasPermissions = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!hasPermissions) {
            throw new common_1.BadRequestException("No tienes permisos para invitar.");
        }
        const invitedUser = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                expoPushToken: true
            }
        });
        if (!invitedUser) {
            throw new common_1.NotFoundException("No se encontró el usuario a invitar.");
        }
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            select: {
                leaderId: true,
                id: true,
                name: true,
                moderators: {
                    select: {
                        userId: true
                    }
                }
            }
        });
        const invitation = await this.prisma.groupInvitation.create({
            data: {
                groupId: groupId,
                invitedUserId: invitedUser.id,
                invitingUserId: userId
            }
        });
        const inviter = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                socialMedia: true,
                name: true
            }
        });
        this.notifications.sendGroupInviteNotification(invitedUser.expoPushToken, inviter, group.name, group.id);
        return invitation;
    }
    async acceptInvitation(groupId, userId) {
        const invitation = await this.prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: userId
            }
        });
        if (invitation) {
            await this.prisma.groupInvitation.update({
                where: { id: invitation.id },
                data: { status: "ACCEPTED" }
            });
        }
        await this.prisma.groupMember.create({
            data: {
                groupId: groupId,
                userId: userId
            }
        });
        const members = await this.prisma.group.findMany({
            where: {
                id: groupId
            },
            select: {
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
        if (members) {
            const expoTokens = members.flatMap(member => member.members.map(groupMember => groupMember.user.expoPushToken));
            this.notifications.sendNewGroupMemberNotification(expoTokens, userId, groupId);
        }
        return true;
    }
    async declineInvitation(groupId, userId) {
        const invitation = await this.prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: userId
            }
        });
        if (invitation) {
            await this.prisma.groupInvitation.delete({
                where: { id: invitation.id }
            });
        }
        const joinRequest = await this.prisma.groupMembershipRequest.findFirst({
            where: {
                groupId,
                userId
            }
        });
        if (joinRequest) {
            await this.prisma.groupMembershipRequest.delete({
                where: { id: joinRequest.id }
            });
        }
        return true;
    }
    async cancelInvitation(groupId, UsernameDto, userId) {
        const { username } = UsernameDto;
        const hasPermissions = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!hasPermissions) {
            throw new common_1.BadRequestException("No tienes permisos para invitar.");
        }
        const invitedUser = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                expoPushToken: true
            }
        });
        if (!invitedUser) {
            throw new common_1.NotFoundException("No se encontró el usuario a cancelar la invitación.");
        }
        const invitation = await this.prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: invitedUser.id
            }
        });
        if (invitation) {
            return this.prisma.groupInvitation.delete({
                where: { id: invitation.id }
            });
        }
        return false;
    }
    async acceptJoinRequest(groupId, userId, joinRequestDto) {
        const { userId: requesterUserId } = joinRequestDto;
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            },
            include: {
                moderators: {
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
        if (!group) {
            throw new common_1.NotFoundException("Group not found");
        }
        const joinRequest = await this.prisma.groupMembershipRequest.findFirst({
            where: {
                groupId,
                userId: requesterUserId
            }
        });
        if (!joinRequest) {
            throw new common_1.NotFoundException("Join request not found");
        }
        await this.prisma.groupMembershipRequest.update({
            where: {
                id: joinRequest.id
            },
            data: {
                status: "ACCEPTED"
            }
        });
        await this.prisma.groupMember.create({
            data: {
                groupId,
                userId: requesterUserId
            }
        });
        this.notifications.sendGroupJoinAcceptedNotification(requesterUserId, group);
        return true;
    }
    async declineJoinRequest(groupId, userId, joinRequestDto) {
        const { userId: requesterUserId } = joinRequestDto;
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId
            }
        });
        if (!group) {
            throw new common_1.NotFoundException("Group not found");
        }
        const joinRequest = await this.prisma.groupMembershipRequest.findFirst({
            where: {
                groupId,
                OR: [
                    {
                        userId: requesterUserId
                    },
                    {
                        groupId
                    }
                ],
                status: "PENDING"
            }
        });
        if (!joinRequest) {
            throw new common_1.NotFoundException("Join request not found");
        }
        if (joinRequest.status === "ACCEPTED" || joinRequest.status === "DECLINED") {
            throw new common_1.BadRequestException("Solicitud ya procesada");
        }
        await this.prisma.groupMembershipRequest.update({
            where: {
                id: joinRequest.id
            },
            data: {
                status: "DECLINED"
            }
        });
        return true;
    }
    async leaveGroup(groupId, userId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId }
        });
        if (!group) {
            throw new common_1.NotFoundException("User not found.");
        }
        if (group.leaderId === userId) {
            await this.prisma.groupInvitation.deleteMany({
                where: { groupId: groupId }
            });
            await this.prisma.groupMember.deleteMany({
                where: { groupId: groupId }
            });
            await this.prisma.partyGroup.deleteMany({
                where: { groupId: groupId }
            });
            await this.prisma.group.delete({
                where: { id: groupId }
            });
            return true;
        }
        const isMember = await this.prisma.groupMember.findFirst({
            where: {
                groupId: groupId,
                userId
            }
        });
        if (!isMember) {
            throw new common_1.BadRequestException("You are not a member of this group.");
        }
        await this.prisma.groupInvitation.deleteMany({
            where: {
                groupId: groupId,
                OR: [{ invitedUserId: userId }, { invitingUserId: userId }]
            }
        });
        await this.prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    groupId: groupId,
                    userId
                }
            }
        });
        return true;
    }
    async getJoinRequests(userId) {
        return await this.prisma.groupMembershipRequest.findMany({
            where: {
                OR: [
                    {
                        group: {
                            leaderId: userId
                        }
                    },
                    {
                        group: {
                            moderators: {
                                some: {
                                    userId: userId
                                }
                            }
                        }
                    }
                ],
                status: "PENDING"
            },
            include: {
                group: {
                    include: {
                        leader: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                description: true,
                                birthDate: true,
                                gender: true,
                                interests: true,
                                userType: true,
                                verified: true,
                                location: {
                                    select: {
                                        name: true
                                    }
                                },
                                createdAt: true,
                                lastLogin: true,
                                isCompany: true
                            }
                        },
                        members: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        description: true,
                                        birthDate: true,
                                        gender: true,
                                        interests: true,
                                        userType: true,
                                        verified: true,
                                        location: {
                                            select: {
                                                name: true
                                            }
                                        },
                                        createdAt: true,
                                        lastLogin: true,
                                        isCompany: true
                                    }
                                }
                            }
                        },
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        description: true,
                                        birthDate: true,
                                        gender: true,
                                        interests: true,
                                        userType: true,
                                        verified: true,
                                        location: {
                                            select: {
                                                name: true
                                            }
                                        },
                                        createdAt: true,
                                        lastLogin: true,
                                        isCompany: true
                                    }
                                }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        username: true,
                        socialMedia: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                        userType: true
                    }
                }
            }
        });
    }
    async getGroupInvitations(userId) {
        const invitations = await this.prisma.groupInvitation.findMany({
            where: {
                invitedUserId: userId,
                status: "PENDING"
            },
            include: {
                invitedUser: {
                    select: {
                        username: true,
                        socialMedia: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                        userType: true
                    }
                },
                group: {
                    include: {
                        leader: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true
                            }
                        },
                        members: {
                            orderBy: {
                                createdAt: "asc"
                            },
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        },
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return invitations.map(inv => {
            const { invitedUser, group, invitedUserId } = inv;
            return {
                user: invitedUser,
                userId: invitedUserId,
                group,
                groupId: group.id
            };
        });
    }
    async requestJoin(groupId, userId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId }
        });
        if (!group) {
            throw new common_1.NotFoundException("Grupo no encontrado");
        }
        const isUserMember = await this.prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId
                }
            }
        });
        if (isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es miembro de este grupo");
        }
        if (!group.private) {
            await this.prisma.groupMember.create({
                data: {
                    groupId,
                    userId
                }
            });
            return true;
        }
        const existingRequest = await this.prisma.groupMembershipRequest.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId
                },
                status: "PENDING"
            }
        });
        if (existingRequest) {
            throw new Error("Ya has solicitado unirte a este grupo");
        }
        await this.prisma.groupMembershipRequest.create({
            data: {
                userId,
                groupId
            }
        });
        return true;
    }
    async deleteMember(groupId, usernameDto, userId) {
        const { username } = usernameDto;
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!group) {
            throw new common_1.NotFoundException("Grupo no encontrado, o no tienes permisos");
        }
        const targetUser = await this.prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        if (!targetUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const isUserMember = await this.prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId: targetUser.id,
                    groupId
                }
            }
        });
        if (!isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es miembro de este grupo");
        }
        await this.prisma.userGroupModerator.delete({
            where: {
                userId_groupId: {
                    userId: targetUser.id,
                    groupId
                }
            }
        });
        await this.prisma.groupMembershipRequest.deleteMany({
            where: {
                userId: targetUser.id,
                groupId
            }
        });
    }
    async deleteMod(groupId, usernameDto, userId) {
        const { username } = usernameDto;
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                OR: [
                    {
                        leaderId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!group) {
            throw new common_1.NotFoundException("Grupo no encontrado, o no tienes permisos");
        }
        const targetUser = await this.prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        if (!targetUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const isUserMember = await this.prisma.userGroupModerator.delete({
            where: {
                userId_groupId: {
                    userId: targetUser.id,
                    groupId
                }
            }
        });
        if (!isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es miembro de este grupo");
        }
        await this.prisma.groupMembershipRequest.deleteMany({
            where: {
                userId: targetUser.id,
                groupId
            }
        });
    }
    async addMemberToModList(groupId, usernameDto, userId) {
        const { username } = usernameDto;
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                leaderId: userId
            }
        });
        if (!group) {
            throw new common_1.NotFoundException("Grupo no encontrado, o no tienes permisos");
        }
        const targetUser = await this.prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        if (!targetUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const isUserMember = await this.prisma.userGroupModerator.create({
            data: {
                userId: targetUser.id,
                groupId
            }
        });
        if (!isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es mod de este grupo");
        }
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        notifications_service_1.NotificationsService])
], GroupService);
//# sourceMappingURL=group.service.js.map