import { randomUUID } from "crypto";
import { Party, PartyType, User } from "../../types";
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
        if (err) {
            console.warn(err);
            respondWithError(res, 403, "Token inválido.");
            return;
        }
        if (typeof decoded === "string") {
            console.log("decoded is string");
            respondWithError(res, 403, "Token inválido.");
            return;
        }

        (req as AuthenticatedRequest).decoded = decoded;
        next();
    });
}

// Middleware para verificar el token JWT
export function authenticateRefreshTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        respondWithError(res, 401, "No se ha proporcionado un token.");
        return;
    }

    jwt.verify(token, JWT_REFRESH_SECRET as string, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        if (err || !decoded || typeof decoded === "string") {
            respondWithError(res, 403, "Refresh Token inválido.");
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
    "Valparaíso",
    "Casablanca",
    "Concón",
    "Juan Fernández",
    "Puchuncaví",
    "Quintero",
    "Viña del Mar",
    "Isla de Pascua",
    "Los Andes",
    "Calle Larga",
    "Rinconada",
    "San Esteban",
    "La Ligua",
    "Cabildo",
    "Papudo",
    "Petorca",
    "Zapallar",
    "Quillota",
    "La Calera",
    "Hijuelas",
    "La Cruz",
    "Nogales",
    "San Antonio",
    "Algarrobo",
    "Cartagena",
    "El Quisco",
    "El Tabo",
    "Santo Domingo",
    "San Felipe",
    "Catemu",
    "Llay-Llay",
    "Panquehue",
    "Putaendo",
    "Santa María",
    "Quilpué",
    "Limache",
    "Olmué",
    "Villa Alemana",
    "Santiago",
    "Cerrillos",
    "Cerro Navia",
    "Conchalí",
    "El Bosque",
    "Estación Central",
    "Huechuraba",
    "Independencia",
    "La Cisterna",
    "La Florida",
    "La Granja",
    "La Pintana",
    "La Reina",
    "Las Condes",
    "Lo Barnechea",
    "Lo Espejo",
    "Lo Prado",
    "Macul",
    "Maipú",
    "Ñuñoa",
    "Pedro Aguirre Cerda",
    "Peñalolén",
    "Providencia",
    "Pudahuel",
    "Quilicura",
    "Quinta Normal",
    "Recoleta",
    "Renca",
    "San Joaquín",
    "San Miguel",
    "San Ramón",
    "Vitacura",
    "Puente Alto",
    "Pirque",
    "San José de Maipo",
    "Colina",
    "Lampa",
    "Til Til",
    "San Bernardo",
    "Buin",
    "Calera de Tango",
    "Paine",
    "Melipilla",
    "Alhué",
    "Curacaví",
    "María Pinto",
    "San Pedro",
    "Talagante",
    "El Monte",
    "Isla de Maipo",
    "Padre Hurtado",
    "Peñaflor"
];

const names: string[] = [
    "Carrete Nocturno 🌙",
    "Mambo Chileno 🕺",
    "Mereketengue al 100 💥",
    "Pary Retro 80's 📻",
    "Fiesta Neon 🌈",
    "Bailoteo Cuequero 💃",
    "Pachanga Playera 🌊",
    "Tiki Pary 🍹",
    "Carrete Campesino 🍂",
    "Mambo Electrónico 🎧",
    "Pary K-Pop 🎤",
    "Mereketengue de Superhéroes 🦸",
    "Carretón Animal Print 🦓",
    "Pary del Espacio 🚀",
    "Bailoteo del Futuro 🤖",
    "Mereketengue Disco 🕺💃",
    "Pachanga del Recuerdo 🎶",
    "Mambo a lo Vikingo 🪓",
    "Pary de Película 🎬",
    "Carrete de Pijamas 🛌",
    "Fiesta en Blanco y Negro ⚪⚫",
    "Mereketengue Tropical 🍍",
    "Pary de los 90's 📼",
    "Carretón Medieval ⚔️",
    "Bailoteo Circense 🎪",
    "Mereketengue del Oeste 🤠",
    "Pachanga de Máscaras 🎭",
    "Fiesta de Fantasía 🧝",
    "Pary de Horrores 🧟",
    "Carrete del Zodiaco ♒",
    "Mambo de Maravillas 🎇",
    "Bailoteo Pirata ☠️",
    "Mereketengue a lo Greco 🏛️",
    "Pary del Desierto 🌵",
    "Fiesta de la Selva 🦜",
    "Carrete Vintage 🎥",
    "Pachanga Futbolera ⚽",
    "Mambo de Viajeros 🌍",
    "Pary de Dragones 🐉",
    "Carretón Galáctico 🌌",
    "Bailoteo Rockero 🎸",
    "Mereketengue de Magos 🪄",
    "Pary de Sirenas 🧜",
    "Pachanga de Unicornios 🦄",
    "Mambo Urbano 🏙️",
    "Pary del Arcoíris 🌈",
    "Mereketengue en la Montaña 🏔️",
    "Carrete Bajo el Mar 🐠",
    "Pachanga del Bosque 🌳",
    "Mambo de Estrellas ⭐"
];


const descriptions: string[] = [
    "¡Prepárate para el Carrete Nocturno más épico bajo la luna en {location}! Noche llena de música y diversión para que la pases de lujo.",
    "¡Ven a mover el esqueleto al ritmo del Mambo Chileno en {location}! La fiesta que todos están esperando, ¡dale color al baile!",
    "¡El Mereketengue al 100 está en {location}! Explosión de energía, música y buena onda. ¡No te quedes fuera de la pachanga!",
    "¡Revive los años 80 en el Pary Retro 80's en {location}! Atuendos ochenteros, música clásica y ambiente vibrante.",
    "¡Sumérgete en la Fiesta Neon más brillante en {location}! Colores fluorescentes, diversión luminosa y baile sin parar.",
    "¡El Bailoteo Cuequero llega a {location}! Baile folclórico con un giro moderno, ¡a mover las caderas!",
    "¡La Pachanga Playera te espera en {location}! Traje de baño y ritmos veraniegos para pasarla increíble en la playa.",
    "¡Tiki Pary en {location} te transportará a una isla tropical! Cocktails, música relajada y buen ambiente te esperan.",
    "¡En el Carrete Campesino en {location} la tradición se mezcla con la diversión! Ven a disfrutar de una pachanga auténtica.",
    "¡Siente la vibra del Mambo Electrónico en {location}! Música electrónica y ambiente energético para una noche inolvidable.",
    "¡Únete al Pary K-Pop en {location} y baila al ritmo de tus ídolos favoritos! Coreografías y diversión al máximo.",
    "¡Despierta al superhéroe que llevas dentro en el Mereketengue de Superhéroes en {location}! Trae tu mejor disfraz y súmate a la acción.",
    "¡Prepárate para el Carretón Animal Print en {location}! Estampados salvajes y música que te hará rugir de emoción.",
    "¡Eleva la fiesta al espacio en la Pary del Espacio en {location}! Astronautas y extraterrestres te acompañarán en esta aventura.",
    "¡Viaja en el tiempo en el Bailoteo del Futuro en {location}! Vestuario futurista y música electrónica te esperan.",
    "¡Revive los años disco en el Mereketengue Disco en {location}! Lentejuelas, luces y música que te hará brillar.",
    "¡La Pachanga del Recuerdo en {location} te llevará a los clásicos de la música! Ven a disfrutar de hits memorables.",
    "¡Embárcate en el Mambo a lo Vikingo en {location}! Trae tu casco y prepárate para la fiesta más épica de todas.",
    "¡La Pary de Película en {location} te hará sentir como una estrella de cine! Ven a disfrutar de la magia del cine.",
    "¡El Carrete de Pijamas en {location} es la excusa perfecta para quedarse cómodo! Ven en tu mejor pijama y a disfrutar.",
    "¡Experimenta la dualidad en la Fiesta en Blanco y Negro en {location}! Atuendos monocromáticos y ritmos que contrastan.",
    "¡Dale sabor tropical al baile en el Mereketengue Tropical en {location}! Ambiente playero, tragos exóticos y mucha diversión.",
    "¡Viaja en el tiempo al estilo de los 90 en la Pary de los 90's en {location}! Música y tendencias de esa época te esperan.",
    "¡El Carretón Medieval en {location} te transportará a la época de los caballeros y las leyendas! Atuendos medievales y bailes de antaño.",
    "¡Siente la magia del circo en el Bailoteo Circense en {location}! Malabaristas y acróbatas en una pachanga única.",
    "¡Ven a vivir el Oeste en el Mereketengue del Oeste en {location}! Vaqueros, cowboys y música country te esperan.",
    "¡La Pachanga de Máscaras en {location} te invita a esconder tu identidad y a revelar tu espíritu festivo!",
    "¡Dale rienda suelta a la fantasía en la Fiesta de Fantasía en {location}! Atuendos creativos y magia en el aire.",
    "¡Prepárate para la Pary de Horrores en {location}! Zombis, vampiros y sustos te esperan en esta noche tenebrosa.",
    "¡Descubre tu destino en el Carrete del Zodiaco en {location}! Ven a bailar bajo las estrellas y sentir las energías cósmicas.",
    "¡La maravilla llega con el Mambo de Maravillas en {location}! Ven a explorar la música y la diversión sin límites.",
    "¡Zarpa en el Bailoteo Pirata en {location}! Atuendos piratas, tesoros escondidos y diversión a bordo.",
    "¡Sumérgete en la Grecia antigua con el Mereketengue a lo Greco en {location}! Vestimenta clásica y música de época te esperan.",
    "¡La Pary del Desierto en {location} te hará sentir como en un oasis de diversión! Ven a disfrutar del calor y la buena onda.",
    "¡Adéntrate en la selva en la Fiesta de la Selva en {location}! Atuendos selváticos y ritmos tropicales te llevarán al corazón de la fiesta.",
    "¡El Carrete Vintage en {location} te transportará en el tiempo! Música y estilos de décadas pasadas en una noche única.",
    "¡La Pachanga Futbolera en {location} es para los amantes del fútbol! Ven a disfrutar de la emoción del deporte y la fiesta.",
    "¡Embárcate en un viaje musical en el Mambo de Viajeros en {location}! Ritmos de diferentes partes del mundo te harán bailar.",
    "¡Siente la fuerza de los dragones en la Pary de Dragones en {location}! Atuendos épicos y música que te hará volar.",
    "¡El Carretón Galáctico en {location} te llevará a explorar las estrellas! Trajes espaciales y música cósmica te esperan.",
    "¡Descarga tu energía en el Bailoteo Rockero en {location}! Música de rock, actitud desenfadada y mucha diversión.",
    "¡Hechiza la pista en el Mereketengue de Magos en {location}! Ven a mostrar tus mejores trucos y a disfrutar de la magia.",
    "¡Sumérgete en el mundo acuático en la Pary de Sirenas en {location}! Atuendos marinos y música encantadora te esperan.",
    "¡La Pachanga de Unicornios en {location} te llevará a un mundo de fantasía! Ven a disfrutar de colores y magia.",
    "¡Siente la vibra urbana en el Mambo Urbano en {location}! Música urbana y ambiente de la ciudad para una noche inolvidable.",
    "¡El Pary del Arcoíris en {location} es pura diversión multicolor! Ven a vivir una experiencia cromática única.",
    "¡Sube la montaña de la diversión en el Mereketengue en la Montaña en {location}! Ven a disfrutar de música y alegría en la cima.",
    "¡Explora las profundidades en el Carrete Bajo el Mar en {location}! Atuendos marinos y bailes acuáticos te esperan.",
    "¡Adéntrate en la naturaleza en la Pachanga del Bosque en {location}! Atuendos campestres y ritmos que conectan con la tierra.",
    "¡Brilla como una estrella en el Mambo de Estrellas en {location}! Ven a disfrutar de una noche llena de luz y baile.",
];

const tags: string[] = [
    "Rock", "Pop", "Hip Hop", "Indie", "Electrónica", "Reggaeton", "Folk", "Jazz", "Música Clásica", "Salsa", "Música Latina", "Blues", "Country", "Metal", "Punk", "K-Pop",
    "Fútbol", "Baloncesto", "Ciclismo", "Trekking", "Natación", "Snowboard", "Fitness y Gimnasio", "Surf", "Esquí", "Running", "Artes Marciales", "Yoga", "Voleibol", "Escalada", "Rugby", "Golf",
    "Cine", "Teatro", "Literatura", "Arte Contemporáneo", "Historia", "Poesía", "Fotografía", "Danza", "Museos", "Arte Moderno", "Cómics", "Anime", "Arte Digital", "Escultura", "Artesanía", "Moda",
    "Videojuegos", "Programación", "Electrónica", "Ciencia y Tecnología", "Realidad Virtual", "Robótica", "Diseño Gráfico", "Ciberseguridad", "Blockchain y Criptomonedas", "IA", "Gadgets", "Aplicaciones Móviles", "Fotografía Digital", "Streaming", "Drones", "Ingeniería",
    "Jardinería", "DIY", "Podcasts", "Astronomía", "Fotografía", "Moda", "Belleza", "Cuidado Personal", "Meditación", "Lectura", "Escritura", "Pintura", "Blogging", "Vlogging", "Coleccionismo", "Puzzles"
];

const types: PartyType[] = ["carrete", "junta", "evento", "previa", "otro"];

export const generatePartiesForUsers = async (users: any[]): Promise<Party[]> => {
    const parties: Party[] = [];
    const userCount = users.length;

    if (userCount === 0) {
        throw new Error("No hay usuarios en la base de datos.");
    }

    const types: PartyType[] = ["carrete", "junta", "evento", "previa", "otro"];
    const randomOffset = Math.floor(Math.random() * 101);

    for (let i = 0; i < 50; i++) {
        const index = (randomOffset + i) % 150;
        const loc = locations[index % locations.length];
        const selectedIndex = index % names.length;
        const name = names[selectedIndex];
        const desc = descriptions[index % descriptions.length].replace('{location}', loc);
        const imgNumber = (index % 17) + 1;
        const image = `/images/parties/disco${imgNumber}.jpg`;
        const selectedTags = Array.from({ length: 3 }, () => tags[Math.floor(Math.random() * tags.length)]);
        const { username: creatorUsername, id } = users[index % userCount];
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
            tags: selectedTags,
            type: type,
            creationDate,
            date,
            private: privateParty,
            active: true,
            participants: [],
            advertisement,
            moderators: [],
            ownerId: id
        });
    }

    return parties;
};

