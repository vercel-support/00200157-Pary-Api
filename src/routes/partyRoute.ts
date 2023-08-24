import express, { Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "..";
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
            console.error(error);
            return respondWithError(res, 500, "Error fetching user data.");
        });


});

export default router;
