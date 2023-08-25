import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Amplify, Storage } from "aws-amplify";
import { randomUUID } from "crypto";
import express, { Response } from "express";
import fileUpload from "express-fileupload";
import { configureAmazonCognito, logger, prisma } from "..";
import { AuthenticatedRequest } from "../../types";
import { sendNewFollowerNotification } from "../utils/NotificationsUtils";
import { authenticateTokenMiddleware, respondWithError } from "../utils/Utils";

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error("No se encontró la variable de entorno JWT_SECRET.");
}
if (!JWT_REFRESH_SECRET) {
    throw new Error("No se encontró la variable de entorno JWT_REFRESH_SECRET.");
}

const router = express.Router();

router.use(fileUpload());

const imageCache = new Map<string, { url: string; expiry: number; }>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 día en milisegundos

export async function getFreshImageUrl(amazonId: string, retry: boolean = true): Promise<string> {
    try {
        const imageUrl = await Storage.get(amazonId, {
            level: "public",
            expires: 604800
        });
        return imageUrl as string;
    } catch (error) {
        logger.error("Error al obtener la imagen fresca", error);
        if (retry) {
            logger.info("Reconfigurando Amplify y reintentando...");
            configureAmazonCognito();
            return getFreshImageUrl(amazonId, false);
        }
        return "";
    }
}


export async function getCachedImageUrl(amazonId: string): Promise<string> {
    // Comprobar si la URL ya está en el caché y aún es válida
    const cached = imageCache.get(amazonId);
    if (cached && cached.expiry > Date.now()) {
        return cached.url;
    }

    // Si no está en el caché o ha expirado, obtener una nueva URL
    const newUrl = await getFreshImageUrl(amazonId);

    if (newUrl === "") {
        return "";
    }

    // Almacenar la nueva URL en el caché con una fecha de caducidad
    imageCache.set(amazonId, {
        url: newUrl,
        expiry: Date.now() + CACHE_DURATION
    });

    return newUrl;
}

// check in db if the username provided exists or not also check its token

router.get("/check-username", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }
    const { username } = req.headers;

    if (!username || typeof username !== "string") {
        return respondWithError(res, 400, "No se proporcionó un nombre de usuario.");
    }

    prisma.user
        .findUnique({
            where: { username },
            select: {
                id: true,
                username: true
            }
        })
        .then(user => {
            if (!user) {
                return res.status(200).json(false);
            }
            return res.status(200).json(true);
        })
        .catch(() => {
            return respondWithError(res, 500, "Error al consultar el nombre de usuario.");
        });
});

router.post("/update", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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
        locationName,
        locationLatitude,
        locationLongitude,
        locationTimestamp,
        isCompany,
        expoPushToken

    } = req.body;

    if (!username || !name || !gender || !lastName) {
        return res.status(400).json({ error: "Missing required fields." });
    }
    if (!Array.isArray(musicInterest)) {
        return res.status(400).json({ error: "musicInterest should be a string." });
    }
    if (!Array.isArray(deportsInterest)) {
        return res.status(400).json({ error: "deportsInterest should be a string." });
    }
    if (!Array.isArray(artAndCultureInterest)) {
        return res.status(400).json({ error: "artAndCultureInterest should be a string." });
    }
    if (!Array.isArray(techInterest)) {
        return res.status(400).json({ error: "techInterest should be a string." });
    }
    if (!Array.isArray(hobbiesInterest)) {
        return res.status(400).json({ error: "hobbiesInterest should be a string." });
    }

    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    prisma.user
        .update({
            where: { id: decoded.id },
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
                locationName,
                locationLatitude,
                locationLongitude,
                locationTimestamp,
                isCompany,
                expoPushToken: expoPushToken ?? "",
            },
            include: {
                profilePictures: true,
                followerUserList: true,
                followingUserList: true,
                partiesParticipating: {
                    select: {
                        partyId: true,
                    }
                },
                partiesModerating: {
                    select: {
                        partyId: true,
                    }
                },
                groups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitedGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitingGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
            },
        })
        .then(() => {
            return res.status(200).json({ message: "Usuario actualizado con éxito." });
        })
        .catch(error => {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
                return respondWithError(res, 400, "El nombre de usuario ya está en uso.");
            } else {
                logger.error(error);
                return respondWithError(res, 500, "Error al actualizar el usuario.");
            }
        });
});

