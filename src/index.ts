import { PrismaClient } from "@prisma/client";
import { Amplify } from "aws-amplify";
import express from "express";
import jwt from "jsonwebtoken";
import authRoute from "./routes/authRoute";
import usersRoute from "./routes/usersRoute";
import { extractToken } from "./utils/Utils";
import awsconfig from "./aws-exports";
import feedRoute from "./routes/feedRoute";
import Expo from "expo-server-sdk";
import winston from "winston";

Amplify.configure(awsconfig);

const { JWT_SECRET, JWT_REFRESH_SECRET, EXPO_ACCESS_TOKEN } = process.env;

if (JWT_SECRET === undefined) {
    throw new Error("No JWT_SECRET env variable found.");
}

if (JWT_REFRESH_SECRET === undefined) {
    throw new Error("No JWT_REFRESH_SECRET env variable found.");
}

if (EXPO_ACCESS_TOKEN === undefined) {
    throw new Error("No EXPO_ACCESS_TOKEN env variable found.");
}

// Configuración de winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.simple()
        ),
    }));
}

export const prisma = new PrismaClient();

export const expo = new Expo({ accessToken: EXPO_ACCESS_TOKEN });

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use("/auth", authRoute);
app.use("/user", usersRoute);
app.use("/feed", feedRoute);


app.post("/test-token", async (req, res) => {
    const bearerToken = req.headers["authorization"];

    if (!bearerToken) {
        return res.status(403).json({ error: "No token provided." });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "object" && "id" in decoded) {
            return res.json({ message: "Access token is valid." });
        } else {
            return res.status(500).json({ error: "Invalid access token." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to authenticate token." });
    }
});

app.post("/test-refresh-token", async (req, res) => {
    const bearerToken = req.headers["authorization"];

    if (!bearerToken) {
        return res.status(403).json({ error: "No token provided." });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

        if (typeof decoded === "object" && "id" in decoded) {
            return res.json({ message: "Access token is valid." });
        } else {
            return res.status(500).json({ error: "Invalid access token." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to authenticate token." });
    }
});

app.get("/test-users", async (req, res) => {
    const users = await prisma.user.findMany();
    return res.json(users);
});


app.listen(80, () => {
    logger.info(`Server ready at: http://localhost`);
});