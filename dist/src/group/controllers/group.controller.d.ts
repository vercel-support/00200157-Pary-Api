import { CreateGroupDto } from "app/src/group/dto/CreateGroup.dto";
import { GroupService } from "app/src/group/services/group.service";
import { JoinRequestDto } from "../../party/dto/JoinRequestDto";
import { UsernameDto } from "../../party/dto/User.dto";
import { PaginationDto } from "../dto/Pagination.dto";
import { UpdateGroupDto } from "../dto/UpdateGroup.dto";
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    createGroup(group: CreateGroupDto, request: any): Promise<{
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
    }>;
    updateGroup(group: UpdateGroupDto, request: any): Promise<{
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
    }>;
    getOwnGroups(paginationDto: PaginationDto, request: any): Promise<{
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
        hasNextPage: boolean;
        nextPage: number;
    }>;
    getInvitedGroups(paginationDto: PaginationDto, request: any): Promise<{
        groups: ({
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
        } & {
            id: string;
            createdAt: Date;
            invitingUserId: string;
            invitedUserId: string;
            groupId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
        })[];
        hasNextPage: boolean;
        nextPage: number;
    }>;
    getJoinRequests(request: any): Promise<({
        group: {
            members: ({
                user: {
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
                };
            } & {
                id: string;
                groupId: string;
                userId: string;
                createdAt: Date;
            })[];
            moderators: ({
                user: {
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
                };
            } & {
                id: string;
                groupId: string;
                userId: string;
                createdAt: Date;
            })[];
            leader: {
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
    })[]>;
    getRequests(request: any): Promise<{
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
    getGroup(groupId: string): Promise<{
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
                            userId: string;
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
        members: ({
            user: {
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
            };
        } & {
            id: string;
            groupId: string;
            userId: string;
            createdAt: Date;
        })[];
        moderators: ({
            user: {
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
            };
        } & {
            id: string;
            groupId: string;
            userId: string;
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
            createdAt: Date;
            invitingUserId: string;
            invitedUserId: string;
            groupId: string;
            status: import("@prisma/client").$Enums.InvitationStatus;
        })[];
        leader: {
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
    }>;
    deleteGroup(groupId: string, request: any): Promise<boolean>;
    inviteToGroup(groupId: string, inviteToGroupDto: UsernameDto, request: any): Promise<{
        id: string;
        createdAt: Date;
        invitingUserId: string;
        invitedUserId: string;
        groupId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
    }>;
    acceptInvitation(groupId: string, request: any): Promise<boolean>;
    declineInvitation(groupId: string, request: any): Promise<boolean>;
    cancelInvitation(groupId: string, inviteToGroupDto: UsernameDto, request: any): Promise<false | {
        id: string;
        createdAt: Date;
        invitingUserId: string;
        invitedUserId: string;
        groupId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
    }>;
    acceptJoinRequest(groupId: string, joinRequestDto: JoinRequestDto, request: any): Promise<boolean>;
    declineJoinRequest(groupId: string, joinRequestDto: JoinRequestDto, request: any): Promise<boolean>;
    leaveGroup(groupId: string, request: any): Promise<boolean>;
    requestJoin(groupId: string, request: any): Promise<boolean>;
    deleteMember(groupId: string, usernameDto: UsernameDto, request: any): Promise<void>;
    deleteMod(groupId: string, usernameDto: UsernameDto, request: any): Promise<void>;
    addMemberToModList(groupId: string, usernameDto: UsernameDto, request: any): Promise<void>;
}
