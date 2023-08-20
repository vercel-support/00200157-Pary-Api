import { randomUUID } from "crypto";
import { Party, PartyType } from "../../types";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { AuthenticatedRequest } from "../../types";
import express, { Request, Response, NextFunction } from "express";
import { prisma } from "..";


const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error("No se encontró la variable de entorno JWT_SECRET.");
}
if (!JWT_REFRESH_SECRET) {
    throw new Error("No se encontró la variable de entorno JWT_REFRESH_SECRET.");
}


// Middleware para verificar el token JWT
export function authenticateTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        respondWithError(res, 401, "No se ha proporcionado un token.");
        return;
    }

    jwt.verify(token, JWT_SECRET as string, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        if (err || !decoded || typeof decoded === "string") {
            respondWithError(res, 403, "Token inválido.");
            return;
        }

        (req as AuthenticatedRequest).decoded = decoded;
        next();
    });
}

export function extractToken(bearerToken: string): string {
    return bearerToken.split(' ')[1];
}


export const respondWithError = (res: Response, status: number, error: any) => {
    return res.status(status).json({ error });
};

// Genera una fecha aleatoria entre ahora y una semana a partir de ahora
function randomDateWithinAWeek(): Date {
    const now = new Date();
    const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    return new Date(now.getTime() + Math.random() * weekInMilliseconds);
}

// Genera una hora aleatoria entre las 8 PM y las 2 AM
function randomTimeBetween8PMand2AM(date: Date): Date {
    const hour = Math.floor(Math.random() * 7); // De 0 a 6
    date.setHours(20 + hour); // Sumar 20 porque queremos que comience a las 8 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

const locations = [
    "Las Condes", "Providencia", "Vitacura", "La Reina",
    "Ñuñoa", "Macul", "Santiago Centro", "Peñalolén",
    "San Miguel", "La Florida"
];

const names = [
    "Fiesta de Estrellas", "Noche Tropical", "Baile de Luna Llena",
    "Encuentro de Verano", "Danza del Crepúsculo", "Carnaval de Medianoche",
    "Reunión Costera", "Festival de Sol", "Celebración de Primavera",
    "Gala de Invierno"
];
const descriptions = [
    "¡Pégate el pique y ven a disfrutar de una noche estrellada en {location}! No te vas a arrepentir, ¡cachai! La mejor fiesta del año te está esperando. Una noche donde la música, la diversión y las sorpresas no pararán.",
    "¡Sácate los chalas y siente el calor tropical en pleno {location}! Va a estar de lujo. No te pierdas la oportunidad de bailar, reír y disfrutar en la mejor fiesta tropical de la temporada.",
    "¡Baila piola bajo la luna llena en {location}! La noche está joven y la fiesta también. Una experiencia única, con una vista espectacular y la mejor música en vivo.",
    "¿Listo para un carrete de verano en {location}? ¡Trae tu mejor onda y disfruta! El verano es corto, así que hay que aprovecharlo. Ven y disfruta de una noche de música, baile y los mejores cócteles refrescantes.",
    "La danza del atardecer te está esperando en {location}. ¡Ven a mover el esqueleto! Una noche mágica, llena de sorpresas, buena música y una atmósfera inigualable.",
    "El carrete más esperado en {location} está al caer. ¡No te lo puedes perder! Una noche donde la música, la diversión y las sorpresas no pararán. Ven y descubre por qué todos hablan de este carrete.",
    "Nos vemos en la playita de {location}. ¡El mejor carrete costero del año! Si eres amante de la playa, la música y la diversión, este es tu lugar. No te lo pierdas.",
    "¿Preparado para festejar a lo grande en {location}? ¡Te esperamos con los brazos abiertos! Una fiesta llena de energía, sol y las mejores bebidas para refrescarte.",
    "¡El carrete primaveral ha llegado a {location}! ¿Te sumas? Es la época perfecta para disfrutar de la naturaleza, la buena música y la mejor compañía. ¡Anímate y vive una experiencia única!",
    "A pesar del frío, {location} te invita a la mejor fiesta de invierno. ¡Vamos que se puede! Un ambiente cálido, buena música y muchas sorpresas te esperan. No te quedes fuera."
];
const tags = [
    ["máscaras", "playa", "música en vivo"],
    ["verano", "invierno", "cócteles"],
    ["playa", "música en vivo", "gourmet"],
    ["invierno", "cócteles", "sol"],
    ["música en vivo", "gourmet", "luna"],
    ["cócteles", "sol", "estrellas"],
    ["gourmet", "luna", "máscaras"],
    ["sol", "estrellas", "verano"],
    ["luna", "máscaras", "playa"],
    ["estrellas", "verano", "invierno"]
];
const types: PartyType[] = ["carrete", "junta", "evento", "previa", "otro"];

export const generatePartiesForUsers = async (users: any[]): Promise<Party[]> => {
    const parties: Party[] = [];
    const userCount = users.length;

    if (userCount === 0) {
        throw new Error("No hay usuarios en la base de datos.");
    }

    const types: PartyType[] = ["carrete", "junta", "evento", "previa", "otro"];
    const randomOffset = Math.floor(Math.random() * 101); // Un número aleatorio entre 0 y 100

    for (let i = 0; i < 50; i++) {
        const index = (randomOffset + i) % 150; // Usamos el módulo para evitar desbordamiento
        const loc = locations[index % locations.length];
        const name = names[index % names.length];
        const desc = descriptions[index % descriptions.length].replace('{location}', loc);
        const imgNumber = (index % 17) + 1;
        const image = `/images/parties/disco${imgNumber}.jpg`;
        const tag = tags[index % tags.length];
        const creatorUsername = users[index % userCount].username;
        const type = types[index % types.length];
        const creationDate = randomDateWithinAWeek();
        const date = randomTimeBetween8PMand2AM(new Date(creationDate));
        const privateParty = Math.random() < 0.5;
        const advertisement = Math.random() < 0.5;


        parties.push({
            id: randomUUID(),
            location: loc,
            name: name,
            description: desc,
            image: image,
            creatorUsername: creatorUsername,
            tags: tag,
            type: type,
            creationDate,
            date,
            private: privateParty,
            active: true,
            participants: [],
            advertisement,
            moderators: [],
        });
    }

    return parties;
};


export const createPartiesForUsers = async (users: any[]): Promise<Party[]> => {

    const userCount = users.length;
    const savedParties = [];

    for (let i = 0; i < 50; i++) {
        const index = (i * 37) % userCount; // Simplemente un número para desordenar el índice
        const loc = locations[i % locations.length];
        const name = names[i % names.length];
        const desc = descriptions[i % descriptions.length].replace('{location}', loc);
        const imgNumber = (i % 17) + 1;
        const image = `/images/parties/disco${imgNumber}.jpg`;
        const tag = tags[i % tags.length];
        const creatorUsername = users[index % userCount].username;
        const type = types[i % types.length];
        const creationDate = randomDateWithinAWeek();
        const date = randomTimeBetween8PMand2AM(new Date(creationDate));
        const privateParty = Math.random() < 0.5;
        const advertisement = Math.random() < 0.5;
        const savedParty = await prisma.party.create({
            data: {
                location: loc,
                name: name,
                description: desc,
                image: image,
                creatorUsername: creatorUsername,
                tags: tag,
                type: type,
                creationDate,
                date,
                private: privateParty,
                advertisement,
                active: true,
            }
        });
        console.log("Creada fiesta ", JSON.stringify(savedParty));
        savedParties.push(savedParty);

    }
    return savedParties as Party[];
};
