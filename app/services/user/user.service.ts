import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {UpdateUserDto} from "app/dtos/user/UpdateUser.dto";
import {configureAmazonCognito} from "app/src/main";
import {Amplify, Storage} from "aws-amplify";
import {randomUUID} from "crypto";
import {PrismaService} from "../db/prisma.service";
import {NotificationsService} from "../notifications/notifications.service";
import {UtilsService} from "../utils/utils.service";
import {Location} from "@prisma/client";

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
                                    image: true,
                                    id: true,
                                    owner: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
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
                                    image: true,
                                    id: true,
                                    owner: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    ownedParties: {
                        select: {
                            name: true,
                            description: true,
                            image: true,
                            id: true,
                            owner: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                    },
                                },
                            },
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
                                    leader: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
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
                                    leader: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
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
                                    leader: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {
                                                take: 1,
                                            },
                                        },
                                    },
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
            });
    }

    async uploadProfilePicture(body: any, userId: string) {
        const imageBase64 = body.image;

        if (!imageBase64) {
            throw new InternalServerErrorException("No image provided.");
        }

        const imageBuffer = Buffer.from(imageBase64.split(",")[1], "base64");
        const fileType = imageBase64.match(/data:image\/(.*?);base64/)?.[1];
        const uploadImageToS3 = async (retry = true) => {
            try {
                const result = await Storage.put(`profile-${randomUUID()}.` + fileType, imageBuffer, {
                    contentType: "image/" + fileType,
                    level: "public",
                });

                // Resto de la lógica después de una carga exitosa
                const imageUrl = `https://parystorage-001125056-staging.s3.sa-east-1.amazonaws.com/public/${result.key}`;

                if (imageUrl === "") {
                    throw new InternalServerErrorException("Error uploading image, imageUrl === empty.");
                }

                this.prisma.profilePicture
                    .create({
                        data: {
                            url: imageUrl,
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                            amazonId: result.key,
                        },
                    })
                    .catch(() => {
                        throw new InternalServerErrorException("Error uploading image into the db.");
                    })
                    .then(async profilePicture => {
                        if (
                            "id" in profilePicture &&
                            "url" in profilePicture &&
                            "amazonId" in profilePicture &&
                            "userId" in profilePicture
                        ) {
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
                                this.prisma.user
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
                    configureAmazonCognito();
                    uploadImageToS3(false);
                } else {
                    throw new InternalServerErrorException("Error uploading image.");
                }
            }
        };
        await uploadImageToS3();
    }

    async deleteProfilePicture(amazonId: string, id: string, userId: string) {
        await Storage.remove(amazonId, {level: "public"}).catch(() => {
            Amplify.Auth.currentAuthenticatedUser();
            throw new InternalServerErrorException("Error al eliminar la imagen de S3.");
        });

        await this.prisma.profilePicture
            .delete({
                where: {
                    id,
                },
            })
            .catch(() => {
                throw new InternalServerErrorException("Error al eliminar la imagen de la base de datos.");
            });

        return await this.prisma.user
            .findUnique({
                where: {id: userId},
                include: this.utils.getUserFields(),
            })
            .catch(() => {
                throw new InternalServerErrorException("Error al obtener el usuario.");
            });
    }

    async followUser(followedUsername: string, followerUserId: string) {
        const followedUser = await this.prisma.user.findUnique({
            where: {username: followedUsername},
            select: {
                id: true,
                expoPushToken: true,
                username: true,
            },
        });

        const followerUsername = await this.prisma.user.findUnique({
            where: {id: followerUserId},
            select: {
                username: true,
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

        await this.prisma.userFollows
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
            });

        this.notifications.sendNewFollowerNotification(expoPushToken, followerUserId);
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

        await this.prisma.userFollows
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
            });
    }

    async getFollowerUserInfo(username: string) {
        return await this.prisma.user.findUnique({
            where: {
                signedIn: true,
                username,
            },
            select: {
                username: true,
                name: true,
                lastName: true,
                profilePictures: {take: 1},
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
            },
        });
    }

    async searchUsers(page: number, limit: number, search: string) {
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
                name: true,
                lastName: true,
                profilePictures: {take: 1},
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
            },
        });
    }

    async getUserById(id: string) {
        return await this.prisma.user
            .findFirst({
                where: {id},
                include: this.utils.getUserFields(),
            })
            .catch(() => {
                throw new InternalServerErrorException("Error fetching user data.");
            });
    }

    async updateAndGetUserById(id: string, location: Location, expoPushToken: string) {
        return await this.prisma.user
            .update({
                where: {id},
                data: {
                    location,
                    expoPushToken,
                },
                include: this.utils.getUserFields(),
            })
            .catch(() => {
                throw new InternalServerErrorException("Error fetching user data.");
            });
    }
}
