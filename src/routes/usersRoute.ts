import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Storage } from "aws-amplify";
import { randomUUID } from 'crypto';
import express, { Response } from 'express';
import fileUpload from 'express-fileupload';
import jwt from 'jsonwebtoken';
import { prisma } from '..';
import { extractToken } from '../utils/Utils';


const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error('No se encontró la variable de entorno JWT_SECRET.');
}
if (!JWT_REFRESH_SECRET) {
    throw new Error('No se encontró la variable de entorno JWT_REFRESH_SECRET.');
}

const router = express.Router();

router.use(fileUpload());

const respondWithError = (res: Response, status: number, error: any) => {
    return res.status(status).json({ error });
};

// check in db if the username provided exists or not also check its token

router.get('/check-username', (req, res) => {
    const { username, authorization: bearerToken } = req.headers;

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

router.post('/upload-profile-picture', async (req, res) => {
    const bearerToken = req.headers['authorization'];
    const imageBase64 = req.body.image;

    if (!imageBase64) {
        return respondWithError(res, 400, 'No image provided.');
    }

    const { index } = req.query;

    if (typeof index !== 'string' || isNaN(Number(index))) {
        return respondWithError(res, 400, 'Invalid index provided.');
    }

    // Convertir base64 a Buffer
    const imageBuffer = Buffer.from(imageBase64.split(",")[1], 'base64');
    const fileType = imageBase64.match(/data:image\/(.*?);base64/)?.[1]; // obtiene el tipo de imagen (png, jpeg, etc.)

    console.log("Uploading...");

    const numericIndex = Number(index);

    Storage.put(`${randomUUID()}-${Date.now()}.` + fileType, imageBuffer, {
        contentType: 'image/' + fileType,
        level: 'public',
        progressCallback: progress => console.log(`Uploaded: ${progress.loaded}/${progress.total}`)
    }).then(result => {
        console.log("Uploaded: " + JSON.stringify(result, null, 4));
        // @ts-ignore
        Storage.get(result.key).then(result => {
            console.log("Result Image:", result);
            return res.status(200).json({ result });
        }).catch(error => {
            console.error(error);
            return respondWithError(res, 500, 'Error uploading image.');
        });


        /* prisma.user.update({
            where: { id: decoded.id },
            data: {
                profilePictures: {
                    set: { [numericIndex]: imageUrl }
                }
            }
        }).catch(error => {
            console.error(error);
            return respondWithError(res, 500, 'Error updating user.');
        }).then(() => {
            res.status(200).json({ imageUrl });
        }); */
    }).catch(error => {
        console.log(error);
        return respondWithError(res, 500, 'Error uploading image.');
    });


});



export default router;