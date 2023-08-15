import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "..";
import { GoogleUser } from "../../types";
import { extractToken } from "../utils/Utils";

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
        include: {
            profilePictures: true,
        },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                username: "",
                name: googleUser.user.givenName ?? "",
                email: googleUser.user.email,
                lastName: googleUser.user.familyName ?? "",
                assignedGoogleID: googleUser.user.id,
            },
            include: {
                profilePictures: true,
            },
        });
    }

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "1weeks" });

    user = await prisma.user.update({
        where: { id: user.id },
        data: {
            accessToken,
            refreshToken,
            lastLogin: new Date(),
        },
        include: {
            profilePictures: true,
        },
    });

    return res.status(200).json({
        user,
        accessToken,
        refreshToken,
    });
});

router.post("/refresh-token", async (req, res) => {
    const { refreshToken: token } = req.body;

    if (!token) {
        return res.status(403).json({ error: "No refresh token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

        if (typeof decoded === "object" && "id" in decoded) {
            const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "1d" });
            const refreshToken = jwt.sign({ id: decoded.id }, JWT_REFRESH_SECRET, { expiresIn: "1weeks" });
            await prisma.user.update({
                where: { id: decoded.id },
                data: {
                    accessToken,
                    refreshToken,
                },
            });

            return res.json({ accessToken, refreshToken });
        } else {
            return res.status(500).json({ error: "Invalid refresh token." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to refresh token." });
    }
});

router.post("/logout", async (req, res) => {
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
