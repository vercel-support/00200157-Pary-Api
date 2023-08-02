import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '..';
import { extractToken } from '../utils/Utils';

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (JWT_SECRET === undefined) {
    throw new Error('No JWT_SECRET env variable found.');
}

if (JWT_REFRESH_SECRET === undefined) {
    throw new Error('No JWT_REFRESH_SECRET env variable found.');
}

const router = express.Router();

// check in db if the username provided exists or not also check its token

router.get('/check-username', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'No username provided.' });
    }

    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'object' && 'id' in decoded) {
            const user = await prisma.user.findUnique({
                where: { username },
            });

            if (!user) {
                return res.status(200).json({ exists: false, message: 'Username does not exist.' });
            }

            return res.status(200).json({ exists: true, message: 'Username exists.' });
        } else {
            return res.status(500).json({ error: 'Invalid access token.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});

router.get('/users', async (req, res) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && 'id' in decoded) {
            const users = await prisma.user.findFirst();
            return res.json(users);
        } else {
            return res.status(500).json({ error: 'Invalid access token.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});


export default router;