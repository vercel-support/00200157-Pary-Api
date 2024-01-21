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
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const Requests_1 = require("../../db/Requests");
const prisma_service_1 = require("../../db/services/prisma.service");
const notifications_service_1 = require("../../notifications/services/notifications.service");
const utils_service_1 = require("../../utils/services/utils.service");
let FeedService = class FeedService {
    constructor(prisma, utils, notifications) {
        this.prisma = prisma;
        this.utils = utils;
        this.notifications = notifications;
        this.MAX_DISTANCE = 999999;
    }
    async search(searchDto, userId) {
        const { page, limit, search } = searchDto;
        const skip = page * limit;
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                location: true
            }
        });
        if (!currentUser) {
            throw new common_1.NotFoundException("Usuario no encontrado.");
        }
        const users = await this.prisma.user.findMany({
            skip: skip,
            take: limit,
            where: {
                signedIn: true,
                OR: [
                    { username: { contains: search, mode: "insensitive" } },
                    { name: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                    { interests: { has: search } }
                ]
            },
            orderBy: [{ isCompany: "desc" }, { verified: "desc" }, { username: "desc" }, { userType: "desc" }],
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
                userType: true,
                description: true,
                birthDate: true,
                interests: true,
                location: true,
                createdAt: true,
                lastLogin: true
            }
        });
        const parties = await this.prisma.party.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    {
                        owner: {
                            OR: [
                                {
                                    username: { contains: search, mode: "insensitive" }
                                },
                                {
                                    name: { contains: search, mode: "insensitive" }
                                },
                                {
                                    lastName: { contains: search, mode: "insensitive" }
                                }
                            ]
                        }
                    },
                    { tags: { has: search } },
                    {
                        location: {
                            name: { contains: search, mode: "insensitive" }
                        }
                    }
                ]
            },
            include: Requests_1.PARTY_REQUEST,
            orderBy: { advertisement: "desc" }
        });
        const groups = await this.prisma.group.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    {
                        leader: {
                            OR: [
                                {
                                    username: { contains: search, mode: "insensitive" }
                                },
                                {
                                    name: { contains: search, mode: "insensitive" }
                                },
                                {
                                    lastName: { contains: search, mode: "insensitive" }
                                }
                            ]
                        }
                    }
                ]
            },
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
        const partiesToReturn = await Promise.all(parties.map(async (party) => {
            party.distance = this.utils.haversineDistance(currentUser.location, party.location);
            return party;
        }));
        return { users, parties: partiesToReturn, groups };
    }
    async getPersonalizedParties(personalizedParties, userId) {
        const { partyLimit, groupLimit, distanceLimit } = personalizedParties;
        let { partyPage } = personalizedParties;
        const { groupPage } = personalizedParties;
        const foundedGroups = [];
        const foundedParties = [];
        const totalGroups = 0;
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                socialMedia: true,
                location: true,
                interests: true,
                followingUserList: {
                    select: {
                        followedUserId: true
                    }
                }
            }
        });
        if (!currentUser) {
            throw new common_1.NotFoundException("User not found.");
        }
        const followedUsers = currentUser.followingUserList.map(follow => follow.followedUserId);
        const currentDateTime = new Date();
        const queryFilters = {
            date: { gte: currentDateTime },
            active: true
        };
        const totalParties = await this.prisma.party.count({ where: queryFilters });
        while (foundedParties.length < partyLimit && partyPage * partyLimit < totalParties) {
            const parties = await this.prisma.party.findMany({
                skip: partyPage * partyLimit,
                take: partyLimit,
                orderBy: [{ date: "desc" }],
                where: queryFilters,
                include: Requests_1.PARTY_REQUEST
            });
            const partiesToReturn = await Promise.all(parties.map(async (party) => {
                const distance = this.utils.haversineDistance(currentUser.location, party.location);
                let relevanceScore = 0;
                for (const tag of party.tags) {
                    if (currentUser.interests.includes(tag))
                        relevanceScore++;
                }
                if (followedUsers.includes(party.ownerId))
                    relevanceScore++;
                if (party.members.some(member => followedUsers.includes(member.userId)))
                    relevanceScore++;
                return { ...party, distance, relevanceScore };
            }));
            foundedParties.push(...partiesToReturn
                .filter(party => {
                return (party && party.distance <= distanceLimit);
            })
                .sort((a, b) => b?.relevanceScore - a?.relevanceScore));
            partyPage++;
        }
        return {
            parties: foundedParties,
            groups: foundedGroups,
            partyPage,
            groupPage,
            reachedMaxPartiesInDB: partyPage * partyLimit >= totalParties,
            reachedMaxGroupsInDB: groupPage * groupLimit >= totalGroups
        };
    }
    async getFollowers(followerDto) {
        const { page, limit, username } = followerDto;
        const skip = page * 10;
        const user = await this.prisma.user.findUnique({
            where: { username: username },
            select: {
                followerUserList: true
            }
        });
        if (user === null) {
            throw new common_1.NotFoundException("User not found.");
        }
        const followers = user?.followerUserList.map(follower => follower.followerUserId);
        return await this.prisma.user.findMany({
            take: limit,
            skip,
            where: {
                id: {
                    in: followers
                }
            },
            select: {
                username: true,
                socialMedia: true,
                name: true,
                lastName: true,
                description: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true
                    }
                },
                verified: true,
                isCompany: true,
                gender: true,
                userType: true
            }
        });
    }
    async getFollowing(followingDto) {
        const { page, limit, username } = followingDto;
        const skip = page * 10;
        const user = await this.prisma.user.findUnique({
            where: { username: username },
            select: {
                followingUserList: true
            }
        });
        if (user === null) {
            throw new common_1.NotFoundException("User not found.");
        }
        const followers = user?.followingUserList.map(follower => follower.followedUserId);
        return await this.prisma.user.findMany({
            take: limit,
            skip,
            where: {
                id: {
                    in: followers
                }
            },
            select: {
                username: true,
                socialMedia: true,
                name: true,
                lastName: true,
                description: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true
                    }
                },
                verified: true,
                isCompany: true,
                gender: true,
                userType: true
            }
        });
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        notifications_service_1.NotificationsService])
], FeedService);
//# sourceMappingURL=feed.service.js.map