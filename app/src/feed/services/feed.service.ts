import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../db/services/prisma.service";
import {UtilsService} from "../../utils/services/utils.service";
import {NotificationsService} from "../../notifications/services/notifications.service";
import {PARTY_REQUEST} from "../../db/Requests";
import {SearchDto} from "../dto/Search.dto";
import {PersonalizedPartiesDto} from "../dto/PersonalizedParties.dto";
import {FollowersFollowingDto} from "../dto/FollowersFollowing.dto";

@Injectable()
export class FeedService {
    private readonly MAX_DISTANCE = 999999;

    constructor(
        private prisma: PrismaService,
        private utils: UtilsService,
        private notifications: NotificationsService,
    ) {}

    async search(searchDto: SearchDto, userId: string) {
        const {page, limit, search} = searchDto;
        const skip = page * limit;

        const currentUser = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                location: true,
            },
        });

        if (!currentUser) {
            throw new NotFoundException("Usuario no encontrado.");
        }

        const users = await this.prisma.user.findMany({
            skip: skip,
            take: limit,
            where: {
                signedIn: true,
                OR: [
                    {username: {contains: search, mode: "insensitive"}},
                    {name: {contains: search, mode: "insensitive"}},
                    {lastName: {contains: search, mode: "insensitive"}},
                    {techInterest: {has: search}},
                    {musicInterest: {has: search}},
                    {deportsInterest: {has: search}},
                    {hobbiesInterest: {has: search}},
                    {artAndCultureInterest: {has: search}},
                ],
            },
            orderBy: [{isCompany: "desc"}, {verified: "desc"}, {username: "desc"}],
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
                location: true,
                createdAt: true,
                lastLogin: true,
                isCompany: true,
            },
        });

        const parties = await this.prisma.party.findMany({
            skip: skip,
            take: limit,
            where: {
                OR: [
                    {name: {contains: search, mode: "insensitive"}},
                    {
                        owner: {
                            username: {contains: search, mode: "insensitive"},
                        },
                    },
                    {tags: {has: search}},
                ],
            },
            include: PARTY_REQUEST,
            orderBy: {advertisement: "desc"},
        });

        const partiesToReturn = await Promise.all(
            parties.map(async party => {
                party.distance = this.utils.haversineDistance(currentUser.location, party.location);
                return party;
            }),
        );

        return {users, parties: partiesToReturn};
    }

    async getPersonalizedParties(personalizedParties: PersonalizedPartiesDto, userId: string) {
        const {limit, maxAge, minAge, distanceLimit, showGroups} = personalizedParties;
        let {page} = personalizedParties;
        const groups = [];
        const currentUser = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                username: true,
                location: true,
                musicInterest: true,
                deportsInterest: true,
                artAndCultureInterest: true,
                techInterest: true,
                hobbiesInterest: true,
                followingUserList: {
                    select: {
                        followedUserId: true,
                    },
                },
            },
        });

        if (!currentUser) {
            throw new NotFoundException("User not found.");
        }

        const followedUsers = currentUser.followingUserList.map(follow => follow.followedUserId);
        const currentDateTime = new Date();

        if (showGroups) {
            const groupQueryFilters = {
                private: false,
            };

            const availableGroups = await this.prisma.group.findMany({
                where: groupQueryFilters,
                include: {
                    leader: {
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
                    members: {
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

            groups.push(...availableGroups);
        }

        const queryFilters = {
            date: {gte: currentDateTime},
            active: true,
            private: false,
            OR: [
                {
                    moderators: {
                        some: {
                            userId: userId,
                        },
                    },
                },
                {
                    ownerId: userId,
                },
                {
                    members: {
                        some: {
                            userId: userId,
                        },
                    },
                },
                {
                    invitations: {
                        some: {
                            invitedUserId: userId,
                        },
                    },
                },
                {
                    membershipRequests: {
                        some: {
                            userId: userId,
                        },
                    },
                },
            ],
        };

        const totalParties = await this.prisma.party.count({where: queryFilters});

        const foundedParties = [];
        while (foundedParties.length < limit && page * limit < totalParties) {
            const parties = await this.prisma.party.findMany({
                skip: page * limit,
                take: limit,
                orderBy: [{date: "asc"}],
                where: queryFilters,
                include: PARTY_REQUEST,
            });

            const partiesToReturn = await Promise.all(
                parties.map(async party => {
                    const distance = this.utils.haversineDistance(currentUser.location, party.location);

                    let relevanceScore = 0;
                    for (const tag of party.tags) {
                        if (currentUser.musicInterest.includes(tag)) relevanceScore++;
                        if (currentUser.deportsInterest.includes(tag)) relevanceScore++;
                        if (currentUser.artAndCultureInterest.includes(tag)) relevanceScore++;
                        if (currentUser.techInterest.includes(tag)) relevanceScore++;
                        if (currentUser.hobbiesInterest.includes(tag)) relevanceScore++;
                    }

                    if (followedUsers.includes(party.ownerId!)) relevanceScore++;
                    if (party.members.some(member => followedUsers.includes(member.userId))) relevanceScore++;

                    return {...party, distance, relevanceScore};
                }),
            );

            foundedParties.push(
                ...partiesToReturn
                    .filter(party => {
                        return (
                            party &&
                            party.distance <= distanceLimit &&
                            party.ageRange.min >= minAge &&
                            party.ageRange.max <= maxAge
                        );
                    })
                    .sort((a, b) => b!.relevanceScore - a!.relevanceScore),
            );
            page++;
        }
        return {
            parties: foundedParties,
            step: page,
            groups,
            reachedMaxItemsInDB: page * limit >= totalParties,
        };
    }

    async getFollowers(followerDto: FollowersFollowingDto) {
        const {page, limit, username} = followerDto;
        const skip = page * 10;
        const user = await this.prisma.user.findUnique({
            where: {username: username},
            select: {
                followerUserList: true,
            },
        });
        if (user === null) {
            throw new NotFoundException("User not found.");
        }
        const followers = user?.followerUserList.map(follower => follower.followerUserId);

        return await this.prisma.user.findMany({
            take: limit,
            skip,
            where: {
                id: {
                    in: followers,
                },
            },
            select: {
                username: true,
                name: true,
                lastName: true,
                description: true,
                verified: true,
                isCompany: true,
                gender: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true,
                    },
                },
            },
        });
    }

    async getFollowing(followingDto: FollowersFollowingDto) {
        const {page, limit, username} = followingDto;
        const skip = page * 10;
        const user = await this.prisma.user.findUnique({
            where: {username: username},
            select: {
                followingUserList: true,
            },
        });
        if (user === null) {
            throw new NotFoundException("User not found.");
        }
        const followers = user?.followingUserList.map(follower => follower.followedUserId);

        return await this.prisma.user.findMany({
            take: limit,
            skip,
            where: {
                id: {
                    in: followers,
                },
            },
            select: {
                username: true,
                name: true,
                lastName: true,
                description: true,
                verified: true,
                isCompany: true,
                gender: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true,
                    },
                },
            },
        });
    }
}
