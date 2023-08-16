import express from "express";
import { prisma } from "..";
import { respondWithError, generatePartiesForUsers } from "../utils/Utils";

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error("No se encontró la variable de entorno JWT_SECRET.");
}
if (!JWT_REFRESH_SECRET) {
    throw new Error("No se encontró la variable de entorno JWT_REFRESH_SECRET.");
}

const router = express.Router();



router.get("/generate-parties", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        const parties = await generatePartiesForUsers(users);

        // Ahora puedes decidir si quieres guardar estas fiestas en la base de datos 
        // o simplemente devolverlas como respuesta. Por ahora, simplemente las devolveré.
        return res.status(200).json(parties);
    } catch (error) {
        console.error(error);
        return respondWithError(res, 500, "Error generando fiestas.");
    }
});

export default router;