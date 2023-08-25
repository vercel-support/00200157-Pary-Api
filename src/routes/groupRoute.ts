import express, { Request, Response, Router } from 'express';
import { authenticateTokenMiddleware, respondWithError } from '../utils/Utils';
import { prisma } from '..';
import { AuthenticatedRequest } from '../../types';

// Middleware para detectar usuario

const router = express.Router();
router.use(authenticateTokenMiddleware);

router.post('/groups', async (req: Request, res: Response) => {
    try {
        const group = await prisma.group.create({
            data: req.body
        });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: "Failed to create a new group." });
    }
});

router.get('/groups/:groupId', async (req: Request, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const group = await prisma.group.findUnique({
            where: { id: groupId }
        });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group details." });
    }
});

router.put('/groups/:groupId', async (req: Request, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: req.body
        });
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ error: "Failed to update group." });
    }
});

// Restricción para eliminar grupos solo por el dueño
router.delete('/groups/:groupId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const decoded = req.decoded;

        if (typeof decoded !== "object" || !("id" in decoded)) {
            return respondWithError(res, 500, "Error al decodificar el token.");
        }
        const group = await prisma.group.findUnique({
            where: { id: groupId }, select: {
                leaderId: true
            }
        });

        if (!group) {
            return respondWithError(res, 404, "Group not found.");
        }

        if (group.leaderId !== decoded.id) {
            return respondWithError(res, 403, "Only the group leader can delete the group.");
        }

        await prisma.group.delete({
            where: { id: groupId }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete group." });
    }
});

router.post('/groups/:groupId/addParty', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const partyId = req.body.partyId;
        const decoded = req.decoded;

        if (typeof decoded !== "object" || !("id" in decoded)) {
            return respondWithError(res, 500, "Error al decodificar el token.");
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return respondWithError(res, 500, "Error fetching user data.");
        }

        const updatedParty = await prisma.party.update({
            where: { id: partyId },
            data: {
                groups: {
                    connect: {
                        id: groupId
                    }
                }
            }
        });
        //TODO: Enviar notificacion al usuario que invito

        res.status(200).json(updatedParty);
    } catch (error) {
        res.status(500).json({ error: "Failed to add party to group." });
    }
});

// Invitar a usuarios a un grupo
router.post('/groups/:groupId/invite', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const userIdToInvite = req.body.userId;
        const decoded = req.decoded;

        if (typeof decoded !== "object" || !("id" in decoded)) {
            return respondWithError(res, 500, "Error al decodificar el token.");
        }

        const invitingUser = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!invitingUser) {
            return respondWithError(res, 500, "Error fetching user data.");
        }
        const isMember = await prisma.groupMember.findFirst({
            where: {
                groupId: groupId,
                userId: decoded.id
            }
        });

        if (!isMember) {
            return respondWithError(res, 403, "Only group members can invite users.");
        }

        const invitation = await prisma.groupInvitation.create({
            data: {
                groupId: groupId,
                invitedUserId: userIdToInvite,
                invitingUserId: invitingUser.id
            }
        });
        //TODO: Enviar notificacion al usuario que invito

        res.status(201).json(invitation);
    } catch (error) {
        res.status(500).json({ error: "Failed to send group invitation." });
    }
});

// Aceptar una invitación
router.post('/groups/:groupId/accept-invitation', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const decoded = req.decoded;

        if (typeof decoded !== "object" || !("id" in decoded)) {
            return respondWithError(res, 500, "Error al decodificar el token.");
        }

        const invitation = await prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: decoded.id
            }
        });

        if (invitation) {
            await prisma.groupInvitation.delete({
                where: { id: invitation.id }
            });
        }

        await prisma.groupMember.create({
            data: {
                groupId: groupId,
                userId: decoded.id
            }
        });
        //TODO: Enviar notificacion al usuario que invito

        res.status(200).json({ message: "Invitation accepted and user added to group." });
    } catch (error) {
        res.status(500).json({ error: "Failed to accept group invitation." });
    }
});

// Declinar una invitación
router.post('/groups/:groupId/decline-invitation', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const decoded = req.decoded;

        if (typeof decoded !== "object" || !("id" in decoded)) {
            return respondWithError(res, 500, "Error al decodificar el token.");
        }

        const invitation = await prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: decoded.id
            }
        });

        if (invitation) {
            await prisma.groupInvitation.delete({
                where: { id: invitation.id }
            });
        }
        //TODO: Enviar notificacion al usuario que invito

        res.status(200).json({ message: "Invitation declined." });
    } catch (error) {
        res.status(500).json({ error: "Failed to decline group invitation." });
    }
});

// Cancelar una invitación
router.post('/groups/:groupId/cancel-invitation', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const userIdToCancel = req.body.userId;

        const invitation = await prisma.groupInvitation.findFirst({
            where: {
                groupId: groupId,
                invitedUserId: userIdToCancel
            }
        });

        if (invitation) {
            await prisma.groupInvitation.delete({
                where: { id: invitation.id }
            });
        }
        //TODO: Enviar notificacion al usuario que declino la invitacion

        res.status(200).json({ message: "Invitation cancelled." });
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel group invitation." });
    }
});


export default router;