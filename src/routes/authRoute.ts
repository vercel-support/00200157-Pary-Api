import express, { Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "..";
import { AuthenticatedRequest, GoogleUser, User } from "../../types";
import { authenticateRefreshTokenMiddleware, authenticateTokenMiddleware, extractToken } from "../utils/Utils";
import { getCachedImageUrl } from "./usersRoute";

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (JWT_SECRET === undefined) {
    throw new Error("No JWT_SECRET env variable found.");
}

if (JWT_REFRESH_SECRET === undefined) {
    throw new Error("No JWT_REFRESH_SECRET env variable found.");
}

const router = express.Router();

router.post("/signIn", async (req, res) => {
    if (req.body.googleUser === undefined) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const googleUser = req.body.googleUser as GoogleUser;

    let user = await prisma.user.findUnique({
        where: {
            assignedGoogleID: googleUser.user.id,
        },
        select: {
            id: true
        }
    }) as User;

    if (!user) {
        const generatedUsername = `${googleUser.user.givenName ?? ""}${googleUser.user.familyName ?? ""}${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;
        user = await prisma.user.create({
            data: {
                username: generatedUsername,
                name: googleUser.user.givenName ?? "",
                email: googleUser.user.email,
                lastName: googleUser.user.familyName ?? "",
                assignedGoogleID: googleUser.user.id,
                lastLogin: new Date(),
                createdAt: new Date(),
                birthDate: new Date(),
                location: {
                    name: "",
                    latitude: 0,
                    longitude: 0,
                    timestamp: new Date(),
                    address: "",
                }

            },
            include: {
                profilePictures: true,
                followerUserList: true,
                followingUserList: true,
                ownedParties: {
                    select: {
                        id: true,
                    }
                },
                parties: {
                    select: {
                        partyId: true,
                    }
                },
                invitedParties: {
                    select: {
                        partyId: true,
                        party: {
                            select: {
                                name: true,
                                description: true,
                                owner: {
                                    select: {
                                        username: true,
                                    }
                                },
                            }
                        }
                    }
                },
                invitingParties: {
                    select: {
                        partyId: true,
                        party: {
                            select: {
                                name: true,
                                description: true,
                                owner: {
                                    select: {
                                        username: true,
                                    }
                                },
                            }
                        }
                    }
                },
                partiesModerating: {
                    select: {
                        partyId: true,
                    }
                },
                groupsModerating: {
                    select: {
                        groupId: true,
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
    }

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "4weeks" });

    user = await prisma.user.update({
        where: { id: user.id },
        data: {
            accessToken,
            refreshToken,
            lastLogin: new Date(),
        },
        include: {
            profilePictures: true,
            followerUserList: true,
            followingUserList: true,
            parties: {
                select: {
                    partyId: true,
                }
            },
            invitedParties: {
                select: {
                    partyId: true,
                    party: {
                        select: {
                            name: true,
                            description: true,
                            owner: {
                                select: {
                                    username: true,
                                }
                            },
                        }
                    }
                }
            },
            invitingParties: {
                select: {
                    partyId: true,
                    party: {
                        select: {
                            name: true,
                            description: true,
                            owner: {
                                select: {
                                    username: true,
                                }
                            },
                        }
                    }
                }
            },
            ownedParties: {
                select: {
                    id: true,
                }
            },
            partiesModerating: {
                select: {
                    partyId: true,
                }
            },
            groupsModerating: {
                select: {
                    groupId: true,
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

    for (const pic of user.profilePictures) {
        if (!pic || !pic.amazonId) continue;
        pic.url = await getCachedImageUrl(pic.amazonId);
    }

    return res.status(200).json({
        user
    });
});

router.post("/refresh-token", authenticateRefreshTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const decoded = req.decoded;

    try {

        if (typeof decoded === "object" && "id" in decoded) {
            const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "1d" });
            const refreshToken = jwt.sign({ id: decoded.id }, JWT_REFRESH_SECRET, { expiresIn: "4weeks" });
            const user = await prisma.user.update({
                where: { id: decoded.id },
                data: {
                    accessToken,
                    refreshToken,
                },
                include: {
                    profilePictures: true,
                    followerUserList: true,
                    followingUserList: true,
                    parties: {
                        select: {
                            partyId: true,
                        }
                    },
                    invitedParties: {
                        select: {
                            partyId: true,
                            party: {
                                select: {
                                    name: true,
                                    description: true,
                                    owner: {
                                        select: {
                                            username: true,
                                        }
                                    },
                                }
                            }
                        }
                    },
                    invitingParties: {
                        select: {
                            partyId: true,
                            party: {
                                select: {
                                    name: true,
                                    description: true,
                                    owner: {
                                        select: {
                                            username: true,
                                        }
                                    },
                                }
                            }
                        }
                    },
                    ownedParties: {
                        select: {
                            id: true,
                        }
                    },
                    partiesModerating: {
                        select: {
                            partyId: true,
                        }
                    },
                    groupsModerating: {
                        select: {
                            groupId: true,
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
            // Renovar URLs de las imágenes
            for (const pic of user.profilePictures) {
                if (!pic || !pic.amazonId) continue;
                pic.url = await getCachedImageUrl(pic.amazonId);
            }

            return res.json({ user });
        } else {
            return res.status(500).json({ error: "Invalid refresh token." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to authenticate token." });
    }
});

router.post("/logout", authenticateTokenMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const bearerToken = req.headers["authorization"];

    if (!bearerToken) {
        return res.status(403).json({ error: "No token provided." });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "object" && "id" in decoded) {
            await prisma.user.update({
                where: { id: decoded.id },
                data: {
                    accessToken: "",
                    refreshToken: "",
                    expoPushToken: "",
                },
            });

            return res.json({ message: "Logged out successfully." });
        } else {
            return res.status(500).json({ error: "Invalid access token." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to authenticate token." });
    }
});

export default router;
