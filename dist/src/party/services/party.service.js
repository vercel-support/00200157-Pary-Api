"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyService = void 0;
const common_1 = require("@nestjs/common");
const blob_1 = require("@vercel/blob");
const crypto_1 = require("crypto");
const Requests_1 = require("../../db/Requests");
const prisma_service_1 = require("../../db/services/prisma.service");
const notifications_service_1 = require("../../notifications/services/notifications.service");
const utils_service_1 = require("../../utils/services/utils.service");
let PartyService = class PartyService {
    constructor(prisma, utils, notifications) {
        this.prisma = prisma;
        this.utils = utils;
        this.notifications = notifications;
    }
    async createParty(partyBody, userId) {
        const { name, description, location, date, type, tags, participants, image, showAddressInFeed, ageRange, consumables, covers, tickets } = partyBody;
        const inviter = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                username: true,
                socialMedia: true,
                id: true,
                userType: true,
                parties: {
                    select: {
                        id: true
                    }
                },
                staffs: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!inviter) {
            throw new common_1.NotFoundException("User not found");
        }
        if (inviter.parties.length >= 15 && inviter.userType === "Normal") {
            throw new common_1.BadRequestException("No puedes crear más de 15 carretes.");
        }
        const usersToInvite = participants;
        const users = await this.prisma.user.findMany({
            where: {
                username: {
                    in: usersToInvite
                }
            },
            select: {
                id: true,
                username: true,
                socialMedia: true,
                expoPushToken: true
            }
        });
        let defaultTicket = undefined;
        if (tickets.length === 0) {
            let baseTicket = await this.prisma.ticketBase.findFirst({
                where: {
                    name: "Entrada General",
                    creatorId: userId
                }
            });
            if (!baseTicket) {
                baseTicket = await this.prisma.ticketBase.create({
                    data: {
                        name: "Entrada General",
                        description: "Entrada general.",
                        type: "GRATIS",
                        creator: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });
            }
            defaultTicket = await this.prisma.ticket.create({
                data: {
                    stock: 200,
                    price: 0,
                    payInDoor: true,
                    base: {
                        connect: {
                            id: baseTicket.id
                        }
                    }
                }
            });
            tickets.push(defaultTicket);
        }
        const partyLocation = await this.prisma.location.create({
            data: {
                ...location
            }
        });
        const partyChat = await this.prisma.chat.create({
            data: {}
        });
        const party = await this.prisma.party
            .create({
            data: {
                name,
                description,
                type,
                tags,
                advertisement: false,
                active: true,
                date: new Date(date),
                ownerId: userId,
                image,
                showAddressInFeed,
                ageRange,
                locationId: partyLocation.id,
                chatId: partyChat.id,
                consumables: {
                    connect: consumables.map(consumable => {
                        if (inviter.userType === "Normal") {
                            throw new common_1.BadRequestException("No tienes permisos para crear Carretes con Consumibles");
                        }
                        return { id: consumable.id };
                    })
                },
                covers: {
                    connect: covers.map(cover => {
                        if (inviter.userType === "Normal") {
                            throw new common_1.BadRequestException("No tienes permisos para crear Carretes con Covers");
                        }
                        return { id: cover.id };
                    })
                },
                tickets: {
                    connect: tickets.map(ticket => {
                        if (inviter.userType === "Normal" && defaultTicket.id !== ticket.id) {
                            throw new common_1.BadRequestException("No tienes permisos para crear Carretes con Tickets");
                        }
                        return { id: ticket.id };
                    })
                }
            }
        })
            .catch(async () => {
            await this.prisma.location.delete({
                where: {
                    id: partyLocation.id
                }
            });
            await this.prisma.chat.delete({
                where: {
                    id: partyChat.id
                }
            });
            throw new common_1.InternalServerErrorException("Error al crear el carrete.");
        });
        if (!party) {
            throw new common_1.InternalServerErrorException("Error creating party.");
        }
        await this.prisma.partyMember.create({
            data: {
                partyId: party.id,
                userId
            }
        });
        await this.prisma.ticketOwnership.create({
            data: {
                userId,
                ticketId: defaultTicket.id,
                partyId: party.id
            }
        });
        for (const user of users) {
            if (user.id === userId)
                continue;
            this.prisma.partyInvitation
                .create({
                data: {
                    partyId: party.id,
                    invitedUserId: user.id,
                    invitingUserId: userId,
                    ticketId: defaultTicket.id
                }
            })
                .then(response => {
                if (response) {
                    this.notifications.sendPartyInviteNotification(user.expoPushToken, inviter, party.name, party.id, party.type);
                }
            });
        }
        return party;
    }
    async updateParty(partyBody, userId) {
        const { id, name, description, location, date, type, tags, image, oldImage, showAddressInFeed, ageRange, consumables, covers, tickets } = partyBody;
        const currentParty = await this.prisma.party.findUnique({
            where: {
                id
            },
            select: {
                ownerId: true,
                image: true,
                locationId: true,
                moderators: {
                    select: {
                        userId: true
                    }
                },
                consumables: {
                    select: {
                        id: true
                    }
                },
                covers: {
                    select: {
                        id: true
                    }
                },
                tickets: {
                    select: {
                        id: true
                    }
                },
                members: {
                    select: {
                        userId: true
                    }
                }
            }
        });
        if (!currentParty) {
            throw new common_1.NotFoundException("Carrete no encontrado");
        }
        if (currentParty.ownerId !== userId && !currentParty.moderators.some(mod => mod.userId === userId)) {
            throw new common_1.ForbiddenException("No tienes permisos para actualizar este carrete.");
        }
        const newConsumables = consumables.filter(consumable => !currentParty.consumables.some(c => c.id === consumable.id));
        const newCovers = covers.filter(cover => !currentParty.covers.some(c => c.id === cover.id));
        const newTickets = tickets.filter(ticket => !currentParty.tickets.some(t => t.id === ticket.id));
        const consumablesToDelete = currentParty.consumables.filter(consumable => !consumables.some(c => c.id === consumable.id));
        const coversToDelete = currentParty.covers.filter(cover => !covers.some(c => c.id === cover.id));
        const ticketsToDelete = currentParty.tickets.filter(ticket => !tickets.some(t => t.id === ticket.id));
        const party = await this.prisma.party.update({
            where: {
                id
            },
            data: {
                name,
                description,
                type,
                tags,
                active: true,
                date: new Date(date),
                image,
                showAddressInFeed,
                ageRange,
                consumables: {
                    connect: newConsumables.map(consumable => ({ id: consumable.id })),
                    disconnect: consumablesToDelete.map(consumable => ({ id: consumable.id }))
                },
                covers: {
                    connect: newCovers.map(cover => ({ id: cover.id })),
                    disconnect: coversToDelete.map(cover => ({ id: cover.id }))
                },
                tickets: {
                    connect: newTickets.length > 0 ? newTickets.map(ticket => ({ id: ticket.id })) : undefined,
                    disconnect: ticketsToDelete.length > 0 ? ticketsToDelete.map(({ id }) => ({ id })) : undefined
                }
            }
        });
        await this.prisma.location.update({
            where: {
                id: party.locationId
            },
            data: {
                name: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
                timestamp: location.timestamp,
                address: location.address
            }
        });
        if (!party) {
            if (image) {
                (0, blob_1.del)(image.url);
            }
            throw new common_1.InternalServerErrorException("Error actualizando carrete.");
        }
        if (oldImage) {
            await (0, blob_1.del)(oldImage.url);
        }
        return party;
    }
    async getOwnParties(paginationDto, userId) {
        const { limit, page } = paginationDto;
        const skip = page * limit;
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                location: true
            }
        });
        if (!currentUser) {
            throw new common_1.NotFoundException("User not found");
        }
        const parties = await this.prisma.party.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        members: {
                            some: {
                                userId
                            }
                        }
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            },
            include: Requests_1.PARTY_REQUEST,
            take: limit,
            skip: skip,
            orderBy: { date: "asc" }
        });
        const totalParties = await this.prisma.party.count({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        members: {
                            some: {
                                userId
                            }
                        }
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        const partiesToReturn = await Promise.all(parties.map(async (party) => {
            const distance = this.utils.haversineDistance(currentUser.location, party.location);
            party.distance = distance;
            return party;
        }));
        const hasNextPage = page * limit < totalParties;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            parties: partiesToReturn,
            hasNextPage,
            nextPage
        };
    }
    async uploadPartyImage(image) {
        if (!image) {
            throw new common_1.BadRequestException("Debe subir una imagen.");
        }
        const fileType = image.mimetype.split("/")[1];
        const uploadImageToVercel = async (retry = true) => {
            try {
                const { url } = await (0, blob_1.put)(`${process.env.NODE_ENV}-party-${(0, crypto_1.randomUUID)()}.${fileType}`, image.file, {
                    access: "public"
                }).catch(() => {
                    throw new common_1.InternalServerErrorException("Error al guardar la imagen en la base de datos.");
                });
                if (!url || url === "") {
                    throw new common_1.InternalServerErrorException("Error al guardar la imagen en la base de datos.");
                }
                return url;
            }
            catch (error) {
                if (retry) {
                    return await uploadImageToVercel(false);
                }
                throw new common_1.InternalServerErrorException("Error al guardar la imagen en la base de datos.");
            }
        };
        return await uploadImageToVercel();
    }
    async replacePartyImage(partId, uploadImageDto, userId) {
        const { image } = uploadImageDto;
        if (!image) {
            throw new common_1.BadRequestException("Debe subir una imagen.");
        }
        const party = await this.prisma.party.findUnique({
            where: {
                id: partId,
                ownerId: userId
            },
            select: {
                image: true
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado / Not authorized.");
        }
        const imageBuffer = Buffer.from(image.split(",")[1], "base64");
        const fileType = image.match(/data:image\/(.*?);base64/)?.[1];
        const uploadImageToVercel = async (retry = true) => {
            try {
                const { url } = await (0, blob_1.put)(`${process.env.NODE_ENV}-party-${(0, crypto_1.randomUUID)()}.${fileType}`, imageBuffer, {
                    access: "public",
                    contentType: `image/${fileType}`
                });
                if (!url || url === "") {
                    throw new common_1.InternalServerErrorException("Error uploading image.");
                }
                return {
                    url
                };
            }
            catch (error) {
                if (retry) {
                    return await uploadImageToVercel(false);
                }
                throw new common_1.InternalServerErrorException("Error uploading image.");
            }
        };
        const { url } = await uploadImageToVercel();
        if (party.image.url) {
            await (0, blob_1.del)(party.image.url);
        }
        return await this.prisma.party.update({
            where: {
                id: partId
            },
            data: {
                image: {
                    url
                }
            }
        });
    }
    async getInvitedParties(paginationDto, userId) {
        const { limit, page } = paginationDto;
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                location: true
            }
        });
        if (!currentUser) {
            throw new common_1.NotFoundException("User not found");
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                invitedParties: {
                    select: {
                        partyId: true,
                        party: {
                            include: {
                                location: {
                                    select: {
                                        id: true,
                                        name: true,
                                        latitude: true,
                                        longitude: true,
                                        timestamp: true,
                                        address: true
                                    }
                                },
                                consumables: true,
                                covers: true,
                                owner: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                },
                                members: {
                                    select: {
                                        userId: true,
                                        user: {
                                            select: {
                                                username: true,
                                                socialMedia: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {
                                                    take: 1
                                                },
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                                userType: true
                                            }
                                        }
                                    }
                                },
                                moderators: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                socialMedia: true,
                                                name: true,
                                                lastName: true,
                                                profilePictures: {
                                                    take: 1,
                                                    select: {
                                                        url: true,
                                                        id: true
                                                    }
                                                },
                                                verified: true,
                                                isCompany: true,
                                                gender: true,
                                                userType: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const totalGroups = user.invitedParties.length;
        const hasNextPage = page * limit < totalGroups;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            parties: user.invitedParties,
            hasNextPage,
            nextPage
        };
    }
    async getJoinRequests(userId) {
        return await this.prisma.partyMembershipRequest.findMany({
            where: {
                OR: [
                    {
                        party: {
                            ownerId: userId
                        }
                    },
                    {
                        party: {
                            moderators: {
                                some: {
                                    userId
                                }
                            }
                        }
                    }
                ],
                status: "PENDING"
            },
            include: {
                party: {
                    include: {
                        location: {
                            select: {
                                id: true,
                                name: true,
                                latitude: true,
                                longitude: true,
                                timestamp: true,
                                address: true
                            }
                        },
                        consumables: true,
                        covers: true,
                        owner: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1
                                }
                            }
                        },
                        members: {
                            select: {
                                userId: true,
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        },
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        username: true,
                        socialMedia: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                        userType: true
                    }
                },
                group: {
                    select: {
                        leader: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true
                            }
                        },
                        members: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        },
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async getPartyInvitations(userId) {
        const invitations = await this.prisma.partyInvitation.findMany({
            where: {
                invitedUserId: userId,
                status: "PENDING"
            },
            include: {
                party: {
                    include: Requests_1.PARTY_REQUEST
                },
                invitedUser: {
                    select: {
                        username: true,
                        socialMedia: true,
                        name: true,
                        lastName: true,
                        profilePictures: {
                            take: 1,
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        verified: true,
                        isCompany: true,
                        gender: true,
                        userType: true
                    }
                },
                group: {
                    include: {
                        leader: {
                            select: {
                                username: true,
                                socialMedia: true,
                                name: true,
                                lastName: true,
                                profilePictures: {
                                    take: 1,
                                    select: {
                                        url: true,
                                        id: true
                                    }
                                },
                                verified: true,
                                isCompany: true,
                                gender: true,
                                userType: true
                            }
                        },
                        members: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        },
                        moderators: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        socialMedia: true,
                                        name: true,
                                        lastName: true,
                                        profilePictures: {
                                            take: 1,
                                            select: {
                                                url: true,
                                                id: true
                                            }
                                        },
                                        verified: true,
                                        isCompany: true,
                                        gender: true,
                                        userType: true
                                    }
                                }
                            }
                        }
                    }
                },
                ticket: {
                    include: {
                        base: true
                    }
                }
            }
        });
        return invitations.map(inv => {
            const { party, invitedUser, group, invitedUserId } = inv;
            return {
                party,
                partyId: party?.id,
                user: invitedUser,
                userId: invitedUserId,
                group,
                groupId: group?.id
            };
        });
    }
    async getParty(partyId, userId) {
        return await this.prisma.party
            .findUnique({
            where: { id: partyId },
            include: Requests_1.PARTY_REQUEST
        })
            .then(async (party) => {
            if (!party) {
                throw new common_1.NotFoundException("Carrete no encontrado");
            }
            const currentUser = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    location: true
                }
            });
            if (!currentUser) {
                throw new common_1.NotFoundException("User not found");
            }
            party.distance = this.utils.haversineDistance(currentUser.location, party.location);
            return party;
        })
            .catch(() => {
            throw new common_1.NotFoundException("User not found");
        });
    }
    async leaveParty(partyId, userId) {
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId
            },
            include: {
                groups: {
                    include: {
                        group: {
                            select: {
                                id: true,
                                leaderId: true,
                                members: {
                                    select: {
                                        userId: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado");
        }
        if (party.ownerId === userId) {
            await this.prisma.partyInvitation.deleteMany({
                where: { partyId }
            });
            await this.prisma.partyMember.deleteMany({
                where: { partyId }
            });
            await this.prisma.partyMembershipRequest.deleteMany({
                where: { partyId }
            });
            await this.prisma.partyGroup.deleteMany({
                where: { partyId }
            });
            await this.prisma.ticketOwnership.deleteMany({
                where: {
                    partyId
                }
            });
            await this.prisma.party.delete({
                where: { id: partyId }
            });
            await (0, blob_1.del)(party.image.url);
            return true;
        }
        const isMember = await this.prisma.partyMember.findFirst({
            where: {
                partyId,
                userId: userId
            }
        });
        if (!isMember) {
            if (party.groups.some(partyGroup => partyGroup.group.members.some(member => member.userId === userId))) {
                if (party.groups.some(partyGroup => partyGroup.group.leaderId === userId)) {
                    const groups = party.groups.filter(partyGroup => partyGroup.group.leaderId === userId);
                    for (const group of groups) {
                        await this.prisma.partyGroup.delete({
                            where: {
                                partyId_groupId: {
                                    partyId,
                                    groupId: group.groupId
                                }
                            }
                        });
                    }
                }
                else {
                    throw new common_1.ForbiddenException("No eres el dueño de este grupo para salirte.");
                }
            }
            else {
                throw new common_1.ForbiddenException("Ya no formas parte de esta fiesta.");
            }
        }
        await this.prisma.partyInvitation
            .deleteMany({
            where: {
                partyId,
                OR: [{ invitedUserId: userId }, { invitingUserId: userId }]
            }
        })
            .catch(() => { });
        await this.prisma.partyMember
            .delete({
            where: {
                userId_partyId: {
                    partyId,
                    userId: userId
                }
            }
        })
            .catch(() => { });
        await this.prisma.partyMembershipRequest
            .deleteMany({
            where: {
                partyId,
                userId
            }
        })
            .catch(() => { });
        await this.prisma.ticketOwnership.deleteMany({
            where: {
                partyId,
                userId
            }
        });
        return true;
    }
    async inviteToParty(partyId, usernameDto, userId) {
        const { username } = usernameDto;
        const hasPermissions = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                OR: [
                    {
                        ownerId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!hasPermissions) {
            throw new common_1.BadRequestException("No tienes permisos para invitar.");
        }
        const invitedUser = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                expoPushToken: true
            }
        });
        if (!invitedUser) {
            throw new common_1.NotFoundException("No se encontró el usuario a invitar.");
        }
        const party = await this.prisma.party.findUnique({
            where: { id: partyId },
            select: {
                ownerId: true,
                id: true,
                name: true,
                type: true,
                moderators: {
                    select: {
                        userId: true
                    }
                },
                tickets: {
                    take: 1,
                    select: {
                        id: true
                    }
                }
            }
        });
        const defaultTicket = party.tickets[0];
        const invitation = await this.prisma.partyInvitation.create({
            data: {
                partyId,
                invitedUserId: invitedUser.id,
                invitingUserId: userId,
                ticketId: defaultTicket.id
            }
        });
        const inviter = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                socialMedia: true,
                name: true
            }
        });
        this.notifications.sendPartyInviteNotification(invitedUser.expoPushToken, inviter, party.name, party.id, party.type);
        return invitation;
    }
    async cancelInvitation(partyId, UsernameDto, userId) {
        const { username } = UsernameDto;
        const hasPermissions = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                OR: [
                    {
                        ownerId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!hasPermissions) {
            throw new common_1.BadRequestException("No tienes permisos para invitar.");
        }
        const invitedUser = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                expoPushToken: true
            }
        });
        if (!invitedUser) {
            throw new common_1.NotFoundException("No se encontró el usuario a cancelar la invitación.");
        }
        const invitation = await this.prisma.partyInvitation.findFirst({
            where: {
                partyId,
                invitedUserId: invitedUser.id
            }
        });
        if (invitation) {
            return this.prisma.partyInvitation.delete({
                where: { id: invitation.id }
            });
        }
        return false;
    }
    async acceptInvitation(partyId, userId) {
        const invitation = await this.prisma.partyInvitation.findFirst({
            where: {
                partyId,
                invitedUserId: userId
            },
            include: {
                ticket: true
            }
        });
        if (!invitation) {
            throw new common_1.NotFoundException("Invitación no encontrada");
        }
        await this.prisma.partyInvitation.delete({
            where: { id: invitation.id }
        });
        await this.prisma.partyMember.create({
            data: {
                partyId,
                userId: userId
            }
        });
        await this.prisma.ticketOwnership.create({
            data: {
                userId,
                ticketId: invitation.ticketId,
                partyId: invitation.partyId
            }
        });
        this.notifications.sendUserAcceptedPartyInvitationNotification(userId, partyId);
        return true;
    }
    async declineInvitation(partyId, userId) {
        const invitation = await this.prisma.partyInvitation.findFirst({
            where: {
                partyId,
                invitedUserId: userId
            }
        });
        if (invitation) {
            await this.prisma.partyInvitation.delete({
                where: { id: invitation.id }
            });
        }
        return true;
    }
    async acceptJoinRequest(partyId, userId, acceptJoinRequestDto) {
        const { type, userId: requesterUserId, groupId } = acceptJoinRequestDto;
        if (type !== "SOLO" && type !== "GROUP") {
            throw new common_1.BadRequestException("Invalid type");
        }
        if (type === "SOLO" && !requesterUserId) {
            throw new common_1.BadRequestException("Requester user id is required");
        }
        if (type === "GROUP" && !groupId) {
            throw new common_1.BadRequestException("Group id is required");
        }
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                OR: [
                    {
                        ownerId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            },
            include: {
                moderators: {
                    select: {
                        user: {
                            select: {
                                expoPushToken: true
                            }
                        }
                    }
                },
                tickets: {
                    take: 1,
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado");
        }
        if (type === "SOLO") {
            const joinRequest = await this.prisma.partyMembershipRequest.findFirst({
                where: {
                    partyId,
                    userId: requesterUserId
                }
            });
            if (!joinRequest) {
                throw new common_1.NotFoundException("Join request not found");
            }
            await this.prisma.partyMembershipRequest.update({
                where: {
                    id: joinRequest.id
                },
                data: {
                    status: "ACCEPTED"
                }
            });
            await this.prisma.partyMember.create({
                data: {
                    partyId,
                    userId: requesterUserId
                }
            });
            await this.prisma.ticketOwnership.create({
                data: {
                    userId: requesterUserId,
                    ticketId: party.tickets[0].id,
                    partyId: party.id
                }
            });
            this.notifications.sendPartyJoinAcceptedSoloNotification(requesterUserId, party);
        }
        else {
            const joinRequest = await this.prisma.partyMembershipRequest.findFirst({
                where: {
                    partyId,
                    groupId
                },
                include: {
                    group: {
                        select: {
                            members: {
                                select: {
                                    userId: true,
                                    user: {
                                        select: {
                                            expoPushToken: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (!joinRequest) {
                throw new common_1.NotFoundException("Join request not found");
            }
            await this.prisma.partyMembershipRequest.update({
                where: {
                    id: joinRequest.id
                },
                data: {
                    status: "ACCEPTED"
                }
            });
            await this.prisma.partyGroup.create({
                data: {
                    partyId,
                    groupId
                }
            });
            await this.prisma.ticketOwnership.create({
                data: {
                    groupId,
                    ticketId: party.tickets[0].id,
                    partyId
                }
            });
            this.notifications.sendPartyJoinAcceptedGroupNotification(groupId, party);
        }
        return true;
    }
    async joinUserOrGroupToParty(partyId, userId, ticketId, groupId) {
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId
            },
            include: {
                moderators: {
                    select: {
                        user: {
                            select: {
                                expoPushToken: true
                            }
                        }
                    }
                }
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado");
        }
        const ticket = await this.prisma.ticket.findUnique({
            where: {
                id: ticketId
            },
            select: {
                id: true
            }
        });
        if (!ticket) {
            throw new common_1.NotFoundException("No default ticket found");
        }
        if (!groupId) {
            await this.prisma.partyMember.create({
                data: {
                    partyId,
                    userId
                }
            });
            await this.prisma.ticketOwnership.create({
                data: {
                    userId,
                    ticketId,
                    partyId
                }
            });
            this.notifications.sendPartyJoinAcceptedSoloNotification(userId, party);
        }
        else {
            await this.prisma.partyGroup.create({
                data: {
                    partyId,
                    groupId
                }
            });
            await this.prisma.ticketOwnership.create({
                data: {
                    groupId,
                    ticketId,
                    partyId
                }
            });
            this.notifications.sendPartyJoinAcceptedGroupNotification(groupId, party);
        }
        return true;
    }
    async declineJoinRequest(partyId, userId, joinRequestDto) {
        const { userId: requesterUserId, groupId, type } = joinRequestDto;
        if (type !== "SOLO" && type !== "GROUP") {
            throw new common_1.BadRequestException("Invalid type");
        }
        if (type === "SOLO" && !requesterUserId) {
            throw new common_1.BadRequestException("Requester user id is required");
        }
        if (type === "GROUP" && !groupId) {
            throw new common_1.BadRequestException("Group id is required");
        }
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado");
        }
        const joinRequest = await this.prisma.partyMembershipRequest.findFirst({
            where: {
                partyId,
                OR: [
                    {
                        userId: requesterUserId
                    },
                    {
                        groupId
                    }
                ]
            }
        });
        if (!joinRequest) {
            throw new common_1.NotFoundException("Join request not found");
        }
        await this.prisma.partyMembershipRequest.update({
            where: {
                id: joinRequest.id
            },
            data: {
                status: "DECLINED"
            }
        });
        return true;
    }
    async cancelJoinRequest(partyId, userId) {
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado");
        }
        const joinRequest = await this.prisma.partyMembershipRequest.findFirst({
            where: {
                partyId,
                userId
            }
        });
        if (!joinRequest) {
            throw new common_1.NotFoundException("Join request not found");
        }
        await this.prisma.partyMembershipRequest.delete({
            where: {
                id: joinRequest.id
            }
        });
        return true;
    }
    async requestJoin(partyId, userId, optionalGroupIdDto) {
        const { groupId } = optionalGroupIdDto;
        const party = await this.prisma.party.findUnique({
            where: { id: partyId },
            include: {
                tickets: true
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Party no encontrado");
        }
        if (groupId) {
            const group = await this.prisma.group.count({
                where: { id: groupId }
            });
            if (group <= 0) {
                throw new common_1.NotFoundException("Grupo no encontrado");
            }
        }
        const isUserMember = await this.prisma.partyMember.findUnique({
            where: {
                userId_partyId: {
                    userId,
                    partyId
                }
            }
        });
        if (isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es miembro de este party");
        }
        if (groupId) {
            const isGroupMember = await this.prisma.partyGroup.findUnique({
                where: {
                    partyId_groupId: {
                        partyId,
                        groupId
                    }
                }
            });
            if (isGroupMember) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.METHOD_NOT_ALLOWED,
                    error: "El grupo ya es miembro de este carrete"
                }, common_1.HttpStatus.METHOD_NOT_ALLOWED);
            }
        }
        if (groupId) {
            const existingRequest = await this.prisma.partyMembershipRequest.findUnique({
                where: {
                    groupId_partyId: {
                        groupId,
                        partyId
                    }
                },
                select: {
                    status: true
                }
            });
            if (existingRequest) {
                if (existingRequest.status === "PENDING") {
                    throw new common_1.ForbiddenException("El grupo ya ha solicitado unirse al party");
                }
                if (existingRequest.status === "ACCEPTED") {
                    throw new common_1.ForbiddenException("El grupo ya es miembro de este party");
                }
            }
            await this.prisma.partyMembershipRequest.create({
                data: {
                    groupId,
                    partyId,
                    userId,
                    type: "GROUP"
                }
            });
        }
        else {
            const existingRequest = await this.prisma.partyMembershipRequest.findUnique({
                where: {
                    userId_partyId: {
                        userId,
                        partyId
                    }
                }
            });
            if (existingRequest) {
                throw new Error("Ya has solicitado unirte a este party");
            }
            await this.prisma.partyMembershipRequest.create({
                data: {
                    userId,
                    partyId,
                    type: "SOLO"
                }
            });
        }
        return true;
    }
    async deleteMember(partyId, usernameDto, userId) {
        const { username } = usernameDto;
        const group = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                OR: [
                    {
                        ownerId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!group) {
            throw new common_1.NotFoundException("Grupo no encontrado, o no tienes permisos");
        }
        const targetUser = await this.prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        if (!targetUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const isUserMember = await this.prisma.partyMember.delete({
            where: {
                userId_partyId: {
                    userId: targetUser.id,
                    partyId
                }
            }
        });
        if (!isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es miembro de este grupo");
        }
        await this.prisma.userPartyModerator.delete({
            where: {
                userId_partyId: {
                    userId: targetUser.id,
                    partyId
                }
            }
        });
        await this.prisma.partyMembershipRequest.deleteMany({
            where: {
                userId: targetUser.id,
                partyId
            }
        });
        await this.prisma.ticketOwnership.deleteMany({
            where: {
                userId: targetUser.id,
                partyId
            }
        });
    }
    async deleteGroupMember(partyId, groupIdDto, userId) {
        const { groupId } = groupIdDto;
        const group = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                OR: [
                    {
                        ownerId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!group) {
            throw new common_1.NotFoundException("Grupo no encontrado, o no tienes permisos");
        }
        await this.prisma.partyGroup.delete({
            where: {
                partyId_groupId: {
                    partyId,
                    groupId
                }
            }
        });
        await this.prisma.ticketOwnership.deleteMany({
            where: {
                groupId,
                partyId
            }
        });
        await this.prisma.partyMembershipRequest.deleteMany({
            where: {
                groupId,
                partyId
            }
        });
    }
    async deleteMod(partyId, usernameDto, userId) {
        const { username } = usernameDto;
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                OR: [
                    {
                        ownerId: userId
                    },
                    {
                        moderators: {
                            some: {
                                userId
                            }
                        }
                    }
                ]
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado, o no tienes permisos");
        }
        const targetUser = await this.prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        if (!targetUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const isUserMember = await this.prisma.userPartyModerator.delete({
            where: {
                userId_partyId: {
                    userId: targetUser.id,
                    partyId
                }
            }
        });
        if (!isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es miembro de este grupo");
        }
        await this.prisma.partyMembershipRequest.deleteMany({
            where: {
                userId: targetUser.id,
                partyId
            }
        });
    }
    async addMemberToModList(partyId, usernameDto, userId) {
        const { username } = usernameDto;
        const party = await this.prisma.party.findUnique({
            where: {
                id: partyId,
                ownerId: userId
            }
        });
        if (!party) {
            throw new common_1.NotFoundException("Carrete no encontrado, o no tienes permisos");
        }
        const targetUser = await this.prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        if (!targetUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const isUserMember = await this.prisma.userPartyModerator.create({
            data: {
                userId: targetUser.id,
                partyId
            }
        });
        if (!isUserMember) {
            throw new common_1.InternalServerErrorException("El usuario ya es mod de este grupo");
        }
    }
};
exports.PartyService = PartyService;
exports.PartyService = PartyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        notifications_service_1.NotificationsService])
], PartyService);
//# sourceMappingURL=party.service.js.map