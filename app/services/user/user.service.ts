import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../db/prisma.service";
import {UpdateUserDto} from "app/dtos/user/UpdateUser.dto";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {UtilsService} from "../utils/utils.service";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private utils: UtilsService,
    ) {}

    async checkUsername(username: string) {
        return this.prisma.user
            .findUnique({
                where: {
                    username,
                },
                select: {
                    username: true,
                },
            })
            .then(user => {
                console.log("user", user);
                return !user;
            });
    }

    async updateUser(user: UpdateUserDto, userId: string) {
        const {
            username,
            name,
            lastName,
            phoneNumber,
            gender,
            description,
            birthDate,
            musicInterest,
            deportsInterest,
            artAndCultureInterest,
            techInterest,
            hobbiesInterest,
            location,
            isCompany,
            expoPushToken,
        } = user;
        return this.prisma.user
            .update({
                where: {id: userId},
                data: {
                    username,
                    name,
                    lastName,
                    gender: gender,
                    signedIn: true,
                    musicInterest,
                    deportsInterest,
                    artAndCultureInterest,
                    techInterest,
                    hobbiesInterest,
                    description,
                    birthDate,
                    phoneNumber,
                    location,
                    isCompany,
                    expoPushToken: expoPushToken ?? "",
                },
                include: {
                    profilePictures: true,
                    followerUserList: true,
                    followingUserList: true,
                    parties: {
                        select: {
                            partyId: true,
                        },
                    },
                    invitedParties: {
                        select: {
                            partyId: true,
                            party: {
                                select: {
                                    name: true,
                                    description: true,
                                    owner: {
                                        select: {
                                            username: true,
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
                                    owner: {
                                        select: {
                                            username: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    ownedParties: {
                        select: {
                            id: true,
                        },
                    },
                    partiesModerating: {
                        select: {
                            partyId: true,
                        },
                    },
                    groupsModerating: {
                        select: {
                            groupId: true,
                        },
                    },
                    groups: {
                        select: {
                            groupId: true,
                            group: {
                                select: {
                                    name: true,
                                    description: true,
                                    leaderId: true,
                                },
                            },
                        },
                    },
                    invitedGroups: {
                        select: {
                            groupId: true,
                            group: {
                                select: {
                                    name: true,
                                    description: true,
                                    leaderId: true,
                                },
                            },
                        },
                    },
                    invitingGroups: {
                        select: {
                            groupId: true,
                            group: {
                                select: {
                                    name: true,
                                    description: true,
                                    leaderId: true,
                                },
                            },
                        },
                    },
                },
            })
            .catch(error => {
                if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
                    throw new InternalServerErrorException("El nombre de usuario ya está en uso.");
                } else {
                    throw new InternalServerErrorException("Error al actualizar el usuario.");
                }
            });
    }

    async getBasicUserInfo(username: string) {
        return this.prisma.user
            .findUnique({
                where: {username},
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: true,
                    description: true,
                    birthDate: true,
                    gender: true,
                    musicInterest: true,
                    deportsInterest: true,
                    artAndCultureInterest: true,
                    techInterest: true,
                    hobbiesInterest: true,
                    verified: true,
                    location: {
                        select: {
                            name: true,
                        },
                    },
                    createdAt: true,
                    lastLogin: true,
                    isCompany: true,
                    followingUserList: true,
                    followerUserList: true,
                    parties: {
                        select: {
                            partyId: true,
                        },
                    },
                    invitedParties: {
                        select: {
                            partyId: true,
                            party: {
                                select: {
                                    name: true,
                                    description: true,
                                    owner: {
                                        select: {
                                            username: true,
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
                                    owner: {
                                        select: {
                                            username: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    ownedParties: {
                        select: {
                            id: true,
                        },
                    },
                    partiesModerating: {
                        select: {
                            partyId: true,
                        },
                    },
                    groupsModerating: {
                        select: {
                            groupId: true,
                        },
                    },
                    groups: {
                        select: {
                            groupId: true,
                            group: {
                                select: {
                                    name: true,
                                    description: true,
                                    leaderId: true,
                                },
                            },
                        },
                    },
                    invitedGroups: {
                        select: {
                            groupId: true,
                            group: {
                                select: {
                                    name: true,
                                    description: true,
                                    leaderId: true,
                                },
                            },
                        },
                    },
                    invitingGroups: {
                        select: {
                            groupId: true,
                            group: {
                                select: {
                                    name: true,
                                    description: true,
                                    leaderId: true,
                                },
                            },
                        },
                    },
                },
            })
            .catch(() => {
                throw new InternalServerErrorException("Error fetching user data.");
            })
            .then(async user => {
                if (!user) {
                    throw new NotFoundException("User not found.");
                }

                // Renovar URLs de las imágenes
                for (const pic of user.profilePictures) {
                    if (!pic || !pic.amazonId) continue;
                    pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                }

                return user;
            });
    }
}
