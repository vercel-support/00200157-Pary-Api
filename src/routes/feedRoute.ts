import express, { Request, Response } from "express";
import { logger, prisma } from "..";
import { AuthenticatedRequest, ProfilePicture } from "../../types";
import { authenticateTokenMiddleware, createPartiesForUsers, generatePartiesForUsers, haversineDistance, respondWithError } from "../utils/Utils";
import { getCachedImageUrl } from "./usersRoute";


const router = express.Router();
const MAX_DISTANCE = 999999; // En kilómetros

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
        logger.error(error);
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

    const decoded = req.decoded;

    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            location: true,
        }
    });

    if (!currentUser) {
        return respondWithError(res, 404, "Usuario no encontrado.");
    }

    const users = await prisma.user.findMany({
        skip: skip,
        take: limit,
        where: {
            signedIn: true,
            OR: [
                { username: { contains: query, mode: "insensitive" } },
                { name: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { techInterest: { has: query } },
                { musicInterest: { has: query } },
                { deportsInterest: { has: query } },
                { hobbiesInterest: { has: query } },
                { artAndCultureInterest: { has: query } },
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
            location: true,
            createdAt: true,
            lastLogin: true,
            isCompany: true,
        }
    });

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let pic = user.profilePictures[0];
        if (!pic || !pic.amazonId) continue;
        pic.url = await getCachedImageUrl(pic.amazonId);
        user.profilePictures[0] = pic;
    }

    const parties = await prisma.party.findMany({
        skip: skip,
        take: limit,
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                {
                    owner: {
                        username: { contains: query, mode: "insensitive" }
                    }
                },
                { tags: { has: query } }
            ]
        }, include: {
            owner: {
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: { take: 1 },
                    verified: true,
                    isCompany: true,
                    gender: true,
                }
            },
            members: {
                include: {
                    user: {
                        select: {
                            username: true,
                            name: true,
                            lastName: true,
                            profilePictures: { take: 1 },
                            verified: true,
                            isCompany: true,
                            gender: true,
                        }
                    }
                }
            },
        },
        orderBy: { advertisement: 'desc' }
    });

    const partiesToReturn = await Promise.all(parties.map(async party => {
        const distance = haversineDistance(currentUser.location, party.location);
        party.distance = distance;
        if (party.image.amazonId) {
            party.image.url = await getCachedImageUrl(party.image.amazonId);
        }
        let pic = party.owner.profilePictures[0];
        if (!pic || !pic.amazonId) return;
        pic.url = await getCachedImageUrl(pic.amazonId);
        party.owner.profilePictures[0] = pic;
        if (party?.members) {
            for (let i = 0; i < party.members.length; i++) {
                let pic = party.members[i].user.profilePictures[0];
                if (!pic || !pic.amazonId) continue;
                pic.url = await getCachedImageUrl(pic.amazonId);
                party.members[i].user.profilePictures[0] = pic;
            }
        }
        return party;
    }));

    res.status(200).json({ users, parties: partiesToReturn });
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
        logger.error(error);
        return respondWithError(res, 500, "Error generando y guardando fiestas.");
    }
});

