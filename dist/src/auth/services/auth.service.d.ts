import { GoogleUser } from "app/types";
import { PrismaService } from "../../db/services/prisma.service";
import { UtilsService } from "../../utils/services/utils.service";
import { AuthDto } from "../dto/Auth.dto";
export declare class AuthService {
    private prisma;
    private utils;
    constructor(prisma: PrismaService, utils: UtilsService);
    signInUser(googleUser: GoogleUser): Promise<any>;
    logoutUser(userId: string): Promise<boolean>;
    refreshToken(userId: string): Promise<{
        location: {
            id: string;
            name: string;
            latitude: number;
            longitude: number;
            timestamp: Date;
            address: string;
        };
        profilePictures: {
            id: string;
            url: string;
            userId: string;
        }[];
        followingUserList: {
            id: string;
            followerUserId: string;
            followedUserId: string;
            followerUsername: string;
            followedUsername: string;
            followDate: Date;
        }[];
        followerUserList: {
            id: string;
            followerUserId: string;
            followedUserId: string;
            followerUsername: string;
            followedUsername: string;
            followDate: Date;
        }[];
        parties: {
            party: {
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
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
                members: {
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
                    userId: string;
                }[];
                moderators: {
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
                    userId: string;
                }[];
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
            };
            partyId: string;
        }[];
        ownedParties: {
            image: {
                url: string;
            };
            location: {
                id: string;
                name: string;
                latitude: number;
                longitude: number;
                timestamp: Date;
                address: string;
            };
            id: string;
            name: string;
            description: string;
            date: Date;
            members: {
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
                userId: string;
            }[];
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
        }[];
        invitedParties: {
            party: {
                image: {
                    url: string;
                };
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
                id: string;
                name: string;
                description: string;
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
                date: Date;
                members: {
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
                    userId: string;
                }[];
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
            };
            partyId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
        }[];
        partiesModerating: {
            party: {
                image: {
                    url: string;
                };
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
                id: string;
                name: string;
                description: string;
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
                date: Date;
                members: {
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
                    userId: string;
                }[];
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
            };
            partyId: string;
        }[];
        groups: {
            group: {
                parties: {
                    party: {
                        location: {
                            id: string;
                            name: string;
                            latitude: number;
                            longitude: number;
                            timestamp: Date;
                            address: string;
                        };
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
                        members: {
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
                            userId: string;
                        }[];
                        moderators: {
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
                            userId: string;
                        }[];
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
                    };
                    partyId: string;
                }[];
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
            };
            groupId: string;
        }[];
        invitedGroups: {
            group: {
                members: {
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
                    userId: string;
                }[];
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
            };
            groupId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
        }[];
        partyMembershipRequests: ({
            party: {
                image: {
                    url: string;
                };
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
                id: string;
                name: string;
                description: string;
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
                date: Date;
                members: {
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
                    userId: string;
                }[];
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
            };
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
        groupMembershipRequests: ({
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
            userId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
            createdAt: Date;
        })[];
        tickets: ({
            ticket: {
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
            };
        } & {
            id: string;
            validated: boolean;
            validatedConsumables: string[];
            ticketId: string;
            partyId: string;
            userId: string;
            groupId: string;
            type: import("@prisma/client").$Enums.MembershipType;
            createdAt: Date;
        })[];
        ticketsBase: {
            id: string;
            name: string;
            type: string;
            description: string;
            creatorId: string;
        }[];
        ticketsCreated: {
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
        }[];
    } & {
        id: string;
        assignedGoogleID: string;
        username: string;
        email: string;
        password: string;
        name: string;
        lastName: string;
        signedIn: boolean;
        accessToken: string;
        refreshToken: string;
        gender: import("@prisma/client").$Enums.Gender;
        userType: import("@prisma/client").$Enums.UserType;
        description: string;
        birthDate: Date;
        interests: string[];
        verified: boolean;
        phoneNumber: string;
        locationId: string;
        createdAt: Date;
        lastLogin: Date;
        isCompany: boolean;
        expoPushToken: string;
        webSocketId: string;
        chatIds: string[];
    } & {
        socialMedia: {
            instagram: string;
        };
    }>;
    createToken(userId: string): Promise<string>;
    register(registerDto: AuthDto): Promise<{
        errors: {
            type: string;
            message: string;
        }[];
    } | {
        accessToken: string;
        refreshToken: string;
        location: {
            id: string;
            name: string;
            latitude: number;
            longitude: number;
            timestamp: Date;
            address: string;
        };
        profilePictures: {
            id: string;
            url: string;
            userId: string;
        }[];
        followingUserList: {
            id: string;
            followerUserId: string;
            followedUserId: string;
            followerUsername: string;
            followedUsername: string;
            followDate: Date;
        }[];
        followerUserList: {
            id: string;
            followerUserId: string;
            followedUserId: string;
            followerUsername: string;
            followedUsername: string;
            followDate: Date;
        }[];
        parties: {
            party: {
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
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
                members: {
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
                    userId: string;
                }[];
                moderators: {
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
                    userId: string;
                }[];
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
            };
            partyId: string;
        }[];
        ownedParties: {
            image: {
                url: string;
            };
            location: {
                id: string;
                name: string;
                latitude: number;
                longitude: number;
                timestamp: Date;
                address: string;
            };
            id: string;
            name: string;
            description: string;
            date: Date;
            members: {
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
                userId: string;
            }[];
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
        }[];
        invitedParties: {
            party: {
                image: {
                    url: string;
                };
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
                id: string;
                name: string;
                description: string;
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
                date: Date;
                members: {
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
                    userId: string;
                }[];
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
            };
            partyId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
        }[];
        partiesModerating: {
            party: {
                image: {
                    url: string;
                };
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
                id: string;
                name: string;
                description: string;
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
                date: Date;
                members: {
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
                    userId: string;
                }[];
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
            };
            partyId: string;
        }[];
        groups: {
            group: {
                parties: {
                    party: {
                        location: {
                            id: string;
                            name: string;
                            latitude: number;
                            longitude: number;
                            timestamp: Date;
                            address: string;
                        };
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
                        members: {
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
                            userId: string;
                        }[];
                        moderators: {
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
                            userId: string;
                        }[];
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
                    };
                    partyId: string;
                }[];
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
            };
            groupId: string;
        }[];
        invitedGroups: {
            group: {
                members: {
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
                    userId: string;
                }[];
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
            };
            groupId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
        }[];
        partyMembershipRequests: ({
            party: {
                image: {
                    url: string;
                };
                location: {
                    id: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    timestamp: Date;
                    address: string;
                };
                id: string;
                name: string;
                description: string;
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
                date: Date;
                members: {
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
                    userId: string;
                }[];
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
            };
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
        groupMembershipRequests: ({
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
            userId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
            createdAt: Date;
        })[];
        tickets: ({
            ticket: {
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
            };
        } & {
            id: string;
            validated: boolean;
            validatedConsumables: string[];
            ticketId: string;
            partyId: string;
            userId: string;
            groupId: string;
            type: import("@prisma/client").$Enums.MembershipType;
            createdAt: Date;
        })[];
        ticketsBase: {
            id: string;
            name: string;
            type: string;
            description: string;
            creatorId: string;
        }[];
        ticketsCreated: {
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
        }[];
        id: string;
        assignedGoogleID: string;
        username: string;
        email: string;
        password: string;
        name: string;
        lastName: string;
        signedIn: boolean;
        gender: import("@prisma/client").$Enums.Gender;
        userType: import("@prisma/client").$Enums.UserType;
        description: string;
        birthDate: Date;
        interests: string[];
        verified: boolean;
        phoneNumber: string;
        locationId: string;
        createdAt: Date;
        lastLogin: Date;
        isCompany: boolean;
        expoPushToken: string;
        webSocketId: string;
        chatIds: string[];
        socialMedia: {
            instagram: string;
        };
        errors?: undefined;
    }>;
    login(loginDto: AuthDto): Promise<{
        errors: {
            type: string;
            message: string;
        }[];
    } | {
        accessToken: string;
        refreshToken: string;
        password: string;
        id: string;
        assignedGoogleID: string;
        errors?: undefined;
    }>;
}
