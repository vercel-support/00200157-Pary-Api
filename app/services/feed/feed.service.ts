import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../db/prisma.service";
import {UtilsService} from "../utils/utils.service";
import {NotificationsService} from "../notifications/notifications.service";

@Injectable()
export class FeedService {
    private readonly MAX_DISTANCE = 999999;
    constructor(
        private prisma: PrismaService,
        private utils: UtilsService,
        private notifications: NotificationsService,
    ) {}

    async search(page: number, limit: number, search: string, userId: string) {
        const skip = (page - 1) * limit;

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

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const pic = user.profilePictures[0];
            if (!pic || !pic.amazonId) continue;
            pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
            user.profilePictures[0] = pic;
        }

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
            include: {
                owner: {
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
            },
            orderBy: {advertisement: "desc"},
        });

        const partiesToReturn = await Promise.all(
            parties.map(async party => {
                const distance = this.utils.haversineDistance(currentUser.location, party.location);
                party.distance = distance;
                if (party.image.amazonId) {
                    party.image.url = await this.utils.getCachedImageUrl(party.image.amazonId);
                }
                const pic = party.owner.profilePictures[0];
                if (!pic || !pic.amazonId) return;
                pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                party.owner.profilePictures[0] = pic;
                if (party?.members) {
                    for (let i = 0; i < party.members.length; i++) {
                        const pic = party.members[i].user.profilePictures[0];
                        if (!pic || !pic.amazonId) continue;
                        pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                        party.members[i].user.profilePictures[0] = pic;
                    }
                }
                return party;
            }),
        );

        return {users, parties: partiesToReturn};
    }

    async getPersonalizedParties(
        page: number,
        limit: number,
        maxAge: number,
        minAge: number,
        distanceLimit: number,
        showGroups: boolean,
        userId: string,
    ) {
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

        const queryFilters = {
            date: {gte: currentDateTime},
            active: true,
            private: false,
        };

        const totalParties = await this.prisma.party.count({where: queryFilters});

        const foundedParties = [];
        while (foundedParties.length < limit && (page - 1) * limit < totalParties) {
            const parties = await this.prisma.party.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{date: "asc"}],
                where: queryFilters,
                select: {
                    id: true,
                    location: true,
                    name: true,
                    description: true,
                    image: true,
                    tags: true,
                    type: true,
                    createdAt: true,
                    date: true,
                    active: true,
                    ownerId: true,
                    ageRange: true,
                    owner: {
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
                },
            });

            interface ProfilePicture {
                amazonId: string;
                url?: string;
            }

            const getProfileImageUrl = async (pic: ProfilePicture) => {
                if (!pic || !pic.amazonId) return;
                const imageUrlCache: {[key: string]: string} = {};
                if (!imageUrlCache[pic.amazonId]) {
                    imageUrlCache[pic.amazonId] = await this.utils.getCachedImageUrl(pic.amazonId);
                }
                pic.url = imageUrlCache[pic.amazonId];
            };

            const partiesToReturn = await Promise.all(
                parties.map(async party => {
                    const distance = this.utils.haversineDistance(currentUser.location, party.location);
                    if (party.image.amazonId) {
                        party.image.url = await this.utils.getCachedImageUrl(party.image.amazonId); // This could also benefit from caching, but it's not shown here.
                    }
                    await getProfileImageUrl(party.owner.profilePictures[0]);
                    if (party.members) {
                        for (const member of party.members) {
                            await getProfileImageUrl(member.user.profilePictures[0]);
                        }
                    }

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
                            party.ageRange.min <= maxAge &&
                            party.ageRange.max >= minAge
                        );
                    })
                    .sort((a, b) => b!.relevanceScore - a!.relevanceScore),
            );

            page++;
        }
        return {
            parties: foundedParties,
            step: page,
            reachedMaxItemsInDB: page * limit >= totalParties,
        };
    }

    async getFollowers(page: number, limit: number, username: string) {
        const skip = (page - 1) * 10;
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

        const followerUsers = await this.prisma.user.findMany({
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
                        amazonId: true,
                    },
                },
            },
        });
        for (let i = 0; i < followerUsers.length; i++) {
            const user = followerUsers[i];
            const pic = user.profilePictures[0];
            if (!pic || !pic.amazonId) continue;
            pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
            user.profilePictures[0] = pic;
        }

        return followerUsers;
    }

    async getFollowing(page: number, limit: number, username: string) {
        const skip = (page - 1) * 10;
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

        const followerUsers = await this.prisma.user.findMany({
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
                        amazonId: true,
                    },
                },
            },
        });
        for (let i = 0; i < followerUsers.length; i++) {
            const user = followerUsers[i];
            const pic = user.profilePictures[0];
            if (!pic || !pic.amazonId) continue;
            pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
            user.profilePictures[0] = pic;
        }

        return followerUsers;
    }
}