router.get("/personalized-parties", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;

    if (typeof decoded !== "object" || !("id" in decoded)) {
        return respondWithError(res, 500, "Error al decodificar el token.");
    }

    let page = Number(req.query.page) || 1;
    const distanceLimit = Number(req.query.distanceLimit) || MAX_DISTANCE;
    const limit = Number(req.query.limit) || 15;
    const maxAge = Number(req.query.maxAge) || 100;
    const minAge = Number(req.query.minAge) || 0;
    const showGroups = req.query.showGroups === "true";

    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            username: true,
            location: true,
            musicInterest: true,
            deportsInterest: true,
            artAndCultureInterest: true,
            techInterest: true,
            hobbiesInterest: true,
            followingUserList: {
                select: {
                    followedUserId: true
                }
            }
        }
    });

    if (!currentUser) {
        return respondWithError(res, 404, "Usuario no encontrado.");
    }

    const followedUsers = currentUser.followingUserList.map(follow => follow.followedUserId);
    const currentDateTime = new Date();

    let queryFilters = {
        date: { gte: currentDateTime },
        active: true,
        private: false,
    };

    const totalParties = await prisma.party.count({ where: queryFilters });


    const foundedParties = [];
    while (foundedParties.length < limit && (page - 1) * limit < totalParties) {
        const parties = await prisma.party.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [
                { date: 'asc' },
            ],
            where: queryFilters,
            select: {
                id: true,
                location: true,
                name: true,
                description: true,
                image: true,
                tags: true,
                type: true,
                createdAt: true,
                date: true,
                active: true,
                ownerId: true,
                ageRange: true,
                owner: {
                    select: {
                        username: true,
                        name: true,
                        lastName: true,
                        profilePictures: { take: 1 },
                        verified: true,
                        isCompany: true,
                        gender: true,
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                                lastName: true,
                                profilePictures: { take: 1 },
                                verified: true,
                                isCompany: true,
                                gender: true,
                            }
                        }
                    }
                },
            },
        });

        interface ImageUrlCache {
            [key: string]: string;
        }

        interface ProfilePicture {
            amazonId: string;
            url?: string;
        }

        const getProfileImageUrl = async (pic: ProfilePicture) => {
            if (!pic || !pic.amazonId) return;
            const imageUrlCache: { [key: string]: string; } = {};
            if (!imageUrlCache[pic.amazonId]) {
                imageUrlCache[pic.amazonId] = await getCachedImageUrl(pic.amazonId);
            }
            pic.url = imageUrlCache[pic.amazonId];
        };

        const partiesToReturn = await Promise.all(parties.map(async (party) => {
            const distance = haversineDistance(currentUser.location, party.location);
            if (party.image.amazonId) {
                party.image.url = await getCachedImageUrl(party.image.amazonId); // This could also benefit from caching, but it's not shown here.
            }
            await getProfileImageUrl(party.owner.profilePictures[0]);
            if (party.members) {
                for (let member of party.members) {
                    await getProfileImageUrl(member.user.profilePictures[0]);
                }
            }

            let relevanceScore = 0;
            for (let tag of party.tags) {
                if (currentUser.musicInterest.includes(tag)) relevanceScore++;
                if (currentUser.deportsInterest.includes(tag)) relevanceScore++;
                if (currentUser.artAndCultureInterest.includes(tag)) relevanceScore++;
                if (currentUser.techInterest.includes(tag)) relevanceScore++;
                if (currentUser.hobbiesInterest.includes(tag)) relevanceScore++;
            }

            if (followedUsers.includes(party.ownerId!)) relevanceScore++;
            if (party.members.some(member => followedUsers.includes(member.userId))) relevanceScore++;

            return { ...party, distance, relevanceScore };
        }));

        foundedParties.push(...partiesToReturn.filter(party => {
            return party
                && party.distance <= distanceLimit
                && party.ageRange.min <= maxAge
                && party.ageRange.max >= minAge;
        }).sort((a, b) => b!.relevanceScore - a!.relevanceScore));

        page++;

    }

    res.status(200).json({ parties: foundedParties, step: page, reachedMaxItemsInDB: (page * limit >= totalParties) });
});


router.get("/followers/", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 10;
    const username = req.query.username as string;
    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: {
                followerUserList: true,
            }
        });
        if (user === null) {
            return res.status(404).json({ error: "User not found." });
        }
        const followers = user?.followerUserList.map(follower => follower.followerUserId);

        const followerUsers = await prisma.user.findMany({
            take: 10,
            skip,
            where: {
                id: {
                    in: followers
                }
            },
            select: {
                username: true,
                name: true,
                lastName: true,
                description: true,
                verified: true,
                isCompany: true,
                gender: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true,
                        amazonId: true
                    }
                },
            }
        });
        for (let i = 0; i < followerUsers.length; i++) {
            let user = followerUsers[i];
            let pic = user.profilePictures[0];
            if (!pic || !pic.amazonId) continue;
            pic.url = await getCachedImageUrl(pic.amazonId);
            user.profilePictures[0] = pic;
        }


        return res.json(followerUsers);
    } catch (error) {
        logger.error("Error fetching users:", error);
        return respondWithError(res, 500, "Error fetching users.");
    }
});

router.get("/following/", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 10;
    const username = req.query.username as string;

    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: {
                followingUserList: true,
            }
        });
        if (user === null) {
            return res.status(404).json({ error: "User not found." });
        }
        const followers = user?.followingUserList.map(follower => follower.followedUserId);

        const followerUsers = await prisma.user.findMany({
            take: 10,
            skip,
            where: {
                id: {
                    in: followers
                }
            },
            select: {
                username: true,
                name: true,
                lastName: true,
                description: true,
                verified: true,
                isCompany: true,
                gender: true,
                profilePictures: {
                    take: 1,
                    select: {
                        url: true,
                        amazonId: true
                    }
                },
            }
        });
        for (let i = 0; i < followerUsers.length; i++) {
            let user = followerUsers[i];
            let pic = user.profilePictures[0];
            if (!pic || !pic.amazonId) continue;
            pic.url = await getCachedImageUrl(pic.amazonId);
            user.profilePictures[0] = pic;
        }

        return res.json(followerUsers);
    } catch (error) {
        logger.error("Error fetching users:", error);
        return respondWithError(res, 500, "Error fetching users.");
    }
});



export default router;