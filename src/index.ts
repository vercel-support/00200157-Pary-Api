import { PrismaClient } from '@prisma/client';
import express from 'express';
import { GoogleUser } from '../types';

const { STREAM_API_KEY = '', STREAM_API_SECRET } = process.env;

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.post('/login', async (req, res) => {
    if (req.body.googleUser === undefined) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const googleUser = req.body.googleUser as GoogleUser;

    const user = await prisma.user.upsert({
        where: { username: googleUser.name.replace(' ', '') },
        create: {
            username: googleUser.name.replace(' ', ''),
            name: googleUser.name,
            email: googleUser.email,
            lastName: googleUser.family_name,
            assignedGoogleID: googleUser.id,
        },
        update: {
            username: googleUser.name.replace(' ', ''),
            name: googleUser.name,
            email: googleUser.email,
            lastName: googleUser.family_name,
        },
    });

    return res.status(200).json({
        user
    });
});

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    return res.json(users);
});

app.listen(3000, () => {
    console.log(`Server ready at: http://localhost:3000`);
});