router.get("/:id", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }
    if (decoded.id !== req.params.id) {
        logger.info("Token does not match user ID.");
        return respondWithError(res, 403, "Access Denied: Token does not match user ID.");
    }

    prisma.user
        .findUnique({
            where: { id: decoded.id },
            include: {
                profilePictures: true,
                followerUserList: true,
                followingUserList: true,
                partiesParticipating: {
                    select: {
                        partyId: true,
                    }
                },
                partiesModerating: {
                    select: {
                        partyId: true,
                    }
                },
                groups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitedGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitingGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
            },
        })
        .then(async user => {
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            // Renovar URLs de las imágenes
            for (const pic of user.profilePictures) {
                if (!pic || !pic.amazonId) continue;
                pic.url = await getCachedImageUrl(pic.amazonId);
            }

            return res.status(200).json(user);
        })
        .catch(error => {
            logger.error(error);
            return respondWithError(res, 500, "Error fetching user data.");
        });
});

router.get("/basic-user-info/:username", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    const { username } = req.params;

    prisma.user
        .findUnique({
            where: { username: username },
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
                locationName: true,
                createdAt: true,
                lastLogin: true,
                isCompany: true,
                followingUserList: true,
                followerUserList: true,
                ownedParties: true,
                partiesParticipating: {
                    select: {
                        partyId: true,
                    }
                },
                partiesModerating: {
                    select: {
                        partyId: true,
                    }
                },
                groups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitedGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitingGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
            }
        })
        .then(async user => {
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            // Renovar URLs de las imágenes
            for (const pic of user.profilePictures) {
                if (!pic || !pic.amazonId) continue;
                pic.url = await getCachedImageUrl(pic.amazonId);
            }

            return res.status(200).json(user);
        })
        .catch(error => {
            logger.error(error);
            return respondWithError(res, 500, "Error fetching user data.");
        });
});

router.post("/upload-profile-picture", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    const imageBase64 = req.body.image;

    if (!imageBase64) {
        return respondWithError(res, 400, "No image provided.");
    }

    const imageBuffer = Buffer.from(imageBase64.split(",")[1], "base64");
    const fileType = imageBase64.match(/data:image\/(.*?);base64/)?.[1]; // obtiene el tipo de imagen (png, jpeg, etc.)


    const uploadImageToS3 = async (retry = true) => {
        try {
            const result = await Storage.put(`${randomUUID()}-${Date.now()}.` + fileType, imageBuffer, {
                contentType: "image/" + fileType,
                level: "public",
            });

            // Resto de la lógica después de una carga exitosa
            const imageUrl = await getCachedImageUrl(result.key);

            if (imageUrl === "") {
                return res.status(500).json({ error: "Error uploading image." });
            }

            prisma.profilePicture
                .create({
                    data: {
                        url: imageUrl,
                        user: {
                            connect: {
                                id: decoded.id,
                            },
                        },
                        amazonId: result.key,
                    },
                })
                .catch(error => {
                    logger.error("Error al agregar la imagen al usuario", error);
                    return respondWithError(res, 500, "Error updating user.");
                })
                .then(async profilePicture => {
                    if (
                        "id" in profilePicture &&
                        "url" in profilePicture &&
                        "amazonId" in profilePicture &&
                        "userId" in profilePicture
                    ) {
                        const user = await prisma.user.findUnique({
                            where: { id: decoded.id },
                            select: {
                                profilePictures: true,
                            },
                        }).catch(error => {
                            logger.error("Error al obtener las imágenes del usuario", error);
                            return respondWithError(res, 500, "Error updating user.");
                        }).then(user => user);


                        if (user && "profilePictures" in user && user.profilePictures) {
                            const profilePictures = [...user.profilePictures];

                            profilePictures.push(profilePicture);
                            prisma.user
                                .update({
                                    where: { id: decoded.id },
                                    data: {
                                        profilePictures: {
                                            set: profilePictures,
                                        },
                                    },
                                    include: {
                                        profilePictures: true,
                                    },
                                })
                                .catch(error => {
                                    logger.error("Error al agregar la imagen al usuario", error);
                                    return respondWithError(res, 500, "Error updating user.");
                                })
                                .then(async updatedUser => {
                                    if ("id" in updatedUser) {
                                        return res.status(200).json({ profilePicture });
                                    } else {
                                        logger.error("Error al obtener las imágenes del usuario 2");
                                        return respondWithError(res, 500, "Error updating user.");
                                    }
                                });
                        } else {
                            logger.error("Error al obtener las imágenes del usuario 2");
                            return respondWithError(res, 500, "Error updating user.");
                        }
                    } else {
                        logger.error("Profile picture is not in the expected format:", profilePicture);
                        return respondWithError(res, 500, "Unexpected data format.");
                    }
                });

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
});

router.delete("/delete-profile-picture", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }
    const amazonId = typeof req.query.amazonId === "string" ? req.query.amazonId : undefined;
    const id = typeof req.query.id === "string" ? req.query.id : undefined;

    if (!amazonId) {
        return respondWithError(res, 400, "No se proporcionó amazonId.");
    }

    if (!id) {
        return respondWithError(res, 400, "No se proporcionó id.");
    }

    try {
        await Storage.remove(amazonId, { level: "public" });
    } catch (error) {
        Amplify.Auth.currentAuthenticatedUser();
        logger.error("Error al eliminar la imagen de S3:", error);
        return respondWithError(res, 500, "Error al eliminar la imagen de S3.");
    }

    try {
        await prisma.profilePicture.delete({
            where: {
                id,
            },
        });

        const updatedUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                profilePictures: true,
                followerUserList: true,
                followingUserList: true,
                partiesParticipating: {
                    select: {
                        partyId: true,
                    }
                },
                partiesModerating: {
                    select: {
                        partyId: true,
                    }
                },
                groups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitedGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
                invitingGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true,
                            }
                        }
                    }
                },
            },
        });

        return res.status(200).json({ message: "Imagen eliminada con éxito", user: updatedUser });
    } catch (error) {
        logger.error("Error al eliminar la imagen de la base de datos:", error);
        return respondWithError(res, 500, "Error al eliminar la imagen de la base de datos.");
    }
});
/* 
router.get("/get-image-url/:amazonId", async (req, res) => {
    const amazonId = typeof req.params.amazonId === "string" ? req.params.amazonId : undefined;

    if (!amazonId) {
        return respondWithError(res, 400, "No se proporcionó amazonId.");
    }

    Storage.get(amazonId)
        .then(imageUrl => {
            // Realizar una solicitud al imageUrl para obtener la imagen
            return axios.get(imageUrl, { responseType: 'arraybuffer' });
        })
        .then(response => {
            // Establecer el tipo de contenido en la respuesta y enviar la imagen
            const contentType = response.headers['content-type'];
            res.setHeader('Content-Type', contentType);
            return res.status(200).send(response.data);
        })
        .catch(error => {
            Amplify.Auth.currentAuthenticatedUser();
            logger.error("Error al obtener la imagen", error);
            return respondWithError(res, 500, "Error obteniendo imagen.");
        });
}); */

