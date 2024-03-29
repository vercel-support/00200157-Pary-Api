export const PARTY_REQUEST = {
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
	invitations: {
		include: {
			invitingUser: {
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
			}
		}
	},
	membershipRequests: {
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
	},
	groups: {
		include: {
			group: {
				include: {
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
							}
						}
					},
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
	}
};
