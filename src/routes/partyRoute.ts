import express, { Response } from "express";
import jwt from "jsonwebtoken";
import { logger, prisma } from "..";
import { AuthenticatedRequest, GoogleUser } from "../../types";
import { authenticateRefreshTokenMiddleware, authenticateTokenMiddleware, extractToken, haversineDistance, respondWithError } from "../utils/Utils";
import { getCoordinatesFromComuna } from "./feedRoute";

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
                locationLatitude: true,
                locationLongitude: true,

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
                        participants: {
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
                        participants: {
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

        const partiesToReturn = parties.map(party => {
            const location = getCoordinatesFromComuna(party.location);
            if (!location) return null;

            const distance = haversineDistance(currentUser.locationLatitude, currentUser.locationLongitude, location.lat, location.lon);


            return { ...party, distance };
        });

        const hasNextPage = (page * limit) < totalParties;
        const nextPage = hasNextPage ? page + 1 : null;

        logger.info("Parties:", partiesToReturn, "Has next page:", hasNextPage, "Next page:", nextPage);
        res.status(200).json({ parties: partiesToReturn, hasNextPage, nextPage });

    } catch (error) {
        logger.error("Error fetching parties:", error);
        return respondWithError(res, 500, "Error al buscar las fiestas.");
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
                locationLatitude: true,
                locationLongitude: true,

            }
        });

        if (!currentUser) {
            return respondWithError(res, 500, "Error fetching user data.");
        }

        const location = getCoordinatesFromComuna(party.location);
        if (!location) return null;

        const distance = haversineDistance(currentUser.locationLatitude, currentUser.locationLongitude, location.lat, location.lon);

        // Renovar URLs de las imágenes
        /* if (!party.image || !party.image.amazonId) {
            pic.url = await getCachedImageUrl(pic.amazonId);
        } */

        return res.status(200).json({ ...party, distance });
    })
        .catch(error => {
            logger.error(error);
            return respondWithError(res, 500, "Error fetching user data.");
        });


});


export default router;
