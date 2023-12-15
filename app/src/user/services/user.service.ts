import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {Location} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {del, put} from "@vercel/blob";
import {UpdateUser} from "app/src/user/dto/UpdateUser";
import {randomUUID} from "crypto";
import {PrismaService} from "../../db/services/prisma.service";
import {NotificationsService} from "../../notifications/services/notifications.service";
import {UtilsService} from "../../utils/services/utils.service";
import {UploadImageDto} from "../../party/dto/UploadImageDto";
import {DeleteUserProfilePictureDto} from "../../party/dto/DeleteUserProfilePicture.dto";
import {SearchDto} from "../../feed/dto/Search.dto";
import {MemoryStorageFile} from "@blazity/nest-file-fastify";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private utils: UtilsService,
        private notifications: NotificationsService,
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
                return !user;
            });
    }

    async updateUser(user: UpdateUser, userId: string) {
        const {
            username,
            name,
            lastName,
            phoneNumber,
            gender,
            description,
            birthDate,
            interests,
            location,
            isCompany,
            expoPushToken,
            socialMedia,
        } = user;
        await this.prisma.location.update({
            where: {
                id: location.id,
            },
            data: {
                ...location,
            },
        });
        return this.prisma.user
            .update({
                where: {id: userId},
                data: {
                    username,
                    name,
                    lastName,
                    gender,
                    signedIn: true,
                    interests,
                    description,
                    birthDate,
                    phoneNumber,
                    isCompany,
                    expoPushToken: expoPushToken ?? "",
                    socialMedia,
                },
                include: this.utils.getUserFields(),
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
                    socialMedia: true,
                    name: true,
                    lastName: true,
                    profilePictures: true,
                    description: true,
                    birthDate: true,
                    gender: true,
                    interests: true,
                    userType: true,
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
                            party: {
                                include: {
                                    location: {
                                        select: {
                                            id: true,
                                            name: true,
                                            latitude: true,
                                            longitude: true,
                                            timestamp: true,
                                            address: true,
                                        },
                                    },
                                    consumables: true,
                                    covers: true,
                                    owner: {
                                        select: {
                                            username: true,
                                            socialMedia: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                                select: {
                                                    url: true,
                                                    id: true,
                                                },
                                            },
                                            verified: true,
                                            isCompany: true,
                                            gender: true,
                                            userType: true,
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
                                    owner: {
                                        select: {
                                            username: true,
                                            socialMedia: true,
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
                                            socialMedia: true,
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
                                include: {
                                    leader: {
                                        select: {
                                            username: true,
                                            socialMedia: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                                select: {
                                                    url: true,
                                                    id: true,
                                                },
                                            },
                                            verified: true,
                                            isCompany: true,
                                            gender: true,
                                            userType: true,
                                        },
                                    },
                                    members: {
                                        select: {
                                            user: {
                                                select: {
                                                    username: true,
                                                    socialMedia: true,
                                                    name: true,
                                                    lastName: true,
                                                    profilePictures: {
                                                        take: 1,
                                                        select: {
                                                            url: true,
                                                            id: true,
                                                        },
                                                    },
                                                    verified: true,
                                                    isCompany: true,
                                                    gender: true,
                                                    userType: true,
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
            });
    }

    async uploadProfilePicture(uploadImageDto: UploadImageDto, userId: string) {
        const {image} = uploadImageDto;
        if (!image) {
            throw new InternalServerErrorException("No image provided.");
        }

        const imageBuffer = Buffer.from(image.split(",")[1], "base64");
        const fileType = image.match(/data:image\/(.*?);base64/)?.[1];
        const uploadImageToVercel = async (retry = true) => {
            try {
                const {url} = await put(`profile-picture-${randomUUID()}.${fileType}`, imageBuffer, {
                    access: "public",
                });

                if (!url || url === "") {
                    throw new InternalServerErrorException("Error uploading image.");
                }

                this.prisma.profilePicture
                    .create({
                        data: {
                            url,
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                        },
                    })
                    .catch(() => {
                        throw new InternalServerErrorException("Error uploading image into the db.");
                    })
                    .then(async profilePicture => {
                        if ("id" in profilePicture && "url" in profilePicture && "userId" in profilePicture) {
                            const user = await this.prisma.user
                                .findUnique({
                                    where: {id: userId},
                                    select: {
                                        profilePictures: true,
                                    },
                                })
                                .catch(() => {
                                    throw new InternalServerErrorException("Error updating user.");
                                })
                                .then(user => user);

                            if (user && "profilePictures" in user && user.profilePictures) {
                                const profilePictures = [...user.profilePictures];

                                profilePictures.push(profilePicture);
                                await this.prisma.user
                                    .update({
                                        where: {id: userId},
                                        data: {
                                            profilePictures: {
                                                set: profilePictures,
                                            },
                                        },
                                        include: {
                                            profilePictures: true,
                                        },
                                    })
                                    .catch(() => {
                                        throw new InternalServerErrorException(
                                            "Error al agregar la imagen al usuario.",
                                        );
                                    })
                                    .then(async updatedUser => {
                                        if ("id" in updatedUser) {
                                            return profilePicture;
                                        } else {
                                            throw new InternalServerErrorException(
                                                "Error al obtener las imágenes del usuario 2.",
                                            );
                                        }
                                    });
                            } else {
                                throw new InternalServerErrorException("Error al obtener las imágenes del usuario.");
                            }
                        } else {
                            throw new InternalServerErrorException("Error al obtener las imágenes del usuario.");
                        }
                    });
            } catch (error) {
                if (retry) {
                    await uploadImageToVercel(false);
                } else {
                    throw new InternalServerErrorException("Error uploading image.");
                }
            }
        };
        await uploadImageToVercel();
    }

    async uploadProfilePicture2(image: MemoryStorageFile, userId: string) {
        if (!image) {
            throw new InternalServerErrorException("No image provided.");
        }
        const fileType = image.mimetype.split("/")[1];
        const uploadImageToVercel = async (retry = true) => {
            try {
                const {url} = await put(`profile-picture-${randomUUID()}.${fileType}`, image.buffer, {
                    access: "public",
                }).catch(() => {
                    throw new InternalServerErrorException("Error uploading image into vercel.");
                });

                if (!url || url === "") {
                    throw new InternalServerErrorException("Error uploading image.");
                }

                this.prisma.profilePicture
                    .create({
                        data: {
                            url,
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                        },
                    })
                    .catch(() => {
                        throw new InternalServerErrorException("Error uploading image into the db.");
                    })
                    .then(async profilePicture => {
                        if ("id" in profilePicture && "url" in profilePicture && "userId" in profilePicture) {
                            const user = await this.prisma.user
                                .findUnique({
                                    where: {id: userId},
                                    select: {
                                        profilePictures: true,
                                    },
                                })
                                .catch(() => {
                                    throw new InternalServerErrorException("Error updating user.");
                                })
                                .then(user => user);

                            if (user && "profilePictures" in user && user.profilePictures) {
                                const profilePictures = [...user.profilePictures];

                                profilePictures.push(profilePicture);
                                await this.prisma.user
                                    .update({
                                        where: {id: userId},
                                        data: {
                                            profilePictures: {
                                                set: profilePictures,
                                            },
                                        },
                                        include: {
                                            profilePictures: true,
                                        },
                                    })
                                    .catch(() => {
                                        throw new InternalServerErrorException(
                                            "Error al agregar la imagen al usuario.",
                                        );
                                    })
                                    .then(async updatedUser => {
                                        if ("id" in updatedUser) {
                                            return profilePicture;
                                        } else {
                                            throw new InternalServerErrorException(
                                                "Error al obtener las imágenes del usuario 2.",
                                            );
                                        }
                                    });
                            } else {
                                throw new InternalServerErrorException("Error al obtener las imágenes del usuario.");
                            }
                        } else {
                            throw new InternalServerErrorException("Error al obtener las imágenes del usuario.");
                        }
                    });
            } catch (error) {
                if (retry) {
                    await uploadImageToVercel(false);
                } else {
                    throw new InternalServerErrorException("Error uploading image.");
                }
            }
        };
        await uploadImageToVercel();
    }

    async uploadImage(image: MemoryStorageFile) {
        if (!image) {
            throw new InternalServerErrorException("No image provided.");
        }
        const fileType = image.mimetype.split("/")[1];
        const uploadImageToVercel = async (retry = true) => {
            try {
                const {url} = await put(`random-picture-${randomUUID()}.${fileType}`, image.buffer, {
                    access: "public",
                }).catch(() => {
                    throw new InternalServerErrorException("Error uploading image into vercel.");
                });

                if (!url || url === "") {
                    throw new InternalServerErrorException("Error uploading image.");
                }
            } catch (error) {
                if (retry) {
                    await uploadImageToVercel(false);
                } else {
                    throw new InternalServerErrorException("Error uploading image.");
                }
            }
        };
        await uploadImageToVercel();
    }

    async deleteProfilePicture(deleteUserProfilePictureDto: DeleteUserProfilePictureDto, userId: string) {
        const {url, id} = deleteUserProfilePictureDto;
        await del(url);

        await this.prisma.profilePicture
            .delete({
                where: {
                    id,
                },
            })
            .catch(() => {
                throw new InternalServerErrorException("Error al eliminar la imagen de la base de datos.");
            });

        return this.prisma.user.findUnique({
            where: {id: userId},
            include: this.utils.getUserFields(),
        });
    }

    async followUser(followedUsername: string, followerUserId: string) {
        const followedUser = await this.prisma.user.findUnique({
            where: {username: followedUsername},
            select: {
                id: true,
                expoPushToken: true,
                username: true,
                socialMedia: true,
            },
        });

        const followerUsername = await this.prisma.user.findUnique({
            where: {id: followerUserId},
            select: {
                username: true,
                socialMedia: true,
            },
        });

        if (!followedUser) {
            throw new NotFoundException("User not found.");
        }
        const followedUserId = followedUser.id; // usuario que es seguido
        const expoPushToken = followedUser.expoPushToken;

        const existingRelation = await this.prisma.userFollows.findUnique({
            where: {
                followerUserId_followedUserId: {
                    followerUserId,
                    followedUserId,
                },
            },
        });

        if (existingRelation) {
            throw new InternalServerErrorException("You are already following this user.");
        }

        return await this.prisma.userFollows
            .create({
                data: {
                    followerUserId,
                    followedUserId,
                    followerUsername: followedUsername,
                    followedUsername: followerUsername?.username || "",
                    followDate: new Date(),
                },
            })
            .catch(() => {
                throw new InternalServerErrorException("Error following user.");
            })
            .then(() => {
                this.notifications.sendNewFollowerNotification(expoPushToken, followerUserId);
                return true;
            });
    }

    async unFollowUser(unFollowedUsername: string, followerUserId: string) {
        const unFollowedUser = await this.prisma.user.findUnique({
            where: {username: unFollowedUsername},
        });
        if (!unFollowedUser) {
            throw new NotFoundException("User not found.");
        }

        const followedUserId = unFollowedUser.id;

        const existingRelation = await this.prisma.userFollows.findUnique({
            where: {
                followerUserId_followedUserId: {
                    followerUserId,
                    followedUserId,
                },
            },
        });

        if (!existingRelation) {
            throw new InternalServerErrorException("You are not following this user.");
        }

        return await this.prisma.userFollows
            .delete({
                where: {
                    followerUserId_followedUserId: {
                        followerUserId,
                        followedUserId,
                    },
                },
            })
            .catch(() => {
                throw new InternalServerErrorException("Error un following user.");
            })
            .then(() => true);
    }

    async getFollowerUserInfo(username: string) {
        return await this.prisma.user.findUnique({
            where: {
                signedIn: true,
                username,
            },
            select: {
                username: true,
                socialMedia: true,
                name: true,
                lastName: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true,
                        id: true,
                    },
                },
                description: true,
                birthDate: true,
                gender: true,
                interests: true,
                userType: true,
                verified: true,
                location: {
                    select: {
                        name: true,
                    },
                },
                createdAt: true,
                lastLogin: true,
                isCompany: true,
            },
        });
    }

    async searchUsers(searchDto: SearchDto) {
        const {search, page, limit} = searchDto;
        const skip = page * limit;
        return await this.prisma.user.findMany({
            skip: skip,
            take: limit,
            where: {
                signedIn: true,
                OR: [
                    {username: {contains: search, mode: "insensitive"}},
                    {name: {contains: search, mode: "insensitive"}},
                    {lastName: {contains: search, mode: "insensitive"}},
                ],
            },
            orderBy: [{isCompany: "desc"}, {verified: "desc"}, {username: "desc"}],
            select: {
                username: true,
                socialMedia: true,
                name: true,
                lastName: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true,
                        id: true,
                    },
                },
                description: true,
                birthDate: true,
                gender: true,
                interests: true,
                userType: true,
                verified: true,
                location: {
                    select: {
                        name: true,
                    },
                },
                createdAt: true,
                lastLogin: true,
                isCompany: true,
            },
        });
    }

    async getUserById(id: string) {
        return this.prisma.user.findFirst({
            where: {id},
            include: this.utils.getUserFields(),
        });
    }

    async purgeUserById(id: string) {
        const user = await this.prisma.user.findFirst({
            where: {id},
            include: {
                profilePictures: true,
                parties: true,
                groups: true,
            },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Delete all profile pictures
        for (const profilePicture of user.profilePictures) {
            await del(profilePicture.url);
            await this.prisma.profilePicture.delete({where: {id: profilePicture.id}});
        }

        // Delete all party memberships
        await this.prisma.partyMember.deleteMany({where: {userId: id}});

        // Delete all group memberships
        await this.prisma.groupMember.deleteMany({where: {userId: id}});

        // Delete all user follows
        await this.prisma.userFollows.deleteMany({where: {followerUserId: id}});
        await this.prisma.userFollows.deleteMany({where: {followedUserId: id}});

        // Delete all party invitations
        await this.prisma.partyInvitation.deleteMany({where: {invitingUserId: id}});
        await this.prisma.partyInvitation.deleteMany({where: {invitedUserId: id}});

        // Delete all group invitations
        await this.prisma.groupInvitation.deleteMany({where: {invitingUserId: id}});
        await this.prisma.groupInvitation.deleteMany({where: {invitedUserId: id}});

        // Delete all membership requests
        await this.prisma.membershipRequest.deleteMany({where: {userId: id}});

        // Delete all party moderations
        await this.prisma.userPartyModerator.deleteMany({where: {userId: id}});

        // Delete all group moderations
        await this.prisma.userGroupModerator.deleteMany({where: {userId: id}});

        // Delete all owned parties
        const ownedParties = await this.prisma.party.findMany({where: {ownerId: id}});
        for (const party of ownedParties) {
            await this.prisma.partyGroup.deleteMany({where: {partyId: party.id}});
            await this.prisma.partyInvitation.deleteMany({where: {partyId: party.id}});
            await this.prisma.membershipRequest.deleteMany({where: {partyId: party.id}});
        }
        await this.prisma.party.deleteMany({where: {ownerId: id}});

        // Delete all led groups
        const ledGroups = await this.prisma.group.findMany({where: {leaderId: id}});
        for (const group of ledGroups) {
            await this.prisma.partyGroup.deleteMany({where: {groupId: group.id}});
            await this.prisma.groupInvitation.deleteMany({where: {groupId: group.id}});
            await this.prisma.membershipRequest.deleteMany({where: {groupId: group.id}});
        }
        await this.prisma.group.deleteMany({where: {leaderId: id}});

        // Delete user
        await this.prisma.user.delete({where: {id}});

        return true;
    }

    async updateAndGetUserById(id: string, location: Location, expoPushToken: string) {
        await this.prisma.location.update({
            where: {
                id: location.id,
            },
            data: {
                latitude: location.latitude,
                longitude: location.longitude,
                name: location.name,
                timestamp: location.timestamp,
                address: location.address,
            },
        });
        return this.prisma.user.update({
            where: {id},
            data: {
                expoPushToken,
            },
            include: this.utils.getUserFields(),
        });
    }
}
