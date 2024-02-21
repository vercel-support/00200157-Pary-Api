import { Injectable } from "@nestjs/common";
import { Location } from "app/types";
import * as qrcode from "qrcode";
import * as crypto from "crypto";

@Injectable()
export class UtilsService {
	haversineDistance(location1: Location, location2: Location): number {
		const R = 6371; // Radio de la Tierra en kilómetros
		const lat1 = (location1.latitude * Math.PI) / 180; // Convertir a radianes
		const lat2 = (location2.latitude * Math.PI) / 180; // Convertir a radianes
		const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180; // Convertir a radianes
		const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180; // Convertir a radianes

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;

		return distance;
	}

	extractToken(bearerToken: string): string {
		return bearerToken.split(" ")[1];
	}

	async generateQrCodeData(...data: any[]) {
		return await qrcode.toDataURL(JSON.stringify(data));
	}

	getUserFields() {
		return {
			profilePictures: true,
			followerUserList: true,
			followingUserList: true,
			tickets: {
				include: {
					ticket: {
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
						}
					},
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
			},
			ticketsCreated: true,
			ticketsBase: true,
			location: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							tickets: {
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
								}
							},
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
								select: {
									userId: true,
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
			invitedParties: {
				select: {
					partyId: true,
					status: true,
					party: {
						select: {
							name: true,
							description: true,
							image: true,
							id: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							date: true,
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
			ownedParties: {
				select: {
					name: true,
					description: true,
					image: true,
					id: true,
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
					date: true,
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
			partiesModerating: {
				select: {
					partyId: true,
					party: {
						select: {
							name: true,
							description: true,
							image: true,
							id: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							date: true,
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
							},
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
											consumables: {
												include: {
													item: true
												}
											},
											covers: {
												include: {
													item: true
												}
											},
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
												select: {
													userId: true,
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
					}
				}
			},
			invitedGroups: {
				select: {
					groupId: true,
					status: true,
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
									userId: true,
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
			},
			partyMembershipRequests: {
				include: {
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
					party: {
						select: {
							name: true,
							description: true,
							image: true,
							id: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							date: true,
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
					}
				}
			},
			groupMembershipRequests: {
				include: {
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
		};
	}

	getSafePersonalUserFields() {
		return {
			id: true,
			assignedGoogleID: true,
			username: true,
			email: true,
			password: false,
			name: true,
			lastName: true,
			signedIn: true,
			socialMedia: true,
			accessToken: true,
			refreshToken: true,
			gender: true,
			userType: true,
			description: true,
			birthDate: true,
			interests: true,
			verified: true,
			phoneNumber: true,
			locationId: true,
			createdAt: true,
			lastLogin: true,
			isCompany: true,
			expoPushToken: true,
			webSocketId: true,
			verifiedEmail: true,
			profilePictures: true,
			followerUserList: true,
			followingUserList: true,
			tickets: {
				include: {
					ticket: {
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
					}
				}
			},
			ticketsCreated: true,
			ticketsBase: true,
			location: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							tickets: {
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
								}
							},
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
								select: {
									userId: true,
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
			invitedParties: {
				select: {
					partyId: true,
					status: true,
					party: {
						select: {
							name: true,
							description: true,
							image: true,
							id: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							date: true,
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
			ownedParties: {
				select: {
					name: true,
					description: true,
					image: true,
					id: true,
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
					date: true,
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
			partiesModerating: {
				select: {
					partyId: true,
					party: {
						select: {
							name: true,
							description: true,
							image: true,
							id: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							date: true,
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
							},
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
											consumables: {
												include: {
													item: true
												}
											},
											covers: {
												include: {
													item: true
												}
											},
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
												select: {
													userId: true,
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
					}
				}
			},
			invitedGroups: {
				select: {
					groupId: true,
					status: true,
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
									userId: true,
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
			},
			partyMembershipRequests: {
				include: {
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
					party: {
						select: {
							name: true,
							description: true,
							image: true,
							id: true,
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
							consumables: {
								include: {
									item: true
								}
							},
							covers: {
								include: {
									item: true
								}
							},
							date: true,
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
					}
				}
			},
			groupMembershipRequests: {
				include: {
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
		};
	}

	calculateAge(birthday: Date): number {
		const ageDifMs = Date.now() - birthday.getTime();
		const ageDate = new Date(ageDifMs);

		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	generatePassword = (length = 6, characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") =>
		Array.from(crypto.randomFillSync(new Uint8Array(length)))
			.map(x => characters[x % characters.length])
			.join("");
}