function getUsersToConnect(users: any[], probability: number): { userId: string; }[] {
    return users.filter(() => Math.random() < probability).map(user => {
        console.log(user);
        return { userId: user.id };
    });
}


export const createPartiesForUsers = async (users: any[]): Promise<Party[]> => {
    const userCount = users.length;
    console.log(users);
    const savedParties = [];

    for (let i = 0; i < 200; i++) {
        const index = (i * 37) % userCount;
        const loc = locations[i % locations.length];
        const name = names[i % names.length];
        const desc = descriptions[i % descriptions.length].replace('{location}', loc);
        const imgNumber = (i % 17) + 1;
        const image = `/images/parties/disco${imgNumber}.jpg`;
        const selectedTags = Array.from({ length: 3 }, () => tags[Math.floor(Math.random() * tags.length)]);
        const creator = users[index % userCount];
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
                creatorUsername: creator.username,
                ownerId: creator.id,  // Set the owner ID
                tags: selectedTags,
                type: type,
                creationDate,
                date,
                private: privateParty,
                advertisement,
                active: true,
            }
        });

        /* const moderatorsToConnect = getUsersToConnect(users, 0.05);
        const participantsToConnect = getUsersToConnect(users, 0.2);

        const combinedUsers = [...moderatorsToConnect, ...participantsToConnect];

        const uniqueUsers = Array.from(new Set(combinedUsers.map(p => p.userId)))
            .map(userId => ({ userId, partyId: savedParty.id }));

        if (uniqueUsers.length) {
            await prisma.userPartyParticipant.createMany({ data: uniqueUsers });
        }

        const uniqueModerators = moderatorsToConnect.filter(moderator =>
            uniqueUsers.some(user => user.userId === moderator.userId)
        );

        if (uniqueModerators.length) {
            await prisma.userPartyModerator.createMany({ data: uniqueModerators });
        } */

        savedParties.push(savedParty);
    }

    return savedParties as Party[];
};


export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
