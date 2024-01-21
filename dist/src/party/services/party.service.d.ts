import { CreatePartyDto } from "app/src/party/dto/CreateParty.dto";
import { PrismaService } from "../../db/services/prisma.service";
import { PaginationDto } from "../../group/dto/Pagination.dto";
import { NotificationsService } from "../../notifications/services/notifications.service";
import { UtilsService } from "../../utils/services/utils.service";
import { OptionalGroupIdDto } from "../dto/Group.dto";
import { JoinRequestDto } from "../dto/JoinRequestDto";
import { UpdatePartyDto } from "../dto/UpdateParty.dto";
import { UploadImageDto } from "../dto/UploadImageDto";
import { UsernameDto } from "../dto/User.dto";
import { MultipartFile } from "@fastify/multipart";
export declare class PartyService {
    private prisma;
    private utils;
    private notifications;
    constructor(prisma: PrismaService, utils: UtilsService, notifications: NotificationsService);
    createParty(partyBody: CreatePartyDto, userId: string): Promise<{
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
    }>;
    updateParty(partyBody: UpdatePartyDto, userId: string): Promise<{
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
    }>;
    getOwnParties(paginationDto: PaginationDto, userId: string): Promise<{
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
        hasNextPage: boolean;
        nextPage: number;
    }>;
    uploadPartyImage(image: MultipartFile): Promise<any>;
    replacePartyImage(partId: string, uploadImageDto: UploadImageDto, userId: string): Promise<{
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
    }>;
    getInvitedParties(paginationDto: PaginationDto, userId: string): Promise<{
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
                            userId: string;
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
                        userId: string;
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
        hasNextPage: boolean;
        nextPage: number;
    }>;
    getJoinRequests(userId: string): Promise<({
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
                        userId: string;
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
                profilePictures: {
                    id: string;
                    url: string;
                    userId: string;
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
    })[]>;
    getPartyInvitations(userId: string): Promise<{
        party: {
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
        };
        partyId: string;
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
        groupId: string;
    }[]>;
    getParty(partyId: string, userId: string): Promise<{
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
    }>;
    leaveParty(partyId: string, userId: string): Promise<boolean>;
    inviteToParty(partyId: string, usernameDto: UsernameDto, userId: string): Promise<{
        id: string;
        invitingUserId: string;
        invitedUserId: string;
        partyId: string;
        groupId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        createdAt: Date;
        ticketId: string;
    }>;
    cancelInvitation(partyId: string, UsernameDto: UsernameDto, userId: string): Promise<false | {
        id: string;
        invitingUserId: string;
        invitedUserId: string;
        partyId: string;
        groupId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        createdAt: Date;
        ticketId: string;
    }>;
    acceptInvitation(partyId: string, userId: string): Promise<boolean>;
    declineInvitation(partyId: string, userId: string): Promise<boolean>;
    acceptJoinRequest(partyId: string, userId: string, acceptJoinRequestDto: JoinRequestDto): Promise<boolean>;
    joinUserOrGroupToParty(partyId: string, userId: string, ticketId: string, groupId?: string): Promise<boolean>;
    declineJoinRequest(partyId: string, userId: string, joinRequestDto: JoinRequestDto): Promise<boolean>;
    cancelJoinRequest(partyId: string, userId: string): Promise<boolean>;
    requestJoin(partyId: string, userId: string, optionalGroupIdDto: OptionalGroupIdDto): Promise<boolean>;
    deleteMember(partyId: string, usernameDto: UsernameDto, userId: string): Promise<void>;
    deleteGroupMember(partyId: string, groupIdDto: OptionalGroupIdDto, userId: string): Promise<void>;
    deleteMod(partyId: string, usernameDto: UsernameDto, userId: string): Promise<void>;
    addMemberToModList(partyId: string, usernameDto: UsernameDto, userId: string): Promise<void>;
}
