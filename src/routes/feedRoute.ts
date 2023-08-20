import express, { Request, Response } from "express";
import { prisma } from "..";
import { AuthenticatedRequest } from "../../types";
import comunasData from "../assets/comunas.json";
import { authenticateTokenMiddleware, createPartiesForUsers, generatePartiesForUsers, haversineDistance, respondWithError } from "../utils/Utils";
import { getCachedImageUrl } from "./usersRoute";


const router = express.Router();
const MAX_DISTANCE = 120; // En kilómetros

interface Location {
    comuna: string;
    provincia: string;
    region: string;
    lat: number;
    lon: number;
}

function getCoordinatesFromComuna(comuna: string) {
    const found = comunasData.find(item => item.comuna.toLowerCase() === comuna.toLowerCase());
    if (found) {
        return { lat: found.lat, lon: found.lon };
    } else {
        console.error("Comuna not found in local database:", comuna);
        return null;
    }
}

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    if (!query) {
        return respondWithError(res, 400, "No se ha proporcionado una consulta.");
    }

    if (typeof query !== "string") {
        return respondWithError(res, 400, "La consulta debe ser de tipo string.");
    }

    const users = await prisma.user.findMany({
        skip: skip,
        take: limit,
        where: {
            OR: [
                { username: { contains: query, mode: "insensitive" } },
                { name: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { locationName: { contains: query, mode: "insensitive" } },
                { techInterest: { has: query } },
                { musicInterest: { has: query } },
                { deportsInterest: { has: query } },
                { hobbiesInterest: { has: query } },
                { artAndCultureInterest: { has: query } }
            ]
        },
        orderBy: [
            { isCompany: 'desc' },
            { verified: 'desc' },
            { username: 'desc' }
        ],
        select: {
            username: true,
            name: true,
            lastName: true,
            profilePictures: { take: 1 },
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
        }
    });

    users.forEach(async (user) => {
        const pic = user.profilePictures[0];
        pic.url = await getCachedImageUrl(pic.amazonId);
        user.profilePictures[0] = pic;
    });

    const parties = await prisma.party.findMany({
        skip: skip,
        take: limit,
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { creatorUsername: { contains: query, mode: "insensitive" } },
                { location: { contains: query, mode: "insensitive" } },
                { tags: { has: query } }
            ]
        },
        orderBy: { advertisement: 'desc' }
    });

    res.status(200).json({ users, parties });
});

router.get("/create-parties", authenticateTokenMiddleware, async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                signedIn: true
            },
            select: {
                username: true
            }
        });
        const parties = await createPartiesForUsers(users);
        return res.status(200).json(parties);
    } catch (error) {
        console.error(error);
        return respondWithError(res, 500, "Error generando y guardando fiestas.");
    }
});

router.get("/personalized-parties", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;

    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // 1. Obtener la ubicación del usuario actual
    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            locationName: true,
            locationLatitude: true,
            locationLongitude: true,
            musicInterest: true,
            deportsInterest: true,
            artAndCultureInterest: true,
            techInterest: true,
            hobbiesInterest: true
        }
    });

    if (!currentUser) {
        return respondWithError(res, 404, "Usuario no encontrado.");
    }

    // 2. Filtrar las fiestas basadas en la proximidad
    const allParties = await prisma.party.findMany();
    const closeParties = allParties.filter(party => {
        const location = getCoordinatesFromComuna(party.location);
        if (!location) {
            return false;
        }
        const distance = haversineDistance(currentUser.locationLatitude, currentUser.locationLongitude, location?.lat, location.lon);
        return distance <= MAX_DISTANCE;
    });

    // 3. Dar preferencia a las fiestas que coincidan con los intereses del usuario
    const interestParties = closeParties.filter(party => {
        const commonTags = party.tags.filter(tag => currentUser.musicInterest.includes(tag) ||
            currentUser.deportsInterest.includes(tag) ||
            currentUser.artAndCultureInterest.includes(tag) ||
            currentUser.techInterest.includes(tag) ||
            currentUser.hobbiesInterest.includes(tag));
        return commonTags.length > 0;
    });

    // 4. Si no hay fiestas que coincidan con los intereses, devuelve las fiestas cercanas
    const finalParties = interestParties.length > 0 ? interestParties : closeParties;

    // 5. Paginar los resultados
    const paginatedParties = finalParties.slice(skip, skip + limit);

    res.status(200).json({ parties: paginatedParties });
});


export default router;