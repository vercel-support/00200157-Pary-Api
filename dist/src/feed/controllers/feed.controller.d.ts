import { FeedService } from "app/src/feed/services/feed.service";
import { FollowersFollowingDto } from "../dto/FollowersFollowing.dto";
import { PersonalizedPartiesDto } from "../dto/PersonalizedParties.dto";
import { SearchDto } from "../dto/Search.dto";
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    search(searchDto: SearchDto, request: any): Promise<{
        users: {
            location: {
                id: string;
                name: string;
                latitude: number;
                longitude: number;
                timestamp: Date;
                address: string;
            };
            username: string;
            name: string;
            lastName: string;
            socialMedia: {
                instagram: string;
            };
            gender: import("@prisma/client").$Enums.Gender;
            userType: import("@prisma/client").$Enums.UserType;
            description: string;
            birthDate: Date;
            interests: string[];
            verified: boolean;
            createdAt: Date;
            lastLogin: Date;
            isCompany: boolean;
            profilePictures: {
                id: string;
                url: string;
            }[];
        }[];
        parties: ({
            location: {
                id: string;
                name: string;
                latitude: number;
                longitude: number;
                timestamp: Date;
                address: string;
            };
            groups: ({
                group: {
                    id: string;
                    name: string;
                    members: ({
                        user: {
                            username: string;
                            name: string;
                            lastName: string;
                            socialMedia: {
                                instagram: string;
                            };
                            gender: import("@prisma/client").$Enums.Gender;
                            userType: import("@prisma/client").$Enums.UserType;
                            verified: boolean;
                            isCompany: boolean;
                            profilePictures: {
                                id: string;
                                url: string;
                            }[];
                        };
                    } & {
                        id: string;
                        groupId: string;
                        userId: string;
                        createdAt: Date;
                    })[];
                    moderators: ({
                        user: {
                            username: string;
                            name: string;
                            lastName: string;
                            socialMedia: {
                                instagram: string;
                            };
                            gender: import("@prisma/client").$Enums.Gender;
                            userType: import("@prisma/client").$Enums.UserType;
                            verified: boolean;
                            isCompany: boolean;
                            profilePictures: {
                                id: string;
                                url: string;
                            }[];
                        };
                    } & {
                        id: string;
                        groupId: string;
                        userId: string;
                        createdAt: Date;
                    })[];
                    leaderId: string;
                    leader: {
                        username: string;
                        name: string;
                        lastName: string;
                        socialMedia: {
                            instagram: string;
                        };
                        gender: import("@prisma/client").$Enums.Gender;
                        userType: import("@prisma/client").$Enums.UserType;
                        verified: boolean;
                        isCompany: boolean;
                        profilePictures: {
                            id: string;
                            url: string;
                        }[];
                    };
                };
            } & {
                id: string;
                partyId: string;
                groupId: string;
                createdAt: Date;
            })[];
            tickets: ({
                consumables: ({
                    consumable: {
                        item: {
                            id: string;
                            name: string;
                            description: string;
                            pictureUrl: string;
                            type: import("@prisma/client").$Enums.ConsumableType;
                            creatorId: string;
                        };
                    } & {
                        id: string;
                        price: number;
                        stock: number;
                        tags: string[];
                        brand: string;
                        createdAt: Date;
                        weightOrVolume: number;
                        partyIdForConsumable: string;
                        partyIdForCover: string;
                        itemId: string;
                        creatorId: string;
                    };
                } & {
                    id: string;
                    quantity: number;
                    consumableId: string;
                    ticketId: string;
                })[];
                base: {
                    id: string;
                    name: string;
                    type: string;
                    description: string;
                    creatorId: string;
                };
            } & {
                id: string;
                price: number;
                stock: number;
                tags: string[];
                createdAt: Date;
                color: import("@prisma/client").$Enums.TicketColor;
                payInDoor: boolean;
                creatorId: string;
                baseId: string;
                partyId: string;
            })[];
            consumables: ({
                item: {
                    id: string;
                    name: string;
                    description: string;
                    pictureUrl: string;
                    type: import("@prisma/client").$Enums.ConsumableType;
                    creatorId: string;
                };
            } & {
                id: string;
                price: number;
                stock: number;
                tags: string[];
                brand: string;
                createdAt: Date;
                weightOrVolume: number;
                partyIdForConsumable: string;
                partyIdForCover: string;
                itemId: string;
                creatorId: string;
            })[];
            members: ({
                user: {
                    username: string;
                    name: string;
                    lastName: string;
                    socialMedia: {
                        instagram: string;
                    };
                    gender: import("@prisma/client").$Enums.Gender;
                    userType: import("@prisma/client").$Enums.UserType;
                    verified: boolean;
                    isCompany: boolean;
                    profilePictures: {
                        id: string;
                        url: string;
                    }[];
                };
            } & {
                id: string;
                partyId: string;
                userId: string;
                createdAt: Date;
            })[];
            moderators: ({
                user: {
                    username: string;
                    name: string;
                    lastName: string;
                    socialMedia: {
                        instagram: string;
                    };
                    gender: import("@prisma/client").$Enums.Gender;
                    userType: import("@prisma/client").$Enums.UserType;
                    verified: boolean;
                    isCompany: boolean;
                    profilePictures: {
                        id: string;
                        url: string;
                    }[];
                };
            } & {
                id: string;
                partyId: string;
                userId: string;
                createdAt: Date;
            })[];
            owner: {
                username: string;
                name: string;
                lastName: string;
                socialMedia: {
                    instagram: string;
                };
                gender: import("@prisma/client").$Enums.Gender;
                userType: import("@prisma/client").$Enums.UserType;
                verified: boolean;
                isCompany: boolean;
                profilePictures: {
                    id: string;
                    url: string;
                }[];
            };
            membershipRequests: ({
                group: {
                    members: ({
                        user: {
                            username: string;
                            name: string;
                            lastName: string;
                            socialMedia: {
                                instagram: string;
                            };
                            gender: import("@prisma/client").$Enums.Gender;
                            userType: import("@prisma/client").$Enums.UserType;
                            verified: boolean;
                            isCompany: boolean;
                            profilePictures: {
                                id: string;
                                url: string;
                            }[];
                        };
                    } & {
                        id: string;
                        groupId: string;
                        userId: string;
                        createdAt: Date;
                    })[];
                    moderators: ({
                        user: {
                            username: string;
                            name: string;
                            lastName: string;
                            socialMedia: {
                                instagram: string;
                            };
                            gender: import("@prisma/client").$Enums.Gender;
                            userType: import("@prisma/client").$Enums.UserType;
                            verified: boolean;
                            isCompany: boolean;
                            profilePictures: {
                                id: string;
                                url: string;
                            }[];
                        };
                    } & {
                        id: string;
                        groupId: string;
                        userId: string;
                        createdAt: Date;
                    })[];
                    leader: {
                        username: string;
                        name: string;
                        lastName: string;
                        socialMedia: {
                            instagram: string;
                        };
                        gender: import("@prisma/client").$Enums.Gender;
                        userType: import("@prisma/client").$Enums.UserType;
                        verified: boolean;
                        isCompany: boolean;
                        profilePictures: {
                            id: string;
                            url: string;
                        }[];
                    };
                };
                user: {
                    username: string;
                    name: string;
                    lastName: string;
                    socialMedia: {
                        instagram: string;
                    };
                    gender: import("@prisma/client").$Enums.Gender;
                    userType: import("@prisma/client").$Enums.UserType;
                    verified: boolean;
                    isCompany: boolean;
                    profilePictures: {
                        id: string;
                        url: string;
                    }[];
                };
            } & {
                id: string;
                groupId: string;
                partyId: string;
                userId: string;
                status: import("@prisma/client").$Enums.InvitationStatus;
                type: import("@prisma/client").$Enums.MembershipType;
                createdAt: Date;
            })[];
            invitations: ({
                invitingUser: {
                    username: string;
                    name: string;
                    lastName: string;
                    socialMedia: {
                        instagram: string;
                    };
                    gender: import("@prisma/client").$Enums.Gender;
                    userType: import("@prisma/client").$Enums.UserType;
                    verified: boolean;
                    isCompany: boolean;
                    profilePictures: {
                        id: string;
                        url: string;
                    }[];
                };
                invitedUser: {
                    username: string;
                    name: string;
                    lastName: string;
                    socialMedia: {
                        instagram: string;
                    };
                    gender: import("@prisma/client").$Enums.Gender;
                    userType: import("@prisma/client").$Enums.UserType;
                    verified: boolean;
                    isCompany: boolean;
                    profilePictures: {
                        id: string;
                        url: string;
                    }[];
                };
            } & {
                id: string;
                invitingUserId: string;
                invitedUserId: string;
                partyId: string;
                groupId: string;
                status: import("@prisma/client").$Enums.InvitationStatus;
                createdAt: Date;
                ticketId: string;
            })[];
            covers: ({
                item: {
                    id: string;
                    name: string;
                    description: string;
                    pictureUrl: string;
                    type: import("@prisma/client").$Enums.ConsumableType;
                    creatorId: string;
                };
            } & {
                id: string;
                price: number;
                stock: number;
                tags: string[];
                brand: string;
                createdAt: Date;
                weightOrVolume: number;
                partyIdForConsumable: string;
                partyIdForCover: string;
                itemId: string;
                creatorId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string;
            tags: string[];
            type: import("@prisma/client").$Enums.PartyType;
            date: Date;
            advertisement: boolean;
            distance: number;
            active: boolean;
            showAddressInFeed: boolean;
            ownerId: string;
            createdAt: Date;
            locationId: string;
            chatId: string;
        } & {
            image: {
                url: string;
            };
            ageRange: {
                min: number;
                max: number;
            };
        })[];
        groups: ({
            members: ({
                user: {
                    username: string;
                    name: string;
                    lastName: string;
                    socialMedia: {
                        instagram: string;
                    };
                    gender: import("@prisma/client").$Enums.Gender;
                    userType: import("@prisma/client").$Enums.UserType;
                    verified: boolean;
                    isCompany: boolean;
                    profilePictures: {
                        id: string;
                        url: string;
                    }[];
                };
            } & {
                id: string;
                groupId: string;
                userId: string;
                createdAt: Date;
            })[];
            moderators: ({
                user: {
                    username: string;
                    name: string;
                    lastName: string;
                    socialMedia: {
                        instagram: string;
                    };
                    gender: import("@prisma/client").$Enums.Gender;
                    userType: import("@prisma/client").$Enums.UserType;
                    verified: boolean;
                    isCompany: boolean;
                    profilePictures: {
                        id: string;
                        url: string;
                    }[];
                };
            } & {
                id: string;
                groupId: string;
                userId: string;
                createdAt: Date;
            })[];
            leader: {
                username: string;
                name: string;
                lastName: string;
                socialMedia: {
                    instagram: string;
                };
                gender: import("@prisma/client").$Enums.Gender;
                userType: import("@prisma/client").$Enums.UserType;
                verified: boolean;
                isCompany: boolean;
                profilePictures: {
                    id: string;
                    url: string;
                }[];
            };
        } & {
            id: string;
            name: string;
            description: string;
            leaderId: string;
            private: boolean;
            showInFeed: boolean;
            createdAt: Date;
            chatIds: string[];
        } & {
            ageRange: {
                min: number;
                max: number;
            };
        })[];
    }>;
    getPersonalizedParties(personalizedParties: PersonalizedPartiesDto, request: any): Promise<{
        parties: any[];
        groups: any[];
        partyPage: number;
        groupPage: number;
        reachedMaxPartiesInDB: boolean;
        reachedMaxGroupsInDB: boolean;
    }>;
    getFollowers(followerDto: FollowersFollowingDto): Promise<{
        username: string;
        name: string;
        lastName: string;
        socialMedia: {
            instagram: string;
        };
        gender: import("@prisma/client").$Enums.Gender;
        userType: import("@prisma/client").$Enums.UserType;
        description: string;
        verified: boolean;
        isCompany: boolean;
        profilePictures: {
            url: string;
        }[];
    }[]>;
    getFollowing(followingDto: FollowersFollowingDto): Promise<{
        username: string;
        name: string;
        lastName: string;
        socialMedia: {
            instagram: string;
        };
        gender: import("@prisma/client").$Enums.Gender;
        userType: import("@prisma/client").$Enums.UserType;
        description: string;
        verified: boolean;
        isCompany: boolean;
        profilePictures: {
            url: string;
        }[];
    }[]>;
}
