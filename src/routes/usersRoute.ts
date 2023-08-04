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
    const { username, authorization: bearerToken } = req.headers;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'No username provided.' });
    }
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

router.post('/update', async (req, res) => {
    const { username, name, lastName, profilePictures, gender, signedIn, interests } = req.body;


    if (!username || !name || !gender || !lastName || !profilePictures || signedIn === undefined) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && 'id' in decoded) {
            const updatedUser = await prisma.user.update({
                where: { id: decoded.id },
                data: {
                    username,
                    name,
                    lastName,
                    profilePictures,
                    gender,
                    signedIn: true,
                    interests
                },
            });

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found.' });
            }

            return res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
        } else {
            return res.status(500).json({ error: 'Invalid access token.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});


export default router;