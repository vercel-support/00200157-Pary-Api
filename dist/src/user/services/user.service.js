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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
const blob_1 = require("@vercel/blob");
const pusher_service_1 = require("../../pusher/services/pusher.service");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../db/services/prisma.service");
const notifications_service_1 = require("../../notifications/services/notifications.service");
const utils_service_1 = require("../../utils/services/utils.service");
let UserService = class UserService {
    constructor(prisma, utils, notifications, pusherService) {
        this.prisma = prisma;
        this.utils = utils;
        this.notifications = notifications;
        this.pusherService = pusherService;
    }
    async checkUsername(username) {
        return this.prisma.user
            .findUnique({
            where: {
                username
            },
            select: {
                username: true
            }
        })
            .then(user => {
            return !user;
        });
    }
    async updateUser(user, userId) {
        const { username, name, lastName, phoneNumber, gender, description, birthDate, interests, location, isCompany, expoPushToken, socialMedia } = user;
        const { locationId } = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                locationId: true
            }
        });
        await this.prisma.location.update({
            where: {
                id: locationId
            },
            data: {
                latitude: location.latitude,
                longitude: location.longitude,
                name: location.name,
                timestamp: location.timestamp,
                address: location.address
            }
        });
        return this.prisma.user
            .update({
            where: { id: userId },
            data: {
                username,
                name,
                lastName,
                gender,
                signedIn: true,
                interests,
                description,
                birthDate,
                phoneNumber,
                isCompany,
                expoPushToken: expoPushToken ?? "",
                socialMedia
            },
            include: this.utils.getUserFields()
        })
            .catch(error => {
            if (error instanceof library_1.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new common_1.InternalServerErrorException("El nombre de usuario ya está en uso.");
            }
            throw new common_1.InternalServerErrorException("Error al actualizar el usuario.");
        });
    }
    async getBasicUserInfo(username) {
        return this.prisma.user
            .findUnique({
            where: { username },
            select: {
                username: true,
                socialMedia: true,
                name: true,
                lastName: true,
                profilePictures: true,
                description: true,
                birthDate: true,
                gender: true,
                interests: true,
                userType: true,
                verified: true,
                location: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                lastLogin: true,
                isCompany: true,
                followingUserList: true,
                followerUserList: true,
                parties: {
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
                invitedParties: {
                    select: {
                        partyId: true,
                        party: {
                            select: {
                                name: true,
                                description: true,
                                owner: {
                                    select: {
                                        username: true,
                                        socialMedia: true
                                    }
                                }
                            }
                        }
                    }
                },
                invitingParties: {
                    select: {
                        partyId: true,
                        party: {
                            select: {
                                name: true,
                                description: true,
                                owner: {
                                    select: {
                                        username: true,
                                        socialMedia: true
                                    }
                                }
                            }
                        }
                    }
                },
                ownedParties: {
                    select: {
                        id: true
                    }
                },
                partiesModerating: {
                    select: {
                        partyId: true
                    }
                },
                groupsModerating: {
                    select: {
                        groupId: true
                    }
                },
                groups: {
                    select: {
                        groupId: true,
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
                                    select: {
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
                },
                invitedGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true
                            }
                        }
                    }
                },
                invitingGroups: {
                    select: {
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                description: true,
                                leaderId: true
                            }
                        }
                    }
                }
            }
        })
            .catch(() => {
            throw new common_1.InternalServerErrorException("Error fetching user data.");
        });
    }
    async uploadProfilePicture(image, userId) {
        if (!image) {
            throw new common_1.InternalServerErrorException("Debe proporcionar una imagen.");
        }
        const fileType = image.mimetype.split("/")[1];
        const uploadImageToVercel = async (retry = true) => {
            try {
                const { url } = await (0, blob_1.put)(`${process.env.NODE_ENV}-profile-picture-${(0, crypto_1.randomUUID)()}.${fileType}`, image.file, {
                    access: "public"
                }).catch(() => {
                    throw new common_1.InternalServerErrorException("Error al guardar la imagen en la base de datos.");
                });
                if (!url || url === "") {
                    throw new common_1.InternalServerErrorException("Error al guardar la imagen en la base de datos.");
                }
                return await this.prisma.profilePicture
                    .create({
                    data: {
                        url,
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                })
                    .catch(() => {
                    throw new common_1.InternalServerErrorException("Error al guardar la imagen en la base de datos.");
                })
                    .then(async (profilePicture) => {
                    if ("id" in profilePicture && "url" in profilePicture && "userId" in profilePicture) {
                        const user = await this.prisma.user
                            .findUnique({
                            where: { id: userId },
                            select: {
                                profilePictures: true
                            }
                        })
                            .catch(() => {
                            throw new common_1.InternalServerErrorException("Error updating user.");
                        })
                            .then(user => user);
                        if (user && "profilePictures" in user && user.profilePictures) {
                            const profilePictures = [...user.profilePictures];
                            profilePictures.push(profilePicture);
                            return await this.prisma.user
                                .update({
                                where: { id: userId },
                                data: {
                                    profilePictures: {
                                        set: profilePictures
                                    }
                                },
                                include: {
                                    profilePictures: true
                                }
                            })
                                .catch(() => {
                                throw new common_1.InternalServerErrorException("Error al agregar la imagen al usuario.");
                            })
                                .then(async (updatedUser) => {
                                if ("id" in updatedUser) {
                                    return profilePicture;
                                }
                                throw new common_1.InternalServerErrorException("Error al obtener las imágenes del usuario 2.");
                            });
                        }
                        throw new common_1.InternalServerErrorException("Error al obtener las imágenes del usuario.");
                    }
                    throw new common_1.InternalServerErrorException("Error al obtener las imágenes del usuario.");
                });
            }
            catch (error) {
                if (retry) {
                    await uploadImageToVercel(false);
                }
                else {
                    throw new common_1.InternalServerErrorException("Error al guardar la imagen en la base de datos.");
                }
            }
        };
        return await uploadImageToVercel();
    }
    async uploadConsumablemage(image) {
        if (!image) {
            throw new common_1.InternalServerErrorException("Debe proporcionar una imagen.");
        }
        const fileType = image.mimetype.split("/")[1];
        const uploadImageToVercel = async (retry = true) => {
            try {
                const { url } = await (0, blob_1.put)(`${process.env.NODE_ENV}-consumable-picture-${(0, crypto_1.randomUUID)()}.${fileType}`, image.file, {
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
    async removeConsumableImage(consumableId, userId) {
        const consumable = await this.prisma.consumableItem.findFirst({
            where: {
                creatorId: userId,
                id: consumableId
            }
        });
        if (!consumable) {
            throw new common_1.InternalServerErrorException("No tienes permiso para eliminar esta imagen.");
        }
        await (0, blob_1.del)(consumable.pictureUrl).catch(() => {
            throw new common_1.InternalServerErrorException("Error al eliminar la imagen.");
        });
        return true;
    }
    async deleteProfilePicture(deleteUserProfilePictureDto, userId) {
        const { url, id } = deleteUserProfilePictureDto;
        await (0, blob_1.del)(url);
        await this.prisma.profilePicture
            .delete({
            where: {
                id
            }
        })
            .catch(() => {
            throw new common_1.InternalServerErrorException("Error al eliminar la imagen de la base de datos.");
        });
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: this.utils.getUserFields()
        });
    }
    async followUser(followedUsername, followerUserId) {
        const followedUser = await this.prisma.user.findUnique({
            where: { username: followedUsername },
            select: {
                id: true,
                expoPushToken: true,
                username: true,
                socialMedia: true
            }
        });
        const followerUsername = await this.prisma.user.findUnique({
            where: { id: followerUserId },
            select: {
                username: true,
                socialMedia: true
            }
        });
        if (!followedUser) {
            throw new common_1.NotFoundException("User not found.");
        }
        const followedUserId = followedUser.id;
        const expoPushToken = followedUser.expoPushToken;
        const existingRelation = await this.prisma.userFollows.findUnique({
            where: {
                followerUserId_followedUserId: {
                    followerUserId,
                    followedUserId
                }
            }
        });
        if (existingRelation) {
            throw new common_1.InternalServerErrorException("You are already following this user.");
        }
        return await this.prisma.userFollows
            .create({
            data: {
                followerUserId,
                followedUserId,
                followerUsername: followedUsername,
                followedUsername: followerUsername?.username || "",
                followDate: new Date()
            }
        })
            .catch(() => {
            throw new common_1.InternalServerErrorException("Error following user.");
        })
            .then(() => {
            this.notifications.sendNewFollowerNotification(expoPushToken, followerUserId);
            return true;
        });
    }
    async unFollowUser(unFollowedUsername, followerUserId) {
        const unFollowedUser = await this.prisma.user.findUnique({
            where: { username: unFollowedUsername }
        });
        if (!unFollowedUser) {
            throw new common_1.NotFoundException("User not found.");
        }
        const followedUserId = unFollowedUser.id;
        const existingRelation = await this.prisma.userFollows.findUnique({
            where: {
                followerUserId_followedUserId: {
                    followerUserId,
                    followedUserId
                }
            }
        });
        if (!existingRelation) {
            throw new common_1.InternalServerErrorException("You are not following this user.");
        }
        return await this.prisma.userFollows
            .delete({
            where: {
                followerUserId_followedUserId: {
                    followerUserId,
                    followedUserId
                }
            }
        })
            .catch(() => {
            throw new common_1.InternalServerErrorException("Error un following user.");
        })
            .then(() => true);
    }
    async getFollowerUserInfo(username) {
        return await this.prisma.user.findUnique({
            where: {
                signedIn: true,
                username
            },
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
                description: true,
                birthDate: true,
                gender: true,
                interests: true,
                userType: true,
                verified: true,
                location: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                lastLogin: true,
                isCompany: true
            }
        });
    }
    async searchUsers(searchDto) {
        const { search, page, limit } = searchDto;
        const skip = page * limit;
        return await this.prisma.user.findMany({
            skip: skip,
            take: limit,
            where: {
                signedIn: true,
                OR: [
                    { username: { contains: search, mode: "insensitive" } },
                    { name: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } }
                ]
            },
            orderBy: [{ isCompany: "desc" }, { verified: "desc" }, { username: "desc" }],
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
                description: true,
                birthDate: true,
                gender: true,
                interests: true,
                userType: true,
                verified: true,
                location: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                lastLogin: true,
                isCompany: true
            }
        });
    }
    async getUserById(id) {
        return this.prisma.user.findFirst({
            where: { id },
            include: this.utils.getUserFields()
        });
    }
    async purgeUserById(id) {
        const user = await this.prisma.user.findFirst({
            where: { id },
            include: {
                profilePictures: true,
                parties: true,
                groups: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        for (const profilePicture of user.profilePictures) {
            await (0, blob_1.del)(profilePicture.url);
            await this.prisma.profilePicture.delete({
                where: { id: profilePicture.id }
            });
        }
        await this.prisma.partyMember.deleteMany({ where: { userId: id } });
        await this.prisma.groupMember.deleteMany({ where: { userId: id } });
        await this.prisma.userFollows.deleteMany({ where: { followerUserId: id } });
        await this.prisma.userFollows.deleteMany({ where: { followedUserId: id } });
        await this.prisma.partyInvitation.deleteMany({
            where: { invitingUserId: id }
        });
        await this.prisma.partyInvitation.deleteMany({
            where: { invitedUserId: id }
        });
        await this.prisma.groupInvitation.deleteMany({
            where: { invitingUserId: id }
        });
        await this.prisma.groupInvitation.deleteMany({
            where: { invitedUserId: id }
        });
        await this.prisma.partyMembershipRequest.deleteMany({ where: { userId: id } });
        await this.prisma.groupMembershipRequest.deleteMany({ where: { userId: id } });
        await this.prisma.userPartyModerator.deleteMany({ where: { userId: id } });
        await this.prisma.userGroupModerator.deleteMany({ where: { userId: id } });
        const ownedParties = await this.prisma.party.findMany({
            where: { ownerId: id }
        });
        for (const party of ownedParties) {
            await this.prisma.partyGroup.deleteMany({ where: { partyId: party.id } });
            await this.prisma.partyInvitation.deleteMany({
                where: { partyId: party.id }
            });
            await this.prisma.partyMembershipRequest.deleteMany({
                where: { partyId: party.id }
            });
        }
        for (const party of ownedParties) {
            await this.prisma.ticketOwnership.deleteMany({
                where: { partyId: party.id }
            });
            await this.prisma.party.deleteMany({ where: { id: party.id } });
            await (0, blob_1.del)(party.image.url);
        }
        const ledGroups = await this.prisma.group.findMany({
            where: { leaderId: id }
        });
        for (const group of ledGroups) {
            await this.prisma.partyGroup.deleteMany({ where: { groupId: group.id } });
            await this.prisma.groupInvitation.deleteMany({
                where: { groupId: group.id }
            });
            await this.prisma.groupMembershipRequest.deleteMany({
                where: { groupId: group.id }
            });
        }
        const ticketOwnerships = await this.prisma.ticketOwnership.findMany({
            where: { userId: id }
        });
        for (const ticketOwnership of ticketOwnerships) {
            await this.prisma.ticketOwnership.delete({ where: { id: ticketOwnership.id } });
        }
        const tickets = await this.prisma.ticket.findMany({
            where: { creatorId: id }
        });
        for (const ticket of tickets) {
            await this.prisma.ticket.delete({ where: { id: ticket.id } });
        }
        const ticketBases = await this.prisma.ticketBase.findMany({
            where: { creatorId: id },
            include: {
                tickets: true
            }
        });
        for (const ticketBase of ticketBases) {
            await this.prisma.ticketBase.delete({ where: { id: ticketBase.id } });
        }
        for (const group of ledGroups) {
            await this.prisma.group.deleteMany({ where: { id: group.id } });
        }
        await this.prisma.user.delete({ where: { id } });
        return true;
    }
    async updateAndGetUserById(id, location, expoPushToken) {
        await this.prisma.location.update({
            where: {
                id: location.id
            },
            data: {
                latitude: location.latitude,
                longitude: location.longitude,
                name: location.name,
                timestamp: location.timestamp,
                address: location.address
            }
        });
        return this.prisma.user.update({
            where: { id },
            data: {
                expoPushToken
            },
            include: this.utils.getUserFields()
        });
    }
    async createConsumable(createConsumableItemDto, userId) {
        const { item, tags, stock, brand, weightOrVolume, price } = createConsumableItemDto;
        const { name, description, pictureUrl, type } = item;
        return this.prisma.consumable.create({
            data: {
                brand,
                stock,
                price,
                tags,
                weightOrVolume,
                creator: {
                    connect: {
                        id: userId
                    }
                },
                item: {
                    connectOrCreate: {
                        where: {
                            id: item.id
                        },
                        create: {
                            name,
                            description,
                            pictureUrl,
                            type
                        }
                    }
                }
            }
        });
    }
    async updateConsumable(createConsumableItemDto, userId) {
        const { id, item, tags, stock, brand, weightOrVolume, price } = createConsumableItemDto;
        const { id: itemId } = item;
        return this.prisma.consumable.update({
            where: {
                id,
                creatorId: userId
            },
            data: {
                brand,
                stock,
                price,
                tags,
                weightOrVolume,
                item: {
                    connect: {
                        id: itemId
                    }
                }
            }
        });
    }
    async getConsumables(userId) {
        return this.prisma.consumable.findMany({
            include: {
                item: true
            },
            where: {
                creatorId: userId
            }
        });
    }
    async getConsumableItems(userId) {
        return this.prisma.consumableItem.findMany({
            where: {
                creatorId: userId
            }
        });
    }
    async createConsumableItem(createConsumableItemDto, userId) {
        const { name, description, pictureUrl, type } = createConsumableItemDto;
        return this.prisma.consumableItem.create({
            data: {
                creator: {
                    connect: {
                        id: userId
                    }
                },
                name,
                description,
                pictureUrl,
                type
            }
        });
    }
    async deleteConsumableItem(itemId, userId) {
        const consumableItem = await this.prisma.consumableItem.findUnique({
            where: {
                id: itemId,
                creatorId: userId
            }
        });
        if (!consumableItem) {
            throw new common_1.NotFoundException("Consumable item not found.");
        }
        const consumables = await this.prisma.consumable.count({
            where: {
                itemId
            }
        });
        if (consumables > 0) {
            throw new common_1.InternalServerErrorException("Este item está relacionado a un ticket, no puedes borrarlo.");
        }
        await this.prisma.consumableItem.delete({
            where: {
                id: itemId
            }
        });
        await (0, blob_1.del)(consumableItem.pictureUrl);
        return true;
    }
    async updateConsumableItem(createConsumableItemDto, userId) {
        const { id, name, description, pictureUrl, type } = createConsumableItemDto;
        return this.prisma.consumableItem.update({
            where: {
                id,
                creatorId: userId
            },
            data: {
                name,
                description,
                pictureUrl,
                type
            }
        });
    }
    async createTicket(createTicketDto, userId) {
        const { base, tags, stock, price, color, consumables, payInDoor } = createTicketDto;
        const { name, description, type, id } = base;
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                userType: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("Usuario no encontrado.");
        }
        if (consumables.length > 0 && user.userType === "Normal") {
            throw new common_1.InternalServerErrorException("No puedes crear tickets con consumibles, tienes que tener una cuenta de empresa.");
        }
        const ticketData = {
            stock,
            tags,
            price,
            color,
            payInDoor,
            creator: {
                connect: {
                    id: userId
                }
            },
            base: {
                connectOrCreate: {
                    where: {
                        id
                    },
                    create: {
                        name,
                        description,
                        type,
                        creator: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                }
            }
        };
        if (consumables.length > 0) {
            ticketData["consumables"] = {
                createMany: {
                    data: consumables.map(consumable => ({
                        quantity: consumable.quantity,
                        consumableId: consumable.consumable.id
                    }))
                }
            };
        }
        console.log("Creando ticket:", createTicketDto, userId);
        return this.prisma.ticket.create({
            data: ticketData
        });
    }
    async updateTicket(updateTicketDto, userId) {
        const { base, tags, stock, price, id, color, consumables } = updateTicketDto;
        const { id: baseId } = base;
        const ticket = await this.prisma.ticket.findUnique({
            where: {
                id,
                creatorId: userId
            },
            include: {
                consumables: true
            }
        });
        if (!ticket) {
            throw new common_1.NotFoundException("Ticket no encontrado.");
        }
        const consumablesToDelete = ticket.consumables.filter(consumable => {
            return !consumables.some(consumable2 => consumable2.id === consumable.id);
        });
        const consumablesToCreate = consumables.filter(consumable => {
            return !ticket.consumables.some(consumable2 => consumable2.id === consumable.id);
        });
        return this.prisma.ticket.update({
            where: {
                id,
                creatorId: userId
            },
            data: {
                stock,
                price,
                tags,
                color,
                base: {
                    connect: {
                        id: baseId
                    }
                },
                consumables: {
                    updateMany: consumables.map(consumable => ({
                        where: {
                            id: consumable.id
                        },
                        data: {
                            quantity: consumable.quantity
                        }
                    })),
                    delete: consumablesToDelete.map(({ id }) => ({
                        id
                    })),
                    connectOrCreate: consumablesToCreate.map(consumable => ({
                        where: {
                            id: consumable.id
                        },
                        create: {
                            quantity: consumable.quantity,
                            consumableId: consumable.consumable.id
                        }
                    }))
                }
            }
        });
    }
    async deleteTicket(ticketId, userId) {
        const ticket = await this.prisma.ticket.findUnique({
            where: {
                id: ticketId,
                creatorId: userId
            }
        });
        if (!ticket) {
            throw new common_1.NotFoundException("Ticket base no encontrado.");
        }
        const ticketOwnerships = await this.prisma.ticketOwnership.count({
            where: {
                ticketId: ticketId
            }
        });
        if (ticketOwnerships > 0) {
            throw new common_1.InternalServerErrorException("Hay usuarios que tienen asignado este ticket, no puedes borrarlo.");
        }
        const ticketRelatedToParties = await this.prisma.party.findMany({
            where: {
                tickets: {
                    some: {
                        id: ticketId
                    }
                }
            }
        });
        if (ticketRelatedToParties.length > 0) {
            throw new common_1.InternalServerErrorException("Este ticket está relacionado a un carrete, no puedes borrarlo.");
        }
        await this.prisma.ticket.delete({
            where: {
                id: ticketId
            }
        });
        return true;
    }
    async getTickets(userId) {
        return this.prisma.ticket.findMany({
            include: {
                base: true,
                consumables: {
                    include: {
                        consumable: {
                            include: {
                                item: true
                            }
                        }
                    }
                }
            },
            where: {
                OR: [
                    {
                        creatorId: userId
                    },
                    {
                        creator: {
                            staffs: {
                                some: {
                                    id: userId
                                }
                            }
                        }
                    }
                ]
            }
        });
    }
    async getTicketBases(userId) {
        return this.prisma.ticketBase.findMany({
            where: {
                creatorId: userId
            }
        });
    }
    async createTicketBase(createTicketBaseDto, userId) {
        const { name, description, type } = createTicketBaseDto;
        return this.prisma.ticketBase.create({
            data: {
                creator: {
                    connect: {
                        id: userId
                    }
                },
                name,
                description,
                type
            }
        });
    }
    async deleteTicketBase(ticketId, userId) {
        const ticketBase = await this.prisma.ticketBase.findUnique({
            where: {
                id: ticketId,
                creatorId: userId
            }
        });
        if (!ticketBase) {
            throw new common_1.NotFoundException("Ticket base no encontrado.");
        }
        const tickets = await this.prisma.ticket.count({
            where: {
                baseId: ticketId
            }
        });
        if (tickets > 0) {
            throw new common_1.InternalServerErrorException("Este ticket base está relacionado a un ticket, no puedes borrarlo.");
        }
        await this.prisma.ticketBase.delete({
            where: {
                id: ticketId
            }
        });
        return true;
    }
    async updateTicketBase(updateTicketBaseDto, userId) {
        const { name, description, type, id } = updateTicketBaseDto;
        return this.prisma.ticketBase.update({
            where: {
                id,
                creatorId: userId
            },
            data: {
                name,
                description,
                type
            }
        });
    }
    async sendMessageToChatRoom(chatRoom, userId) {
        for (const message of chatRoom.messages) {
            await this.prisma.message.create({
                data: {
                    id: message._id,
                    chatId: chatRoom.chatId,
                    userId,
                    username: message.user.username,
                    text: message.text,
                    createdAt: message.createdAt,
                    image: message.image,
                    video: message.video,
                    system: message.system,
                    received: message.received,
                    sent: true,
                    pending: false,
                    avatar: message.user.avatar
                }
            });
        }
        return await this.pusherService.trigger(`chat-${chatRoom.chatId}`, "new-messages", { ...chatRoom, userId });
    }
    async requestMessagesFromLastMessageId(chatId, lastTimeChecked) {
        const cleanedDate = lastTimeChecked ? lastTimeChecked.replace(" 00:00", "") : "2021-01-01";
        const parsedDate = new Date(cleanedDate);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format");
        }
        const messages = await this.prisma.message.findMany({
            where: {
                chatId: chatId,
                createdAt: {
                    gt: parsedDate
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        console.log(messages);
        return messages.map(message => {
            return {
                _id: message.id,
                createdAt: message.createdAt,
                image: message.image,
                received: true,
                sent: true,
                system: message.system,
                text: message.text,
                user: {
                    _id: message.userId,
                    username: message.username,
                    avatar: message.avatar
                },
                video: message.video
            };
        });
    }
    async createChatRoom(username, userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                username
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        let chat = await this.prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        id: {
                            in: [userId, user.id]
                        }
                    }
                }
            }
        });
        if (chat) {
            return chat.id;
        }
        chat = await this.prisma.chat.create({
            data: {
                users: {
                    connect: [
                        {
                            id: userId
                        },
                        {
                            id: user.id
                        }
                    ]
                }
            }
        });
        return chat.id;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        notifications_service_1.NotificationsService,
        pusher_service_1.PusherService])
], UserService);
//# sourceMappingURL=user.service.js.map