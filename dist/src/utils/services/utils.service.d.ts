import { Location } from "app/types";
export declare class UtilsService {
    haversineDistance(location1: Location, location2: Location): number;
    extractToken(bearerToken: string): string;
    getUserFields(): {
        profilePictures: boolean;
        followerUserList: boolean;
        followingUserList: boolean;
        tickets: {
            include: {
                ticket: {
                    include: {
                        base: boolean;
                        consumables: {
                            include: {
                                consumable: {
                                    include: {
                                        item: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        ticketsCreated: boolean;
        ticketsBase: boolean;
        location: boolean;
        parties: {
            select: {
                partyId: boolean;
                party: {
                    include: {
                        location: {
                            select: {
                                id: boolean;
                                name: boolean;
                                latitude: boolean;
                                longitude: boolean;
                                timestamp: boolean;
                                address: boolean;
                            };
                        };
                        consumables: {
                            include: {
                                item: boolean;
                            };
                        };
                        covers: {
                            include: {
                                item: boolean;
                            };
                        };
                        tickets: {
                            include: {
                                base: boolean;
                                consumables: {
                                    include: {
                                        consumable: {
                                            include: {
                                                item: boolean;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        owner: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            select: {
                                userId: boolean;
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                        moderators: {
                            select: {
                                userId: boolean;
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        invitedParties: {
            select: {
                partyId: boolean;
                status: boolean;
                party: {
                    select: {
                        name: boolean;
                        description: boolean;
                        image: boolean;
                        id: boolean;
                        location: {
                            select: {
                                id: boolean;
                                name: boolean;
                                latitude: boolean;
                                longitude: boolean;
                                timestamp: boolean;
                                address: boolean;
                            };
                        };
                        consumables: {
                            include: {
                                item: boolean;
                            };
                        };
                        covers: {
                            include: {
                                item: boolean;
                            };
                        };
                        date: boolean;
                        owner: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            select: {
                                userId: boolean;
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        ownedParties: {
            select: {
                name: boolean;
                description: boolean;
                image: boolean;
                id: boolean;
                location: {
                    select: {
                        id: boolean;
                        name: boolean;
                        latitude: boolean;
                        longitude: boolean;
                        timestamp: boolean;
                        address: boolean;
                    };
                };
                date: boolean;
                owner: {
                    select: {
                        username: boolean;
                        socialMedia: boolean;
                        name: boolean;
                        lastName: boolean;
                        profilePictures: {
                            take: number;
                            select: {
                                url: boolean;
                                id: boolean;
                            };
                        };
                        verified: boolean;
                        isCompany: boolean;
                        gender: boolean;
                        userType: boolean;
                    };
                };
                members: {
                    select: {
                        userId: boolean;
                        user: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                    };
                };
            };
        };
        partiesModerating: {
            select: {
                partyId: boolean;
                party: {
                    select: {
                        name: boolean;
                        description: boolean;
                        image: boolean;
                        id: boolean;
                        location: {
                            select: {
                                id: boolean;
                                name: boolean;
                                latitude: boolean;
                                longitude: boolean;
                                timestamp: boolean;
                                address: boolean;
                            };
                        };
                        consumables: {
                            include: {
                                item: boolean;
                            };
                        };
                        covers: {
                            include: {
                                item: boolean;
                            };
                        };
                        date: boolean;
                        owner: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            select: {
                                userId: boolean;
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        groups: {
            select: {
                groupId: boolean;
                group: {
                    include: {
                        leader: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            include: {
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                        parties: {
                            select: {
                                partyId: boolean;
                                party: {
                                    include: {
                                        location: {
                                            select: {
                                                id: boolean;
                                                name: boolean;
                                                latitude: boolean;
                                                longitude: boolean;
                                                timestamp: boolean;
                                                address: boolean;
                                            };
                                        };
                                        consumables: {
                                            include: {
                                                item: boolean;
                                            };
                                        };
                                        covers: {
                                            include: {
                                                item: boolean;
                                            };
                                        };
                                        owner: {
                                            select: {
                                                username: boolean;
                                                socialMedia: boolean;
                                                name: boolean;
                                                lastName: boolean;
                                                profilePictures: {
                                                    take: number;
                                                    select: {
                                                        url: boolean;
                                                        id: boolean;
                                                    };
                                                };
                                                verified: boolean;
                                                isCompany: boolean;
                                                gender: boolean;
                                                userType: boolean;
                                            };
                                        };
                                        members: {
                                            select: {
                                                userId: boolean;
                                                user: {
                                                    select: {
                                                        username: boolean;
                                                        socialMedia: boolean;
                                                        name: boolean;
                                                        lastName: boolean;
                                                        profilePictures: {
                                                            take: number;
                                                            select: {
                                                                url: boolean;
                                                                id: boolean;
                                                            };
                                                        };
                                                        verified: boolean;
                                                        isCompany: boolean;
                                                        gender: boolean;
                                                        userType: boolean;
                                                    };
                                                };
                                            };
                                        };
                                        moderators: {
                                            select: {
                                                userId: boolean;
                                                user: {
                                                    select: {
                                                        username: boolean;
                                                        socialMedia: boolean;
                                                        name: boolean;
                                                        lastName: boolean;
                                                        profilePictures: {
                                                            take: number;
                                                            select: {
                                                                url: boolean;
                                                                id: boolean;
                                                            };
                                                        };
                                                        verified: boolean;
                                                        isCompany: boolean;
                                                        gender: boolean;
                                                        userType: boolean;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        invitedGroups: {
            select: {
                groupId: boolean;
                status: boolean;
                group: {
                    include: {
                        leader: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            select: {
                                userId: boolean;
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        partyMembershipRequests: {
            include: {
                group: {
                    include: {
                        leader: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            include: {
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                party: {
                    select: {
                        name: boolean;
                        description: boolean;
                        image: boolean;
                        id: boolean;
                        location: {
                            select: {
                                id: boolean;
                                name: boolean;
                                latitude: boolean;
                                longitude: boolean;
                                timestamp: boolean;
                                address: boolean;
                            };
                        };
                        consumables: {
                            include: {
                                item: boolean;
                            };
                        };
                        covers: {
                            include: {
                                item: boolean;
                            };
                        };
                        date: boolean;
                        owner: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            select: {
                                userId: boolean;
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                user: {
                    select: {
                        username: boolean;
                        socialMedia: boolean;
                        name: boolean;
                        lastName: boolean;
                        profilePictures: {
                            take: number;
                            select: {
                                url: boolean;
                                id: boolean;
                            };
                        };
                        verified: boolean;
                        isCompany: boolean;
                        gender: boolean;
                        userType: boolean;
                    };
                };
            };
        };
        groupMembershipRequests: {
            include: {
                group: {
                    include: {
                        leader: {
                            select: {
                                username: boolean;
                                socialMedia: boolean;
                                name: boolean;
                                lastName: boolean;
                                profilePictures: {
                                    take: number;
                                    select: {
                                        url: boolean;
                                        id: boolean;
                                    };
                                };
                                verified: boolean;
                                isCompany: boolean;
                                gender: boolean;
                                userType: boolean;
                            };
                        };
                        members: {
                            include: {
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: boolean;
                                        socialMedia: boolean;
                                        name: boolean;
                                        lastName: boolean;
                                        profilePictures: {
                                            take: number;
                                            select: {
                                                url: boolean;
                                                id: boolean;
                                            };
                                        };
                                        verified: boolean;
                                        isCompany: boolean;
                                        gender: boolean;
                                        userType: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                user: {
                    select: {
                        username: boolean;
                        socialMedia: boolean;
                        name: boolean;
                        lastName: boolean;
                        profilePictures: {
                            take: number;
                            select: {
                                url: boolean;
                                id: boolean;
                            };
                        };
                        verified: boolean;
                        isCompany: boolean;
                        gender: boolean;
                        userType: boolean;
                    };
                };
            };
        };
    };
    calculateAge(birthday: Date): number;
}
