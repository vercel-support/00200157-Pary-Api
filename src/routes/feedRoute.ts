import express, { Request, Response } from "express";
import { prisma } from "..";
import { authenticateTokenMiddleware, generatePartiesForUsers, respondWithError } from "../utils/Utils";
import { AuthenticatedRequest } from "../../types";

const router = express.Router();

router.get("/generate-parties", authenticateTokenMiddleware, async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                signedIn: true
            },
            select: {
                username: true
            }
        });
        const parties = await generatePartiesForUsers(users);
        return res.status(200).json(parties);
    } catch (error) {
        console.error(error);
        return respondWithError(res, 500, "Error generando fiestas.");
    }
});

router.get("/search", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const query = req.query.q;

    if (!query) {
        return respondWithError(res, 400, "No se ha proporcionado una consulta.");
    }

    if (typeof query !== "string") {
        return respondWithError(res, 400, "La consulta debe ser de tipo string.");
    }

    const users = await prisma.user.findMany({
        where: { username: { contains: query } },
        orderBy: [
            { isCompany: 'desc' },
            { verified: 'desc' }
        ]
    });

    const parties = await prisma.party.findMany({
        where: { name: { contains: query } },
        orderBy: { advertisement: 'desc' }
    });

    res.status(200).json({ users, parties });
});


export default router;