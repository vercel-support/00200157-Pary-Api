import { ChatRoom } from "app/src/pusher/dto/Chat.dto";
import { SearchDto } from "../../feed/dto/Search.dto";
import { DeleteUserProfilePictureDto } from "../../party/dto/DeleteUserProfilePicture.dto";
import { ConsumableItemDto, CreateConsumableDto } from "../dto/CreateConsumableDto";
import { CreateTicketDto, TicketBaseDto } from "../dto/CreateTicketDto";
import { UpdateUser } from "../dto/UpdateUser";
import { UserService } from "../services/user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    checkUsername(username: string): Promise<boolean>;
    updateUser(user: UpdateUser, request: any): Promise<{
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
    getBasicUserInfo(username: string): Promise<{
        location: {
            name: string;
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
                consumables: {
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
                covers: {
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
                }[];
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
            id: string;
        }[];
        invitedParties: {
            party: {
                name: string;
                description: string;
                owner: {
                    username: string;
                    socialMedia: {
                        instagram: string;
                    };
                };
            };
            partyId: string;
        }[];
        invitingParties: {
            party: {
                name: string;
                description: string;
                owner: {
                    username: string;
                    socialMedia: {
                        instagram: string;
                    };
                };
            };
            partyId: string;
        }[];
        partiesModerating: {
            partyId: string;
        }[];
        groups: {
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
                }[];
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
        groupsModerating: {
            groupId: string;
        }[];
        invitedGroups: {
            group: {
                name: string;
                description: string;
                leaderId: string;
            };
            groupId: string;
        }[];
        invitingGroups: {
            group: {
                name: string;
                description: string;
                leaderId: string;
            };
            groupId: string;
        }[];
    }>;
    uploadProfilePicture(file: any, request: any): Promise<{
        id: string;
        url: string;
        userId: string;
    }>;
    deleteProfilePicture(deleteUserProfilePictureDto: DeleteUserProfilePictureDto, request: any): Promise<{
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
    followUser(username: string, request: any): Promise<boolean>;
    unFollowUser(username: string, request: any): Promise<boolean>;
    getFollowerUserInfo(username: string): Promise<{
        location: {
            name: string;
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
    }>;
    searchUsers(searchDto: SearchDto): Promise<{
        location: {
            name: string;
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
    }[]>;
    getUserById(id: string, location: string, expoPushToken: string): Promise<{
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
    purgeUserById(id: string): Promise<boolean>;
    uploadConsumableImage(file: any): Promise<any>;
    deleteConsumableImage(consumableId: string, request: any): Promise<boolean>;
    createConsumable(createConsumableItemDto: CreateConsumableDto, request: any): Promise<{
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
    }>;
    updateConsumable(createConsumableItemDto: CreateConsumableDto, request: any): Promise<{
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
    }>;
    getConsumables(request: any): Promise<({
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
    })[]>;
    getConsumableItems(request: any): Promise<{
        id: string;
        name: string;
        description: string;
        pictureUrl: string;
        type: import("@prisma/client").$Enums.ConsumableType;
        creatorId: string;
    }[]>;
    createConsumableItem(createConsumableItemDto: ConsumableItemDto, request: any): Promise<{
        id: string;
        name: string;
        description: string;
        pictureUrl: string;
        type: import("@prisma/client").$Enums.ConsumableType;
        creatorId: string;
    }>;
    deleteConsumableItem(itemId: string, request: any): Promise<boolean>;
    updateConsumableItem(createConsumableItemDto: ConsumableItemDto, request: any): Promise<{
        id: string;
        name: string;
        description: string;
        pictureUrl: string;
        type: import("@prisma/client").$Enums.ConsumableType;
        creatorId: string;
    }>;
    createTicket(createTicketDto: CreateTicketDto, request: any): Promise<{
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
    }>;
    updateTicket(updateTicketDto: CreateTicketDto, request: any): Promise<{
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
    }>;
    deleteTicket(ticketId: string, request: any): Promise<boolean>;
    getTickets(request: any): Promise<({
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
    })[]>;
    getTicketBases(request: any): Promise<{
        id: string;
        name: string;
        type: string;
        description: string;
        creatorId: string;
    }[]>;
    createTicketBase(createTicketBaseDto: TicketBaseDto, request: any): Promise<{
        id: string;
        name: string;
        type: string;
        description: string;
        creatorId: string;
    }>;
    deleteTicketBase(ticketId: string, request: any): Promise<boolean>;
    updateTicketBase(updateTicketBaseDto: TicketBaseDto, request: any): Promise<{
        id: string;
        name: string;
        type: string;
        description: string;
        creatorId: string;
    }>;
    sendMessageToChannel(chatRoom: ChatRoom, request: any): Promise<import("pusher").Response>;
    requestMessages(chatId: string, lastTimeChecked: string | null): Promise<{
        _id: string;
        createdAt: Date;
        image: string;
        received: boolean;
        sent: boolean;
        system: boolean;
        text: string;
        user: {
            _id: string;
            username: string;
            avatar: string;
        };
        video: string;
    }[]>;
    createChatRoom(username: string, request: any): Promise<string>;
}
