import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common";
import { del, put } from "@vercel/blob";
import { CreatePartyDto } from "app/src/party/dto/CreateParty.dto";
import { randomUUID } from "crypto";
import { PARTY_REQUEST } from "../../db/Requests";
import { PrismaService } from "../../db/services/prisma.service";
import { PaginationDto } from "../../group/dto/Pagination.dto";
import { NotificationsService } from "../../notifications/services/notifications.service";
import { UtilsService } from "../../utils/services/utils.service";
import { OptionalGroupIdDto } from "../dto/Group.dto";
import { JoinRequestDto } from "../dto/JoinRequestDto";
import { UpdatePartyDto } from "../dto/UpdateParty.dto";
import { UploadImageDto } from "../dto/UploadImageDto";
import { UsernameDto } from "../dto/User.dto";
import { FINTOC_SECRET_KEY } from "app/main";
import axios from "axios";
import { MultipartFile } from "@fastify/multipart";

@Injectable()
export class PartyService {
	constructor(
		private prisma: PrismaService,
		private utils: UtilsService,
		private notifications: NotificationsService
	) {}

	async createParty(partyBody: CreatePartyDto, userId: string) {
		const {
			name,
			description,
			location,
			date,
			type,
			tags,
			participants,
			image,
			showAddressInFeed,
			ageRange,
			consumables,
			covers,
			tickets
		} = partyBody;

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
			throw new NotFoundException("User not found");
		}

		if (inviter.parties.length >= 15 && inviter.userType === "Normal") {
			throw new BadRequestException("No puedes crear más de 15 carretes.");
		}

		// Resto de la lógica después de una carga exitosa

