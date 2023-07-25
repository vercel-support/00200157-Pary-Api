import { PrismaClient } from '@prisma/client';
import express from 'express';
import { GoogleUser } from '../types';
import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (JWT_SECRET === undefined) {
    throw new Error('No JWT_SECRET env variable found.');
}

if (JWT_REFRESH_SECRET === undefined) {
    throw new Error('No JWT_REFRESH_SECRET env variable found.');
}

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function extractToken(bearerToken: string): string {
    return bearerToken.split(' ')[1];
}

app.post('/login', async (req, res) => {
    if (req.body.googleUser === undefined) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const googleUser = req.body.googleUser as GoogleUser;

    const user = await prisma.user.upsert({
        where: {
            assignedGoogleID: googleUser.user.id,
        },
        create: {
            username: "",
            name: googleUser.user.givenName,
            email: googleUser.user.email,
            lastName: googleUser.user.familyName,
            assignedGoogleID: googleUser.user.id,
            profilePicture: googleUser.user.photo,
        },
        update: {
        },
    });

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '8weeks' });

    await prisma.user.update({
        where: { id: user.id },
        data: {
            accessToken,
            refreshToken
        }
    });

    return res.status(200).json({
        user,
        accessToken,
        refreshToken,
    });
});

app.get('/users', async (req, res) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = await prisma.user.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    profilePicture: true,
                },
            }
        );
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});

app.post('/refresh-token', async (req, res) => {
    const { refreshToken: token } = req.body;

    if (!token) {
        return res.status(403).json({ error: 'No refresh token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

        if (typeof decoded === 'object' && 'id' in decoded) {
            const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1d' });
            const refreshToken = jwt.sign({ id: decoded.id }, JWT_REFRESH_SECRET, { expiresIn: '8weeks' });
            await prisma.user.update({
                where: { id: decoded.id },
                data: {
                    accessToken,
                    refreshToken
                }
            });

            return res.json({ accessToken, refreshToken });
        } else {
            return res.status(500).json({ error: 'Invalid refresh token.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to refresh token.' });
    }
});

app.post('/logout', async (req, res) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'object' && 'id' in decoded) {
            await prisma.user.update({
                where: { id: decoded.id },
                data: {
                    accessToken: null,
                    refreshToken: null,
                }
            });

            return res.json({ message: 'Logged out successfully.' });
        } else {
            return res.status(500).json({ error: 'Invalid access token.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});

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
})
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
})


app.listen(3000, () => {
    console.log(`Server ready at: http://localhost:3000`);
});