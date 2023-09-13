import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../db/prisma.service";
import {UtilsService} from "../utils/utils.service";
import {NotificationsService} from "../notifications/notifications.service";
import {CreatePartyDto} from "app/dtos/party/CreateParty.dto";
import {Amplify, Storage} from "aws-amplify";
import {randomUUID} from "crypto";
import {configureAmazonCognito} from "app/src/main";

@Injectable()
export class PartyService {
    constructor(
        private prisma: PrismaService,
        private utils: UtilsService,
        private notifications: NotificationsService,
    ) {}

    async getOwnParties(page: number, limit: number, userId: string) {
        const skip = (page - 1) * limit;
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
                if (party.image.amazonId) {
                    party.image.url = await this.utils.getCachedImageUrl(party.image.amazonId);
                }
                const pic = party.owner.profilePictures[0];
                if (!pic || !pic.amazonId) return;
                pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                party.owner.profilePictures[0] = pic;
                if (party?.members) {
                    for (let i = 0; i < party.members.length; i++) {
                        const pic = party.members[i].user.profilePictures[0];
                        if (!pic || !pic.amazonId) continue;
                        pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                        party.members[i].user.profilePictures[0] = pic;
                    }
                }
                if (party?.moderators) {
                    for (let i = 0; i < party.moderators.length; i++) {
                        const pic = party.moderators[i].user.profilePictures[0];
                        if (!pic || !pic.amazonId) continue;
                        pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                        party.moderators[i].user.profilePictures[0] = pic;
                    }
                }
                return party;
            }),
        );

        const hasNextPage = page * limit < totalParties;
        const nextPage = hasNextPage ? page + 1 : null;

        res.status(200).json({parties: partiesToReturn, hasNextPage, nextPage});
    }

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
            return res.status(400).json({error: "You can only create up to 15 parties."});
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
            console.log("Error creating party.");
            return respondWithError(res, 500, "Error creating party.");
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

        res.status(200).json({party});
    }

    async uploadPartyImage(body: any) {
        const imageBase64 = body.image;

        if (!imageBase64) {
            console.log("Error uploading image.1");
            return respondWithError(res, 400, "No image provided.");
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
                const imageUrl = await this.utils.getCachedImageUrl(result.key);

                if (imageUrl === "") {
                    console.log("Error uploading image.2");
                    return res.status(500).json({error: "Error uploading image."});
                }

                res.status(200).json({url: imageUrl, amazonId: result.key});
            } catch (error) {
                logger.error("Error al subir la imagen a S3:", error);
                if (retry) {
                    logger.info("Reconfigurando Amplify y reintentando...");
                    configureAmazonCognito();
                    uploadImageToS3(false);
                } else {
                    return respondWithError(res, 500, "Error uploading image.");
                }
            }
        };
        await uploadImageToS3();
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

        const invitedParties = await this.prisma.user.findMany({
            where: {id: userId},
            select: {
                invitedParties: {
                    select: {
                        party: {
                            include: {
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

        const parties = invitedParties.flatMap(user => user.invitedParties.map(invitedParty => invitedParty.party));

        const totalGroups = parties.length;

        const hasNextPage = page * limit < totalGroups;
        const nextPage = hasNextPage ? page + 1 : null;

        for (let i = 0; i < parties.length; i++) {
            const party = parties[i];
            const distance = this.utils.haversineDistance(currentUser.location, party.location);
            party.distance = distance;
            if (party.image.amazonId) {
                party.image.url = await this.utils.getCachedImageUrl(party.image.amazonId);
            }
            const pic = party.owner.profilePictures[0];
            if (!pic || !pic.amazonId) return;
            pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
            party.owner.profilePictures[0] = pic;
            if (party?.members) {
                for (let i = 0; i < party.members.length; i++) {
                    const pic = party.members[i].user.profilePictures[0];
                    if (!pic || !pic.amazonId) continue;
                    pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                    party.members[i].user.profilePictures[0] = pic;
                }
            }

            if (party?.moderators) {
                for (let i = 0; i < party.moderators.length; i++) {
                    const pic = party.moderators[i].user.profilePictures[0];
                    if (!pic || !pic.amazonId) continue;
                    pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                    party.moderators[i].user.profilePictures[0] = pic;
                }
            }
        }

        res.status(200).json({parties, hasNextPage, nextPage});
    }

    async getParty(partyId: string, userId: string) {
        await this.prisma.party
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
            })
            .then(async party => {
                if (!party) {
                    return res.status(404).json({error: "Party not found."});
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
                party.image.url = await this.utils.getCachedImageUrl(party.image.amazonId);

                const pic = party.owner.profilePictures[0];
                if (!pic || !pic.amazonId) return;
                pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                party.owner.profilePictures[0] = pic;
                if (party?.members) {
                    for (let i = 0; i < party.members.length; i++) {
                        const pic = party.members[i].user.profilePictures[0];
                        if (!pic || !pic.amazonId) continue;
                        pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                        party.members[i].user.profilePictures[0] = pic;
                    }
                }

                if (party?.moderators) {
                    for (let i = 0; i < party.moderators.length; i++) {
                        const pic = party.moderators[i].user.profilePictures[0];
                        if (!pic || !pic.amazonId) continue;
                        pic.url = await this.utils.getCachedImageUrl(pic.amazonId);
                        party.moderators[i].user.profilePictures[0] = pic;
                    }
                }
                return res.status(200).json({party});
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
            return respondWithError(res, 404, "Group not found.");
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

            try {
                await Storage.remove(party.image.amazonId, {level: "public"});
            } catch (error) {
                Amplify.Auth.currentAuthenticatedUser();
                logger.error("Error al eliminar la imagen de S3:", error);
                return respondWithError(res, 500, "Error al eliminar la imagen de S3.");
            }

            res.status(200).json({message: "Party deleted as you are the owner."});
        } else {
            // If the user is not the owner but a member of the group
            const isMember = await this.prisma.partyMember.findFirst({
                where: {
                    partyId,
                    userId: userId,
                },
            });

            if (!isMember) {
                return respondWithError(res, 403, "You are not a member of this group.");
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

            res.status(200).json({message: "User left party."});
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

        res.status(200).json({message: "Invitation accepted and user added to party."});
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
        //TODO: Enviar notificacion al usuario que invito

        res.status(200).json({message: "Invitation declined."});
    }
}
