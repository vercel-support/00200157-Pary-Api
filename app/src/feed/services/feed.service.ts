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
                    {interests: {has: search}},
                ],
            },
            orderBy: [{isCompany: "desc"}, {verified: "desc"}, {username: "desc"}],
            select: {
                username: true,
                socialMedia: true,
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
                interests: true,
                userType: true,
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
        const {partyLimit, groupLimit, distanceLimit /* , maxAge, minAge, showGroups */} = personalizedParties;
        let {partyPage} = personalizedParties;
        const {groupPage} = personalizedParties;
        const foundedGroups = [];
        const foundedParties = [];
        const totalGroups = 0;
        const currentUser = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                username: true,
                socialMedia: true,
                location: true,
                interests: true,
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

        /*if (showGroups) {
            const queryFilters = {
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
                                id: true,
                            },
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                        userType: true,
                    },
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
                                        id: true,
                                    },
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true,
                            },
                        },
                    },
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
                                        id: true,
                                    },
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true,
                            },
                        },
                    },
                },
            };

            totalGroups = await this.prisma.group.count({
                where: {
                    showInFeed: true,
                },
            });
            while (foundedGroups.length < groupLimit && groupPage * groupLimit < totalGroups) {
                const groups = await this.prisma.group.findMany({
                    where: {
                        showInFeed: true,
                    },
                    include: queryFilters,
                    skip: groupPage * groupLimit,
                    take: groupLimit,
                });

                foundedGroups.push(...groups);
                groupPage++;
            }
        }*/

        const queryFilters = {
            date: {gte: currentDateTime},
            active: true,
        };

        const totalParties = await this.prisma.party.count({where: queryFilters});

        while (foundedParties.length < partyLimit && partyPage * partyLimit < totalParties) {
            const parties = await this.prisma.party.findMany({
                skip: partyPage * partyLimit,
                take: partyLimit,
                orderBy: [{date: "asc"}],
                where: queryFilters,
                include: PARTY_REQUEST,
            });

            const partiesToReturn = await Promise.all(
                parties.map(async party => {
                    const distance = this.utils.haversineDistance(currentUser.location, party.location);

                    let relevanceScore = 0;
                    for (const tag of party.tags) {
                        if (currentUser.interests.includes(tag)) relevanceScore++;
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
                            party && party.distance <= distanceLimit /*&&
                            party.ageRange.min >= minAge &&
                            party.ageRange.max <= maxAge*/
                        );
                    })
                    .sort((a, b) => b!.relevanceScore - a!.relevanceScore),
            );
            partyPage++;
        }
        return {
            parties: foundedParties,
            groups: foundedGroups,
            partyPage,
            groupPage,
            reachedMaxPartiesInDB: partyPage * partyLimit >= totalParties,
            reachedMaxGroupsInDB: groupPage * groupLimit >= totalGroups,
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
                socialMedia: true,
                name: true,
                lastName: true,
                description: true,
                verified: true,
                isCompany: true,
                gender: true,
                userType: true,
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
                socialMedia: true,
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
