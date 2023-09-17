import {Injectable} from "@nestjs/common";
import {Location} from "types";

@Injectable()
export class UtilsService {
    private imageCache = new Map<string, {url: string; expiry: number}>();
    private readonly CACHE_DURATION = 601800;
    private readonly AMAZON_CACHE_DURATION = 604800;

    haversineDistance(location1: Location, location2: Location): number {
        const R = 6371; // Radio de la Tierra en kilómetros
        const lat1 = (location1.latitude * Math.PI) / 180; // Convertir a radianes
        const lat2 = (location2.latitude * Math.PI) / 180; // Convertir a radianes
        const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180; // Convertir a radianes
        const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180; // Convertir a radianes

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    extractToken(bearerToken: string): string {
        return bearerToken.split(" ")[1];
    }

    getUserFields() {
        return {
            profilePictures: true,
            followerUserList: true,
            followingUserList: true,
            parties: {
                select: {
                    partyId: true,
                    party: {
                        select: {
                            name: true,
                            description: true,
                            image: true,
                            id: true,
                            location: true,
                            date: true,
                            owner: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            invitedParties: {
                select: {
                    partyId: true,
                    party: {
                        select: {
                            name: true,
                            description: true,
                            image: true,
                            id: true,
                            location: true,
                            date: true,
                            owner: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            invitingParties: {
                select: {
                    partyId: true,
                    party: {
                        select: {
                            name: true,
                            description: true,
                            image: true,
                            id: true,
                            location: true,
                            date: true,
                            owner: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            ownedParties: {
                select: {
                    name: true,
                    description: true,
                    image: true,
                    id: true,
                    location: true,
                    date: true,
                    owner: {
                        select: {
                            username: true,
                            name: true,
                            lastName: true,
                            profilePictures: {
                                take: 1,
                            },
                        },
                    },
                    members: {
                        select: {
                            userId: true,
                            user: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            partiesModerating: {
                select: {
                    partyId: true,
                    party: {
                        select: {
                            name: true,
                            description: true,
                            image: true,
                            id: true,
                            location: true,
                            date: true,
                            owner: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            groupsModerating: {
                select: {
                    groupId: true,
                    group: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            leaderId: true,
                            leader: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            groups: {
                select: {
                    groupId: true,
                    group: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            leaderId: true,
                            leader: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            invitedGroups: {
                select: {
                    groupId: true,
                    group: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            leaderId: true,
                            leader: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            invitingGroups: {
                select: {
                    groupId: true,
                    group: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            leaderId: true,
                            leader: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            membershipRequests: {
                include: {
                    group: {
                        select: {
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
                    },
                    party: {
                        select: {
                            name: true,
                            description: true,
                            image: true,
                            id: true,
                            location: true,
                            date: true,
                            owner: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
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
                            profilePictures: {take: 1},
                            verified: true,
                            isCompany: true,
                            gender: true,
                        },
                    },
                },
            },
        };
    }
}
