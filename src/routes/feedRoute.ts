import express, { Request, Response } from "express";
import { prisma } from "..";
import { AuthenticatedRequest, FetchedParty, Party } from "../../types";
import comunasData from "../assets/comunas.json";
import { authenticateTokenMiddleware, createPartiesForUsers, generatePartiesForUsers, haversineDistance, respondWithError } from "../utils/Utils";
import { getCachedImageUrl } from "./usersRoute";


const router = express.Router();
const MAX_DISTANCE = 999999; // En kilómetros

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
                username: true,
                id: true
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
    const distanceLimit = Number(req.query.distanceLimit) || MAX_DISTANCE;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            username: true,
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

    const currentDateTime = new Date();
    const totalParties = await prisma.party.count({
        where: {
            date: {
                gte: currentDateTime // Solo considerar fiestas que no hayan expirado
            },
            active: true,
            OR: [
                {
                    private: true,
                    creatorUsername: currentUser.username // El usuario es el creador
                },
                {
                    private: true,
                    moderators: {
                        some: {
                            userId: decoded.id // El usuario es un moderador
                        }
                    }
                },
                {
                    private: true,
                    participants: {
                        some: {
                            userId: decoded.id // El usuario es un participante
                        }
                    }
                },
                { tags: { hasSome: currentUser.musicInterest } },
                { tags: { hasSome: currentUser.deportsInterest } },
                { tags: { hasSome: currentUser.artAndCultureInterest } },
                { tags: { hasSome: currentUser.techInterest } },
                { tags: { hasSome: currentUser.hobbiesInterest } },
            ],
        },
        orderBy: { date: 'asc' },

    });

    let filteredParties: any[] = [];
    let fetchedPartyIds = new Set<string>();
    let step = page;  // To keep track of the number of attempts
    let reachedMaxItemsInDB = false;
    const maxSteps = Math.ceil(totalParties / limit) + 1;
    const timeoutReached = new Promise((_, reject) => setTimeout(() => {
        reachedMaxItemsInDB = true;
        return reject(new Error("Timeout exceeded"));
    }, 5000));
    const fetchParties = async () => {
        while (filteredParties.length < limit && step <= maxSteps) {
            const parties = await prisma.party.findMany({
                skip: (step - 1) * limit,  // Correct calculation for skip
                take: limit,
                orderBy: { date: 'asc' },
                where: {
                    active: true,
                    date: {
                        gte: currentDateTime // Solo considerar fiestas que no hayan expirado
                    },
                    NOT: {
                        id: {
                            in: Array.from(fetchedPartyIds)  // Excluir parties ya recuperadas
                        }
                    },
                    OR: [
                        {
                            private: true,
                            creatorUsername: currentUser.username // El usuario es el creador
                        },
                        {
                            private: true,
                            moderators: {
                                some: {
                                    userId: decoded.id // El usuario es un moderador
                                }
                            }
                        },
                        {
                            private: true,
                            participants: {
                                some: {
                                    userId: decoded.id // El usuario es un participante
                                }
                            }
                        },
                        { tags: { hasSome: currentUser.musicInterest } },
                        { tags: { hasSome: currentUser.deportsInterest } },
                        { tags: { hasSome: currentUser.artAndCultureInterest } },
                        { tags: { hasSome: currentUser.techInterest } },
                        { tags: { hasSome: currentUser.hobbiesInterest } },
                    ],
                }
            });
            //console.log("\nFound parties:", parties.length, "Step:", step, "Skip:", (step - 1) * limit, "Limit:", limit, "Distance limit:", distanceLimit, "km");
            const currentFilteredParties = parties
                .map(party => {
                    const location = getCoordinatesFromComuna(party.location);
                    if (!location) {
                        return null;
                    }
                    const distance = haversineDistance(currentUser.locationLatitude, currentUser.locationLongitude, location.lat, location.lon);
                    return { ...party, distance };
                })
                .filter(party => party !== null && party.distance <= distanceLimit)
                .sort((a, b) => a!.distance - b!.distance);
            currentFilteredParties.forEach(party => {
                if (party !== null) fetchedPartyIds.add(party.id);
            });


            filteredParties = [...filteredParties, ...currentFilteredParties];

            if (parties.length < limit) {
                reachedMaxItemsInDB = true;
                console.log("Reached max items in DB", parties.length, limit, filteredParties.length);
                console.log();
                break;
            }

            step++;
        }
    };

    try {
        await Promise.race([fetchParties(), timeoutReached]);
    } catch (error) {
        if (error instanceof Error && error.message === "Timeout exceeded") {
            console.warn("La consulta excedió el tiempo máximo de espera. Retornando lo que tenemos.");
            // Aquí puedes decidir qué hacer, por ejemplo, retornar lo que tienes:
            res.status(200).json({ parties: filteredParties, step });
            return;
        }
        // Manejar otros errores
        console.error(error);
        return respondWithError(res, 500, "Error fetching parties.");
    }
    // Take only the required limit of parties
    filteredParties = filteredParties.slice(0, limit);
    //console.log("Found parties:", filteredParties.length, "Requested Page", page, "Step:", `${step}/${maxSteps}`, "Skip:", (step - 1) * limit, "Limit:", limit, "Distance limit:", distanceLimit, "km");

    res.status(200).json({ parties: filteredParties, step, reachedMaxItemsInDB });

});