router.post("/follow/:username", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }
    const followedUsername = req.params.username;

    const followerUserId = decoded.id; // usuario que sigue

    const followedUser = await prisma.user.findUnique({
        where: { username: followedUsername },
        select: {
            id: true,
            expoPushToken: true,
        }
    });

    if (!followedUser) {
        return res.status(404).json({ error: "User not found." });
    }
    const followedUserId = followedUser.id; // usuario que es seguido
    const expoPushToken = followedUser.expoPushToken;

    const existingRelation = await prisma.userFollows.findUnique({
        where: {
            followerUserId_followedUserId: {
                followerUserId,
                followedUserId
            }
        }
    });

    if (existingRelation) {
        return res.status(400).json({ error: "You are already following this user." });
    }

    try {
        await prisma.userFollows.create({
            data: {
                followerUserId,
                followedUserId,
                followerUsername: followedUsername,
                followDate: new Date(),
            },
        });

        sendNewFollowerNotification(expoPushToken, followerUserId);

        res.status(200).json({ message: "Now following." });
    } catch (error) {
        logger.error(error);
        return respondWithError(res, 500, "Error while trying to follow.");
    }
});

router.delete("/unfollow/:username", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }
    const unfollowedUsername = req.params.username;

    const followerUserId = decoded.id;

    const unfollowedUser = await prisma.user.findUnique({
        where: { username: unfollowedUsername }
    });
    if (!unfollowedUser) {
        return res.status(404).json({ error: "User not found." });
    }

    const followedUserId = unfollowedUser.id;

    const existingRelation = await prisma.userFollows.findUnique({
        where: {
            followerUserId_followedUserId: {
                followerUserId,
                followedUserId
            }
        }
    });


    if (!existingRelation) {
        return res.status(400).json({ error: "You are not following this user." });
    }

    try {
        await prisma.userFollows.delete({
            where: {
                followerUserId_followedUserId: {
                    followerUserId,
                    followedUserId
                }
            }
        });
        res.status(200).json({ message: "Unfollowed successfully." });
    } catch (error) {
        logger.error(error);
        return respondWithError(res, 500, "Error while trying to unfollow.");
    }
});


export default router;
