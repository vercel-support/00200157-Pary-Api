import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import {CreatePartyDto} from "app/dtos/party/CreateParty.dto";
import {configureAmazonCognito} from "app/src/main";
import {Storage} from "aws-amplify";
import {randomUUID} from "crypto";
import {PrismaService} from "../db/prisma.service";
import {NotificationsService} from "../notifications/notifications.service";
import {UtilsService} from "../utils/utils.service";

@Injectable()
export class PartyService {
    constructor(
        private prisma: PrismaService,
        private utils: UtilsService,
        private notifications: NotificationsService,
    ) {}

    async createParty(partyBody: CreatePartyDto, userId: string) {
        const {
            name,
            description,
            location,
            date,
            type,
            tags,
            participants,
            image,
            showAddressInFeed,
            ageRange,
            isPrivate,
        } = partyBody;
        const userParties = await this.prisma.party.count({
            where: {
                ownerId: userId,
                active: true,
                date: {
                    gte: new Date(),
                },
            },
        });

        if (userParties >= 15) {
            throw new BadRequestException("You can only create up to 15 parties.");
        }

        const inviter = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {name: true, username: true, id: true},
        });

        if (!inviter) {
            console.log("Error fetching user data.");
            throw new NotFoundException("User not found");
        }

        // Resto de la lógica después de una carga exitosa

        const usersToInvite: string[] = participants;

        const users = await this.prisma.user.findMany({
            where: {
                username: {
                    in: usersToInvite,
                },
            },
            select: {
                id: true,
                username: true,
                expoPushToken: true, // asumimos que usarás Expo para notificaciones push
            },
        });
        const party = await this.prisma.party.create({
            data: {
                name,
                description,
                location,
                type,
                tags,
                advertisement: false,
                active: true,
                date: new Date(date),
                private: isPrivate,
                ownerId: userId,
                image,
                showAddressInFeed,
                ageRange,
            },
        });

        if (!party) {
            throw new InternalServerErrorException("Error creating party.");
        }
        await this.prisma.partyMember.create({
            data: {
                partyId: party.id,
                userId,
            },
        });

        for (const user of users) {
            if (user.id === userId) continue;
            const response = await this.prisma.partyInvitation.create({
                data: {
                    partyId: party.id,
                    invitedUserId: user.id,
                    invitingUserId: userId,
                },
            });
            if (response) {
                this.notifications.sendPartyInviteNotification(
                    user.expoPushToken,
                    inviter,
                    party.name,
                    party.id,
                    party.type,
                );
            }

            // Aquí podrías enviar una notificación push a cada usuario invitado
        }

        return party;
    }

    async getOwnParties(page: number, limit: number, userId: string) {
        const skip = page * limit;
        const currentUser = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                location: true,
            },
        });

        if (!currentUser) {
            throw new NotFoundException("User not found");
        }
        const parties = await this.prisma.party.findMany({
            where: {
                OR: [
                    {ownerId: userId},
                    {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                    {
                        moderators: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            include: {
                owner: {
                    select: {
                        username: true,
                        name: true,
                        lastName: true,
                        profilePictures: {take: 1},
                        verified: true,
                        isCompany: true,
                        gender: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {take: 1},
                                verified: true,
                                isCompany: true,
                                gender: true,
                            },
                        },
                    },
                },
                invitations: {
                    include: {
                        invitedUser: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {take: 1},
                                verified: true,
                                isCompany: true,
                                gender: true,
                            },
                        },
                    },
                },
                membershipRequests: {
                    include: {
                        group: {
                            select: {
                                leader: {
                                    select: {
                                        username: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {take: 1},
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                    },
                                },
                                members: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {take: 1},
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                            },
                                        },
                                    },
                                },
                                moderators: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {take: 1},
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        user: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: {take: 1},
                                verified: true,
                                isCompany: true,
                                gender: true,
                            },
                        },
                    },
                },
            },
            take: limit,
            skip: skip,
            orderBy: {date: "asc"},
        });

        const totalParties = await this.prisma.party.count({
            where: {
                OR: [
                    {ownerId: userId},
                    {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                    {
                        moderators: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
        });

        const partiesToReturn = await Promise.all(
            parties.map(async party => {
                const distance = this.utils.haversineDistance(currentUser.location, party.location);
                party.distance = distance;
                return party;
            }),
        );

        const hasNextPage = page * limit < totalParties;
        const nextPage = hasNextPage ? page + 1 : null;

        return {
            parties: partiesToReturn,
            hasNextPage,
            nextPage,
        };
    }

    async uploadPartyImage(body: any) {
        const imageBase64 = body.image;

        if (!imageBase64) {
            throw new BadRequestException("No image provided.");
        }

        const imageBuffer = Buffer.from(imageBase64.split(",")[1], "base64");
        const fileType = imageBase64.match(/data:image\/(.*?);base64/)?.[1]; // obtiene el tipo de imagen (png, jpeg, etc.)

        const uploadImageToS3 = async (retry = true) => {
            try {
                const result = await Storage.put(`party-${randomUUID()}.` + fileType, imageBuffer, {
                    contentType: "image/" + fileType,
                    level: "public",
                });

                // Resto de la lógica después de una carga exitosa
                const imageUrl = `https://parystorage-001125056-staging.s3.sa-east-1.amazonaws.com/public/${result.key}`;

                if (imageUrl === "") {
                    console.log("Error uploading image.2");
                    throw new InternalServerErrorException("Error uploading image.");
                }

                const image = {
                    amazonId: result.key,
                    url: imageUrl,
                };

                return image;
            } catch (error) {
                if (retry) {
                    configureAmazonCognito();
                    uploadImageToS3(false);
                } else {
                    throw new InternalServerErrorException("Error uploading image.");
                }
            }
        };
        return await uploadImageToS3();
    }

    async getInvitedParties(limit: number, page: number, userId: string) {
        const currentUser = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                location: true,
            },
        });

        if (!currentUser) {
            throw new NotFoundException("User not found");
        }

        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                invitedParties: {
                    select: {
                        partyId: true,
                        party: {
                            include: {
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
                                members: {
                                    select: {
                                        userId: true,
                                        user: {
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
                                moderators: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {take: 1},
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const totalGroups = user.invitedParties.length;

        const hasNextPage = page * limit < totalGroups;
        const nextPage = hasNextPage ? page + 1 : null;

        return {
            parties: user.invitedParties,
            hasNextPage,
            nextPage,
        };
    }

    async getParty(partyId: string, userId: string) {
        return await this.prisma.party
            .findUnique({
                where: {id: partyId},
                include: {
                    owner: {
                        select: {
                            username: true,
                            name: true,
                            lastName: true,
                            profilePictures: {take: 1},
                            verified: true,
                            isCompany: true,
                            gender: true,
                        },
                    },
                    members: {
                        include: {
                            user: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {take: 1},
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                    invitations: {
                        include: {
                            invitedUser: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {take: 1},
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                    membershipRequests: {
                        include: {
                            group: {
                                select: {
                                    leader: {
                                        select: {
                                            username: true,
                                            name: true,
                                            lastName: true,
                                            profilePictures: {take: 1},
                                            verified: true,
                                            isCompany: true,
                                            gender: true,
                                        },
                                    },
                                    members: {
                                        include: {
                                            user: {
                                                select: {
                                                    username: true,
                                                    name: true,
                                                    lastName: true,
                                                    profilePictures: {take: 1},
                                                    verified: true,
                                                    isCompany: true,
                                                    gender: true,
                                                },
                                            },
                                        },
                                    },
                                    moderators: {
                                        include: {
                                            user: {
                                                select: {
                                                    username: true,
                                                    name: true,
                                                    lastName: true,
                                                    profilePictures: {take: 1},
                                                    verified: true,
                                                    isCompany: true,
                                                    gender: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            user: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {take: 1},
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                },
            })
            .then(async party => {
                if (!party) {
                    throw new NotFoundException("Party not found");
                }

                const currentUser = await this.prisma.user.findUnique({
                    where: {id: userId},
                    select: {
                        location: true,
                    },
                });

                if (!currentUser) {
                    throw new NotFoundException("User not found");
                }

                const distance = this.utils.haversineDistance(currentUser.location, party.location);
                party.distance = distance;

                return party;
            })
            .catch(() => {
                throw new NotFoundException("User not found");
            });
    }

    async leaveParty(partyId: string, userId: string) {
        const party = await this.prisma.party.findUnique({
            where: {id: partyId},
        });

        if (!party) {
            throw new NotFoundException("Party not found");
        }

        // If the user is the owner of the group
        if (party.ownerId === userId) {
            // Delete all group invitations related to this group
            await this.prisma.partyInvitation.deleteMany({
                where: {partyId},
            });

            // Delete all group members
            await this.prisma.partyMember.deleteMany({
                where: {partyId},
            });

            // Delete the group itself
            await this.prisma.party.delete({
                where: {id: partyId},
            });

            await Storage.remove(party.image.amazonId, {level: "public"}).catch(() => {
                throw new InternalServerErrorException("Error deleting image from S3.");
            });
            return true;
        } else {
            // If the user is not the owner but a member of the group
            const isMember = await this.prisma.partyMember.findFirst({
                where: {
                    partyId,
                    userId: userId,
                },
            });

            if (!isMember) {
                throw new ForbiddenException("You are not a member of this group.");
            }

            // Delete all group invitations from and to the user related to this group
            await this.prisma.partyInvitation.deleteMany({
                where: {
                    partyId,
                    OR: [{invitedUserId: userId}, {invitingUserId: userId}],
                },
            });

            // Remove the user from the group
            await this.prisma.partyMember.delete({
                where: {
                    userId_partyId: {
                        partyId,
                        userId: userId,
                    },
                },
            });
            return true;
        }
    }

    async acceptInvitation(partyId: string, userId: string) {
        const invitation = await this.prisma.partyInvitation.findFirst({
            where: {
                partyId,
                invitedUserId: userId,
            },
        });

        if (invitation) {
            await this.prisma.partyInvitation.delete({
                where: {id: invitation.id},
            });
        }

        await this.prisma.partyMember.create({
            data: {
                partyId,
                userId: userId,
            },
        });

        const members = await this.prisma.party.findMany({
            where: {
                id: partyId,
            },
            select: {
                members: {
                    select: {
                        user: {
                            select: {
                                expoPushToken: true,
                            },
                        },
                    },
                },
            },
        });

        if (members) {
            const expoTokens = members.flatMap(member =>
                member.members.map(partyMember => partyMember.user.expoPushToken),
            );
            this.notifications.sendNewPartyMemberNotification(expoTokens, userId, partyId);
        }
        return true;
    }

    async declineInvitation(partyId: string, userId: string) {
        const invitation = await this.prisma.partyInvitation.findFirst({
            where: {
                partyId,
                invitedUserId: userId,
            },
        });

        if (invitation) {
            await this.prisma.partyInvitation.delete({
                where: {id: invitation.id},
            });
        }

        const joinRequest = await this.prisma.membershipRequest.findFirst({
            where: {
                partyId,
                userId,
            },
        });

        if (joinRequest) {
            await this.prisma.membershipRequest.delete({
                where: {id: joinRequest.id},
            });
        }

        //TODO: Enviar notificacion al usuario que invito
        return true;
    }

    async requestJoin(partyId: string, userId: string, groupId?: string) {
        // Obtenemos la información del party.
        const party = await this.prisma.party.findUnique({
            where: {id: partyId},
        });

        if (!party) {
            throw new NotFoundException("Party no encontrado");
        }

        // Chequear si el grupo existe si se proporciona un groupId.
        if (groupId) {
            const group = await this.prisma.group.findUnique({
                where: {id: groupId},
            });

            if (!group) {
                throw new NotFoundException("Grupo no encontrado");
            }
        }

        // Verificar si el usuario ya es un miembro del party.
        const isUserMember = await this.prisma.partyMember.findUnique({
            where: {
                userId_partyId: {
                    userId,
                    partyId,
                },
            },
        });

        if (isUserMember) {
            throw new InternalServerErrorException("El usuario ya es miembro de este party");
        }

        // Verificar si el grupo ya es miembro del party.
        if (groupId) {
            const isGroupMember = await this.prisma.partyGroup.findUnique({
                where: {
                    partyId_groupId: {
                        partyId,
                        groupId,
                    },
                },
            });

            if (isGroupMember) {
                throw new Error("El grupo ya es miembro de este party");
            }
        }

        // Si el party es público
        if (!party.private) {
            if (groupId) {
                // Unir el grupo al party
                await this.prisma.partyGroup.create({
                    data: {
                        partyId,
                        groupId,
                    },
                });
            } else {
                // Unir el usuario al party
                await this.prisma.partyMember.create({
                    data: {
                        partyId,
                        userId,
                    },
                });
            }
            return true;
        } else {
            // Verificar si el usuario o grupo ya ha solicitado unirse al party.
            const existingRequest = await this.prisma.membershipRequest.findUnique({
                where: {
                    userId_partyId: {
                        userId,
                        partyId,
                    },
                },
            });

            if (existingRequest) {
                throw new Error("Ya has solicitado unirte a este party");
            }

            // Crear una solicitud para unirse al party.
            if (groupId) {
                await this.prisma.membershipRequest.create({
                    data: {
                        groupId,
                        partyId,
                        type: "GROUP",
                    },
                });
            } else {
                await this.prisma.membershipRequest.create({
                    data: {
                        userId,
                        partyId,
                        type: "SOLO",
                    },
                });
            }

            return true;
        }
    }
}
