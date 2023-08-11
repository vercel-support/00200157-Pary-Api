import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '..';

import { extractToken } from '../utils/Utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error('No se encontró la variable de entorno JWT_SECRET.');
}
if (!JWT_REFRESH_SECRET) {
    throw new Error('No se encontró la variable de entorno JWT_REFRESH_SECRET.');
}

const router = express.Router();

const respondWithError = (res: Response, status: number, error: any) => {
    return res.status(status).json({ error });
};

// check in db if the username provided exists or not also check its token

router.get('/check-username', (req, res) => {
    const { username, authorization: bearerToken } = req.headers;
    console.log(username, bearerToken);

    if (!username || typeof username !== 'string') {
        return respondWithError(res, 400, 'No se proporcionó un nombre de usuario.');
    }
    if (!bearerToken) {
        return respondWithError(res, 403, 'No se proporcionó un token.');
    }

    const token = extractToken(bearerToken);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !(typeof decoded === 'object' && 'id' in decoded)) {
            return respondWithError(res, 500, 'Token de acceso inválido.');
        }

        prisma.user.findUnique({ where: { username } })
            .then(user => {
                if (!user) {
                    return res.status(200).json({ exists: false, message: 'El nombre de usuario no existe.' });
                }
                return res.status(200).json({ exists: true, message: 'El nombre de usuario existe.' });
            })
            .catch(error => {
                console.error(error);
                return respondWithError(res, 500, 'Error al consultar el nombre de usuario.');
            });
    });
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

router.post('/update', (req, res) => {

    const { username, name, lastName, profilePictures, gender, description, birthDate, musicInterest, deportsInterest, artAndCultureInterest, techInterest, hobbiesInterest } = req.body;


    if (!username || !name || !gender || !lastName || !profilePictures) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (!Array.isArray(musicInterest)) {
        return res.status(400).json({ error: 'musicInterest should be a string.' });
    }
    if (!Array.isArray(deportsInterest)) {
        return res.status(400).json({ error: 'deportsInterest should be a string.' });
    }
    if (!Array.isArray(artAndCultureInterest)) {
        return res.status(400).json({ error: 'artAndCultureInterest should be a string.' });
    }
    if (!Array.isArray(techInterest)) {
        return res.status(400).json({ error: 'techInterest should be a string.' });
    }
    if (!Array.isArray(hobbiesInterest)) {
        return res.status(400).json({ error: 'hobbiesInterest should be a string.' });
    }

    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !(typeof decoded === 'object' && 'id' in decoded)) {
            return respondWithError(res, 500, 'Token de acceso inválido.');
        }

        prisma.user.update({
            where: { id: decoded.id },
            data: {
                username,
                name,
                lastName,
                profilePictures,
                gender: gender,
                signedIn: true,
                musicInterest,
                deportsInterest,
                artAndCultureInterest,
                techInterest,
                hobbiesInterest,
                description,
                birthDate
            },
        })
            .then(updatedUser => {
                return res.status(200).json({ message: 'Usuario actualizado con éxito.', user: updatedUser });
            })
            .catch(error => {
                if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                    return respondWithError(res, 400, 'El nombre de usuario ya está en uso.');
                } else {
                    console.error(error);
                    return respondWithError(res, 500, 'Error al actualizar el usuario.');
                }
            });
    });
});

router.get("/:id", (req, res) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const token = extractToken(bearerToken);
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !(typeof decoded === 'object' && 'id' in decoded)) {
            return respondWithError(res, 500, 'Invalid access token.');
        }

        if (decoded.id !== req.params.id) {
            return respondWithError(res, 403, 'Access Denied: Token does not match user ID.');
        }

        prisma.user.findUnique({ where: { id: decoded.id } })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found.' });
                }
                return res.status(200).json(user);
            })
            .catch(error => {
                console.error(error);
                return respondWithError(res, 500, 'Error fetching user data.');
            });
    });
});



export default router;