import { Amplify, Storage } from "aws-amplify";
import { randomUUID } from "crypto";
import express, { Response } from "express";
import { configureAmazonCognito, logger, prisma } from "..";
import { AuthenticatedRequest } from "../../types";
import { sendPartyInviteNotification } from "../utils/NotificationsUtils";
import { authenticateTokenMiddleware, haversineDistance, respondWithError } from "../utils/Utils";
import { getCachedImageUrl } from "./usersRoute";

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (JWT_SECRET === undefined) {
    throw new Error("No JWT_SECRET env variable found.");
}

if (JWT_REFRESH_SECRET === undefined) {
    throw new Error("No JWT_REFRESH_SECRET env variable found.");
}

const router = express.Router();

router.get("/own-parties", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;

    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    const { id } = decoded;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;


    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                location: true,
            }
        });

        if (!currentUser) {
            return respondWithError(res, 500, "Error fetching user data.");
        }
        const parties = await prisma.party.findMany({
            where: {
                OR: [
                    { ownerId: id },
                    {
                        members: {
                            some: {
                                userId: id
                            }
                        }
                    },
                    {
                        moderators: {
                            some: {
                                userId: id
                            }
                        }
                    }
                ]
            },
            take: limit,
            skip: skip,
            orderBy: { date: 'asc' },
        });

        const totalParties = await prisma.party.count({
            where: {
                OR: [
                    { ownerId: id },
                    {
                        members: {
                            some: {
                                userId: id
                            }
                        }
                    },
                    {
                        moderators: {
                            some: {
                                userId: id
                            }
                        }
                    }
                ]
            }
        });

        const partiesToReturn = await Promise.all(parties.map(async party => {

            const distance = haversineDistance(currentUser.location, party.location);
            if (party.image.amazonId) {
                party.image.url = await getCachedImageUrl(party.image.amazonId);
            }

            return { ...party, distance };
        }));

        const hasNextPage = (page * limit) < totalParties;
        const nextPage = hasNextPage ? page + 1 : null;

        res.status(200).json({ parties: partiesToReturn, hasNextPage, nextPage });

    } catch (error) {
        logger.error("Error fetching parties:", error);
        return respondWithError(res, 500, "Error al buscar las fiestas.");
    }
});
router.post('/create', authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, description, location, date, type, tags, participants, image, showAddressInFeed } = req.body;
        const decoded = req.decoded;
        if (typeof decoded !== "object" || !("id" in decoded)) {
            return respondWithError(res, 500, "Error al decodificar el token.");
        }
        /* 
                if (!name || !description || !location || !date || !type || !tags || !image) {
                    return res.status(400).json({ error: "Missing fields." });
                } */

        const inviter = await prisma.user.findUnique({ where: { id: decoded.id }, select: { name: true, username: true, id: true } });

        if (!inviter) {
            console.log("Error fetching user data.");
            return respondWithError(res, 500, "Error fetching user data.");
        }

        // Resto de la lógica después de una carga exitosa

        const usersToInvite: string[] = participants;
        const users = await prisma.user.findMany({
            where: {
                username: {
                    in: usersToInvite
                }
            },
            select: {
                id: true,
                username: true,
                expoPushToken: true // asumimos que usarás Expo para notificaciones push
            }
        });
        const party = await prisma.party.create({
            data: {
                name,
                description,
                location,
                type,
                tags,
                advertisement: false,
                active: true,
                date: new Date(date),
                private: req.body.private || false,
                ownerId: decoded.id,
                image,
                creatorUsername: inviter.username,
                showAddressInFeed
                // Aquí puedes agregar más campos como el ID del creador
            },
        });

        if (!party) {
            console.log("Error creating party.");
            return respondWithError(res, 500, "Error creating party.");
        }

        for (const user of users) {

            if (user.id === decoded.id) continue;
            const response = await prisma.partyInvitation.create({
                data: {
                    partyId: party.id,
                    invitedUserId: user.id,
                    invitingUserId: decoded.id
                }
            });
            if (response) {
                sendPartyInviteNotification(user.expoPushToken, inviter, party.name, party.id, party.type);
            }

            // Aquí podrías enviar una notificación push a cada usuario invitado
        }

        res.status(200).json({ party });

    } catch (error) {
        console.error('Error al crear la fiesta:', error);
        res.status(500).json({ error: 'No se pudo crear la fiesta' });
    }
});

router.post('/upload-party-image', authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    try {
        const imageBase64 = req.body.image;

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
                const imageUrl = await getCachedImageUrl(result.key);

                if (imageUrl === "") {
                    console.log("Error uploading image.2");
                    return res.status(500).json({ error: "Error uploading image." });
                }

                res.status(200).json({ url: imageUrl, amazonId: result.key });

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

    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'No se pudo crear la fiesta' });
    }
});

router.get("/:partyId", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    const { partyId } = req.params;

    prisma.party.findUnique({
        where: { id: partyId },
        include: {
            owner: true,
        }
    }).then(async party => {
        if (!party) {
            return res.status(404).json({ error: "Party not found." });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                location: true,
            }
        });

        if (!currentUser) {
            return respondWithError(res, 500, "Error fetching user data.");
        }


        const distance = haversineDistance(currentUser.location, party.location);

        // Renovar URLs de las imágenes
        if (party.image.amazonId) {
            party.image.url = await getCachedImageUrl(party.image.amazonId);
        }

        return res.status(200).json({ ...party, distance });
    })
        .catch(error => {
            logger.error(error);
            return respondWithError(res, 500, "Error fetching user data.");
        });


});
router.post('/:partyId/leave', authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const partyId = req.params.partyId;
        const decoded = req.decoded;

        if (typeof decoded !== "object" || !("id" in decoded)) {
            return respondWithError(res, 500, "Error al decodificar el token.");
        }

        // Check if the group exists
        const party = await prisma.party.findUnique({
            where: { id: partyId }
        });

        if (!party) {
            return respondWithError(res, 404, "Group not found.");
        }

        // If the user is the owner of the group
        if (party.ownerId === decoded.id) {
            // Delete all group invitations related to this group
            await prisma.partyInvitation.deleteMany({
                where: { partyId }
            });

            // Delete all group members
            await prisma.partyMember.deleteMany({
                where: { partyId }
            });

            // Delete the group itself
            await prisma.party.delete({
                where: { id: partyId }
            });

            try {
                await Storage.remove(party.image.amazonId, { level: "public" });
            } catch (error) {
                Amplify.Auth.currentAuthenticatedUser();
                logger.error("Error al eliminar la imagen de S3:", error);
                return respondWithError(res, 500, "Error al eliminar la imagen de S3.");
            }

            res.status(200).json({ message: "Party deleted as you are the owner." });
        } else {
            // If the user is not the owner but a member of the group
            const isMember = await prisma.partyMember.findFirst({
                where: {
                    partyId,
                    userId: decoded.id
                }
            });

            if (!isMember) {
                return respondWithError(res, 403, "You are not a member of this group.");
            }

            // Delete all group invitations from and to the user related to this group
            await prisma.partyInvitation.deleteMany({
                where: {
                    partyId,
                    OR: [
                        { invitedUserId: decoded.id },
                        { invitingUserId: decoded.id }
                    ]
                }
            });

            // Remove the user from the group
            await prisma.partyMember.delete({
                where: {
                    userId_partyId: {
                        partyId,
                        userId: decoded.id
                    }
                }
            });

            res.status(200).json({ message: "User left party." });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to leave the party." });
    }
});


export default router;
