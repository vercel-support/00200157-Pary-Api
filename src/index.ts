import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import authRoute from "./routes/authRoute";
import usersRoute from "./routes/usersRoute";
import { extractToken } from './utils/Utils';

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (JWT_SECRET === undefined) {
    throw new Error('No JWT_SECRET env variable found.');
}

if (JWT_REFRESH_SECRET === undefined) {
    throw new Error('No JWT_REFRESH_SECRET env variable found.');
}

export const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use('/auth', authRoute);
app.use('/user', usersRoute);


app.post("/test-token", async (req, res) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'object' && 'id' in decoded) {
            return res.json({ message: 'Access token is valid.' });
        } else {
            return res.status(500).json({ error: 'Invalid access token.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});

app.post("/test-refresh-token", async (req, res) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

        if (typeof decoded === 'object' && 'id' in decoded) {
            return res.json({ message: 'Access token is valid.' });
        } else {
            return res.status(500).json({ error: 'Invalid access token.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});



app.listen(3000, () => {
    console.log(`Server ready at: http://localhost:3000`);
});