router.get("/personalized-parties2", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;

    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    const page = Number(req.query.page) || 1;
    const distanceLimit = Number(req.query.distanceLimit) || MAX_DISTANCE;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            username: true,
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

    const currentDateTime = new Date();
    let fetchedPartyIds = new Set<string>();
    let filteredParties: any[] = [];
    let step = 1;

    const timeoutReached = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout exceeded")), 10000));
    const fetchPartiesClosestFirst = async () => {
        while (filteredParties.length < limit) {
            const parties = await prisma.party.findMany({
                skip: filteredParties.length > 0 ? skip : 0,
                take: limit,
                where: {
                    active: true,
                    date: {
                        gte: currentDateTime // Solo considerar fiestas que no hayan expirado
                    },
                    NOT: {
                        id: {
                            in: Array.from(fetchedPartyIds)  // Excluir parties ya recuperadas
                        }
                    },
                    OR: [
                        {
                            private: false // Fiestas públicas
                        },
                        {
                            private: true,
                            creatorUsername: currentUser.username // El usuario es el creador
                        },
                        {
                            private: true,
                            moderators: {
                                some: {
                                    userId: decoded.id // El usuario es un moderador
                                }
                            }
                        },
                        {
                            private: true,
                            participants: {
                                some: {
                                    userId: decoded.id // El usuario es un participante
                                }
                            }
                        },
                        { tags: { hasSome: currentUser.musicInterest } },
                        { tags: { hasSome: currentUser.deportsInterest } },
                        { tags: { hasSome: currentUser.artAndCultureInterest } },
                        { tags: { hasSome: currentUser.techInterest } },
                        { tags: { hasSome: currentUser.hobbiesInterest } },
                    ],

                }, orderBy: { date: 'asc' },
            });


            const currentFilteredParties = parties
                .map(party => {
                    const location = getCoordinatesFromComuna(party.location);
                    if (!location) {
                        return null;
                    }
                    const distance = haversineDistance(currentUser.locationLatitude, currentUser.locationLongitude, location.lat, location.lon);
                    return { ...party, distance };
                })
                .filter(party => party !== null && party.distance <= distanceLimit)
                .sort((a, b) => a!.distance - b!.distance);

            currentFilteredParties.forEach(party => {
                if (party !== null) fetchedPartyIds.add(party.id);
            });

            // Si no encontramos suficientes fiestas, aumentamos el rango de búsqueda
            if (currentFilteredParties.length < limit) {
                step++;
                continue;
            } else {
                break;
            }
        }
    };

    try {
        await Promise.race([fetchPartiesClosestFirst(), timeoutReached]);
    } catch (error) {
        if (error instanceof Error && error.message === "Timeout exceeded") {
            console.warn("La consulta excedió el tiempo máximo de espera. Retornando lo que tenemos.");
            // Aquí puedes decidir qué hacer, por ejemplo, retornar lo que tienes:
            res.status(200).json({ parties: filteredParties, step });
            return;
        }
        // Manejar otros errores
        console.error(error);
        return respondWithError(res, 500, "Error fetching parties.");
    }

    filteredParties = filteredParties.slice(0, limit);
    res.status(200).json({ parties: filteredParties, step });
});


export default router;