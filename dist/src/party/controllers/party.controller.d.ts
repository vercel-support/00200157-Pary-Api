import { CreatePartyDto } from "app/src/party/dto/CreateParty.dto";
import { PartyService } from "app/src/party/services/party.service";
import { PaginationDto } from "../../group/dto/Pagination.dto";
import { OptionalGroupIdDto } from "../dto/Group.dto";
import { JoinRequestDto } from "../dto/JoinRequestDto";
import { UpdatePartyDto } from "../dto/UpdateParty.dto";
import { UploadImageDto } from "../dto/UploadImageDto";
import { UsernameDto } from "../dto/User.dto";
export declare class PartyController {
    private readonly partyService;
    constructor(partyService: PartyService);
    createParty(party: CreatePartyDto, request: any): Promise<{
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
    updateParty(party: UpdatePartyDto, request: any): Promise<{
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
    getOwnParties(paginationDto: PaginationDto, request: any): Promise<{
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
    uploadPartyImage(file: any): Promise<any>;
    getInvitedParties(paginationDto: PaginationDto, request: any): Promise<{
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
    getJoinRequests(request: any): Promise<({
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
    getRequests(request: any): Promise<{
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
    getParty(partyId: string, request: any): Promise<{
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
    leaveParty(partyId: string, request: any): Promise<boolean>;
    inviteToParty(partyId: string, inviteToPartyDto: UsernameDto, request: any): Promise<{
        id: string;
        invitingUserId: string;
        invitedUserId: string;
        partyId: string;
        groupId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        createdAt: Date;
        ticketId: string;
    }>;
    cancelInvitation(partyId: string, inviteToGroupDto: UsernameDto, request: any): Promise<false | {
        id: string;
        invitingUserId: string;
        invitedUserId: string;
        partyId: string;
        groupId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        createdAt: Date;
        ticketId: string;
    }>;
    acceptInvitation(partyId: string, request: any): Promise<boolean>;
    declineInvitation(partyId: string, request: any): Promise<boolean>;
    deleteMember(partyId: string, usernameDto: UsernameDto, request: any): Promise<void>;
    deleteGroupMember(partyId: string, groupIdDto: OptionalGroupIdDto, request: any): Promise<void>;
    deleteMod(partyId: string, usernameDto: UsernameDto, request: any): Promise<void>;
    acceptJoinRequest(partyId: string, joinRequestDto: JoinRequestDto, request: any): Promise<boolean>;
    declineJoinRequest(partyId: string, joinRequestDto: JoinRequestDto, request: any): Promise<boolean>;
    cancelJoinRequest(partyId: string, request: any): Promise<boolean>;
    requestJoin(partyId: string, request: any, optionalGroupIdDto: OptionalGroupIdDto): Promise<boolean>;
    replacePartyImage(partyId: string, uploadImageDto: UploadImageDto, request: any): Promise<{
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
    addMemberToModList(partyId: string, usernameDto: UsernameDto, request: any): Promise<void>;
}
