import { MultipartFile } from "@fastify/multipart";
import { Location } from "@prisma/client";
import { ChatRoom } from "app/src/pusher/dto/Chat.dto";
import { PusherService } from "app/src/pusher/services/pusher.service";
import { UpdateUser } from "app/src/user/dto/UpdateUser";
import { PrismaService } from "../../db/services/prisma.service";
import { SearchDto } from "../../feed/dto/Search.dto";
import { NotificationsService } from "../../notifications/services/notifications.service";
import { DeleteUserProfilePictureDto } from "../../party/dto/DeleteUserProfilePicture.dto";
import { UtilsService } from "../../utils/services/utils.service";
import { ConsumableItemDto, CreateConsumableDto } from "../dto/CreateConsumableDto";
import { CreateTicketDto, TicketBaseDto } from "../dto/CreateTicketDto";
export declare class UserService {
    private prisma;
    private utils;
    private notifications;
    private readonly pusherService;
    constructor(prisma: PrismaService, utils: UtilsService, notifications: NotificationsService, pusherService: PusherService);
    checkUsername(username: string): Promise<boolean>;
    updateUser(user: UpdateUser, userId: string): Promise<{
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
    uploadProfilePicture(image: MultipartFile, userId: string): Promise<{
        id: string;
        url: string;
        userId: string;
    }>;
    uploadConsumablemage(image: MultipartFile): Promise<any>;
    removeConsumableImage(consumableId: string, userId: string): Promise<boolean>;
    deleteProfilePicture(deleteUserProfilePictureDto: DeleteUserProfilePictureDto, userId: string): Promise<{
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
    followUser(followedUsername: string, followerUserId: string): Promise<boolean>;
    unFollowUser(unFollowedUsername: string, followerUserId: string): Promise<boolean>;
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
    getUserById(id: string): Promise<{
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
    updateAndGetUserById(id: string, location: Location, expoPushToken: string): Promise<{
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
    createConsumable(createConsumableItemDto: CreateConsumableDto, userId: string): Promise<{
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
    updateConsumable(createConsumableItemDto: CreateConsumableDto, userId: string): Promise<{
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
    getConsumables(userId: string): Promise<({
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
    getConsumableItems(userId: string): Promise<{
        id: string;
        name: string;
        description: string;
        pictureUrl: string;
        type: import("@prisma/client").$Enums.ConsumableType;
        creatorId: string;
    }[]>;
    createConsumableItem(createConsumableItemDto: ConsumableItemDto, userId: string): Promise<{
        id: string;
        name: string;
        description: string;
        pictureUrl: string;
        type: import("@prisma/client").$Enums.ConsumableType;
        creatorId: string;
    }>;
    deleteConsumableItem(itemId: string, userId: string): Promise<boolean>;
    updateConsumableItem(createConsumableItemDto: ConsumableItemDto, userId: string): Promise<{
        id: string;
        name: string;
        description: string;
        pictureUrl: string;
        type: import("@prisma/client").$Enums.ConsumableType;
        creatorId: string;
    }>;
    createTicket(createTicketDto: CreateTicketDto, userId: string): Promise<{
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
    updateTicket(updateTicketDto: CreateTicketDto, userId: string): Promise<{
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
    deleteTicket(ticketId: string, userId: string): Promise<boolean>;
    getTickets(userId: string): Promise<({
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
    getTicketBases(userId: string): Promise<{
        id: string;
        name: string;
        type: string;
        description: string;
        creatorId: string;
    }[]>;
    createTicketBase(createTicketBaseDto: TicketBaseDto, userId: string): Promise<{
        id: string;
        name: string;
        type: string;
        description: string;
        creatorId: string;
    }>;
    deleteTicketBase(ticketId: string, userId: string): Promise<boolean>;
    updateTicketBase(updateTicketBaseDto: TicketBaseDto, userId: string): Promise<{
        id: string;
        name: string;
        type: string;
        description: string;
        creatorId: string;
    }>;
    sendMessageToChatRoom(chatRoom: ChatRoom, userId: string): Promise<import("pusher").Response>;
    requestMessagesFromLastMessageId(chatId: string, lastTimeChecked: string | null): Promise<{
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
    createChatRoom(username: string, userId: string): Promise<string>;
}