		const usersToInvite: string[] = participants;

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
								throw new BadRequestException("No tienes permisos para crear Carretes con Consumibles");
							}
							return { id: consumable.id };
						})
					},
					covers: {
						connect: covers.map(cover => {
							if (inviter.userType === "Normal") {
								throw new BadRequestException("No tienes permisos para crear Carretes con Covers");
							}
							return { id: cover.id };
						})
					},
					tickets: {
						connect: tickets.map(ticket => {
							if (inviter.userType === "Normal" && defaultTicket.id !== ticket.id) {
								throw new BadRequestException("No tienes permisos para crear Carretes con Tickets");
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
				throw new InternalServerErrorException("Error al crear el carrete.");
			});

		if (!party) {
			throw new InternalServerErrorException("Error creating party.");
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

		/* if (inviter.userType === "Enterprise") {
			// connect all the staff members of the inviter to the moderators of the party
			await this.prisma.party.update({
				where: {
					id: party.id
				},
				data: {
					moderators: {
						create: inviter.staffs.map(staff => ({ userId: staff.id }))
					}
				}
			});
		} */

		for (const user of users) {
			if (user.id === userId) continue;
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
						this.notifications.sendPartyInviteNotification(
							user.expoPushToken,
							inviter,
							party.name,
							party.id,
							party.type
						);
					}
				});
		}

		return party;
	}

	async updateParty(partyBody: UpdatePartyDto, userId: string) {
		const {
			id,
			name,
			description,
			location,
			date,
			type,
			tags,
			image,
			oldImage,
			showAddressInFeed,
			ageRange,
			consumables,
			covers,
			tickets
		} = partyBody;

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
			throw new NotFoundException("Carrete no encontrado");
		}

		if (currentParty.ownerId !== userId && !currentParty.moderators.some(mod => mod.userId === userId)) {
			throw new ForbiddenException("No tienes permisos para actualizar este carrete.");
		}

		const newConsumables = consumables.filter(
			consumable => !currentParty.consumables.some(c => c.id === consumable.id)
		);
		const newCovers = covers.filter(cover => !currentParty.covers.some(c => c.id === cover.id));
		const newTickets = tickets.filter(ticket => !currentParty.tickets.some(t => t.id === ticket.id));

		const consumablesToDelete = currentParty.consumables.filter(
			consumable => !consumables.some(c => c.id === consumable.id)
		);
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
				del(image.url);
			}
			throw new InternalServerErrorException("Error actualizando carrete.");
		}

		if (oldImage) {
			await del(oldImage.url);
		}

		return party;
	}

	async getOwnParties(paginationDto: PaginationDto, userId: string) {
		const { limit, page } = paginationDto;
		const skip = page * limit;
		const currentUser = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				location: true
			}
		});

		if (!currentUser) {
			throw new NotFoundException("User not found");
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
			include: PARTY_REQUEST,
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

		const partiesToReturn = await Promise.all(
			parties.map(async party => {
				const distance = this.utils.haversineDistance(currentUser.location, party.location);
				party.distance = distance;
				return party;
			})
		);

		const hasNextPage = page * limit < totalParties;
		const nextPage = hasNextPage ? page + 1 : null;

		return {
			parties: partiesToReturn,
			hasNextPage,
			nextPage
		};
	}

	async uploadPartyImage(image: MultipartFile) {
		if (!image) {
			throw new BadRequestException("Debe subir una imagen.");
		}

		const fileType = image.mimetype.split("/")[1];
		const uploadImageToVercel = async (retry = true) => {
			try {
				const { url } = await put(`${process.env.NODE_ENV}-party-${randomUUID()}.${fileType}`, image.file, {
					access: "public"
				}).catch(() => {
					throw new InternalServerErrorException("Error al guardar la imagen en la base de datos.");
				});

				if (!url || url === "") {
					throw new InternalServerErrorException("Error al guardar la imagen en la base de datos.");
				}
				return url;
			} catch (error) {
				if (retry) {
					return await uploadImageToVercel(false);
				}
				throw new InternalServerErrorException("Error al guardar la imagen en la base de datos.");
			}
		};
		return await uploadImageToVercel();
	}

	async replacePartyImage(partId: string, uploadImageDto: UploadImageDto, userId: string) {
		const { image } = uploadImageDto;

		if (!image) {
			throw new BadRequestException("Debe subir una imagen.");
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
			throw new NotFoundException("Carrete no encontrado / Not authorized.");
		}

		const imageBuffer = Buffer.from(image.split(",")[1], "base64");
		const fileType = image.match(/data:image\/(.*?);base64/)?.[1]; // obtiene el tipo de imagen (png, jpeg, etc.)

		const uploadImageToVercel = async (retry = true) => {
			try {
				const { url } = await put(`${process.env.NODE_ENV}-party-${randomUUID()}.${fileType}`, imageBuffer, {
					access: "public",
					contentType: `image/${fileType}`
				});

				if (!url || url === "") {
					throw new InternalServerErrorException("Error uploading image.");
				}

				return {
					url
				};
			} catch (error) {
				if (retry) {
					return await uploadImageToVercel(false);
				}
				throw new InternalServerErrorException("Error uploading image.");
			}
		};
		const { url } = await uploadImageToVercel();
		if (party.image.url) {
			await del(party.image.url);
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

	async getInvitedParties(paginationDto: PaginationDto, userId: string) {
		const { limit, page } = paginationDto;
		const currentUser = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				location: true
			}
		});

		if (!currentUser) {
			throw new NotFoundException("User not found");
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

	async getJoinRequests(userId: string) {
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

	async getPartyInvitations(userId: string) {
		const invitations = await this.prisma.partyInvitation.findMany({
			where: {
				invitedUserId: userId,
				status: "PENDING"
			},
			include: {
				party: {
					include: PARTY_REQUEST
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

	async getParty(partyId: string, userId: string) {
		return await this.prisma.party
			.findUnique({
				where: { id: partyId },
				include: PARTY_REQUEST
			})
			.then(async party => {
				if (!party) {
					throw new NotFoundException("Carrete no encontrado");
				}

				const currentUser = await this.prisma.user.findUnique({
					where: { id: userId },
					select: {
						location: true
					}
				});

				if (!currentUser) {
					throw new NotFoundException("User not found");
				}

				party.distance = this.utils.haversineDistance(currentUser.location, party.location);

				return party;
			})
			.catch(() => {
				throw new NotFoundException("User not found");
			});
	}

	async leaveParty(partyId: string, userId: string) {
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
			throw new NotFoundException("Carrete no encontrado");
		}

		// If the user is the owner of the group
		if (party.ownerId === userId) {
			// Delete all group invitations related to this group
			await this.prisma.partyInvitation.deleteMany({
				where: { partyId }
			});

			// Delete all group members
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

			// Delete the group itself
			await this.prisma.party.delete({
				where: { id: partyId }
			});

			await del(party.image.url);
			return true;
		}
		// If the user is not the owner but a member of the group
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
				} else {
					throw new ForbiddenException("No eres el dueño de este grupo para salirte.");
				}
			} else {
				throw new ForbiddenException("Ya no formas parte de esta fiesta.");
			}
		}

		// Delete all group invitations from and to the user related to this group
		await this.prisma.partyInvitation
			.deleteMany({
				where: {
					partyId,
					OR: [{ invitedUserId: userId }, { invitingUserId: userId }]
				}
			})
			.catch(() => {});

		// Remove the user from the group
		await this.prisma.partyMember
			.delete({
				where: {
					userId_partyId: {
						partyId,
						userId: userId
					}
				}
			})
			.catch(() => {});

		await this.prisma.partyMembershipRequest
			.deleteMany({
				where: {
					partyId,
					userId
				}
			})
			.catch(() => {});

		await this.prisma.ticketOwnership.deleteMany({
			where: {
				partyId,
				userId
			}
		});
		return true;
	}

	async inviteToParty(partyId: string, usernameDto: UsernameDto, userId: string) {
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
			throw new BadRequestException("No tienes permisos para invitar.");
		}

		const invitedUser = await this.prisma.user.findUnique({
			where: { username },
			select: {
				id: true,
				expoPushToken: true
			}
		});

		if (!invitedUser) {
			throw new NotFoundException("No se encontró el usuario a invitar.");
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

		this.notifications.sendPartyInviteNotification(
			invitedUser.expoPushToken,
			inviter,
			party.name,
			party.id,
			party.type
		);
		return invitation;
	}

	async cancelInvitation(partyId: string, UsernameDto: UsernameDto, userId: string) {
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
			throw new BadRequestException("No tienes permisos para invitar.");
		}
		const invitedUser = await this.prisma.user.findUnique({
			where: { username },
			select: {
				id: true,
				expoPushToken: true
			}
		});

		if (!invitedUser) {
			throw new NotFoundException("No se encontró el usuario a cancelar la invitación.");
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

	async acceptInvitation(partyId: string, userId: string) {
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
			throw new NotFoundException("Invitación no encontrada");
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

	async declineInvitation(partyId: string, userId: string) {
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

	async acceptJoinRequest(partyId: string, userId: string, acceptJoinRequestDto: JoinRequestDto) {
		const { type, userId: requesterUserId, groupId } = acceptJoinRequestDto;
		if (type !== "SOLO" && type !== "GROUP") {
			throw new BadRequestException("Invalid type");
		}
		if (type === "SOLO" && !requesterUserId) {
			throw new BadRequestException("Requester user id is required");
		}
		if (type === "GROUP" && !groupId) {
			throw new BadRequestException("Group id is required");
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
			throw new NotFoundException("Carrete no encontrado");
		}
		if (type === "SOLO") {
			const joinRequest = await this.prisma.partyMembershipRequest.findFirst({
				where: {
					partyId,
					userId: requesterUserId
				}
			});

			if (!joinRequest) {
				throw new NotFoundException("Join request not found");
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
		} else {
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
				throw new NotFoundException("Join request not found");
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

	async joinUserOrGroupToParty(partyId: string, userId: string, ticketId: string, groupId?: string) {
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
			throw new NotFoundException("Carrete no encontrado");
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
			throw new NotFoundException("No default ticket found");
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
		} else {
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

	async declineJoinRequest(partyId: string, userId: string, joinRequestDto: JoinRequestDto) {
		const { userId: requesterUserId, groupId, type } = joinRequestDto;
		if (type !== "SOLO" && type !== "GROUP") {
			throw new BadRequestException("Invalid type");
		}
		if (type === "SOLO" && !requesterUserId) {
			throw new BadRequestException("Requester user id is required");
		}
		if (type === "GROUP" && !groupId) {
			throw new BadRequestException("Group id is required");
		}
		const party = await this.prisma.party.findUnique({
			where: {
				id: partyId
			}
		});
		if (!party) {
			throw new NotFoundException("Carrete no encontrado");
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
			throw new NotFoundException("Join request not found");
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

	async cancelJoinRequest(partyId: string, userId: string) {
		const party = await this.prisma.party.findUnique({
			where: {
				id: partyId
			}
		});
		if (!party) {
			throw new NotFoundException("Carrete no encontrado");
		}

		const joinRequest = await this.prisma.partyMembershipRequest.findFirst({
			where: {
				partyId,
				userId
			}
		});

		if (!joinRequest) {
			throw new NotFoundException("Join request not found");
		}

		await this.prisma.partyMembershipRequest.delete({
			where: {
				id: joinRequest.id
			}
		});
		return true;
	}

	async requestJoin(partyId: string, userId: string, optionalGroupIdDto: OptionalGroupIdDto) {
		const { groupId } = optionalGroupIdDto;
		// Obtenemos la información del party.
		const party = await this.prisma.party.findUnique({
			where: { id: partyId },
			include: {
				tickets: true
			}
		});

		if (!party) {
			throw new NotFoundException("Party no encontrado");
		}

		// Chequear si el grupo existe si se proporciona un groupId.
		if (groupId) {
			const group = await this.prisma.group.count({
				where: { id: groupId }
			});

			if (group <= 0) {
				throw new NotFoundException("Grupo no encontrado");
			}
		}

		// Verificar si el usuario ya es un miembro del party.
		const isUserMember = await this.prisma.partyMember.findUnique({
			where: {
				userId_partyId: {
					userId,
					partyId
				}
			}
		});

		if (isUserMember) {
			throw new InternalServerErrorException("El usuario ya es miembro de este party");
		}

		// Verificar si el grupo ya es miembro del party.
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
				throw new HttpException(
					{
						status: HttpStatus.METHOD_NOT_ALLOWED,
						error: "El grupo ya es miembro de este carrete"
					},
					HttpStatus.METHOD_NOT_ALLOWED
				);
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
					throw new ForbiddenException("El grupo ya ha solicitado unirse al party");
				}
				if (existingRequest.status === "ACCEPTED") {
					throw new ForbiddenException("El grupo ya es miembro de este party");
				}
			}

			// Crear una solicitud para unirse al party.
			await this.prisma.partyMembershipRequest.create({
				data: {
					groupId,
					partyId,
					userId,
					type: "GROUP"
				}
			});
		} else {
			// Verificar si el usuario o grupo ya ha solicitado unirse al party.
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

	async deleteMember(partyId: string, usernameDto: UsernameDto, userId: string) {
		const { username } = usernameDto;
		// Obtenemos la información del group.
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
			throw new NotFoundException("Grupo no encontrado, o no tienes permisos");
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
			throw new NotFoundException("Usuario no encontrado");
		}

		// Verificar si el usuario ya es un miembro del grupo.
		const isUserMember = await this.prisma.partyMember.delete({
			where: {
				userId_partyId: {
					userId: targetUser.id,
					partyId
				}
			}
		});

		if (!isUserMember) {
			throw new InternalServerErrorException("El usuario ya es miembro de este grupo");
		}

		// Verificar si el usuario ya es un miembro del grupo.
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

	async deleteGroupMember(partyId: string, groupIdDto: OptionalGroupIdDto, userId: string) {
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
			throw new NotFoundException("Grupo no encontrado, o no tienes permisos");
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

	async deleteMod(partyId: string, usernameDto: UsernameDto, userId: string) {
		const { username } = usernameDto;
		// Obtenemos la información del group.
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
			throw new NotFoundException("Carrete no encontrado, o no tienes permisos");
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
			throw new NotFoundException("Usuario no encontrado");
		}

		// Verificar si el usuario ya es un miembro del grupo.
		const isUserMember = await this.prisma.userPartyModerator.delete({
			where: {
				userId_partyId: {
					userId: targetUser.id,
					partyId
				}
			}
		});

		if (!isUserMember) {
			throw new InternalServerErrorException("El usuario ya es miembro de este grupo");
		}

		await this.prisma.partyMembershipRequest.deleteMany({
			where: {
				userId: targetUser.id,
				partyId
			}
		});
	}

	async addMemberToModList(partyId: string, usernameDto: UsernameDto, userId: string) {
		const { username } = usernameDto;
		// Obtenemos la información del group.
		const party = await this.prisma.party.findUnique({
			where: {
				id: partyId,
				ownerId: userId
			}
		});

		if (!party) {
			throw new NotFoundException("Carrete no encontrado, o no tienes permisos");
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
			throw new NotFoundException("Usuario no encontrado");
		}

		// Verificar si el usuario ya es un miembro del grupo.
		const isUserMember = await this.prisma.userPartyModerator.create({
			data: {
				userId: targetUser.id,
				partyId
			}
		});

		if (!isUserMember) {
			throw new InternalServerErrorException("El usuario ya es mod de este grupo");
		}
	}
}
