"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARTY_REQUEST = void 0;
exports.PARTY_REQUEST = {
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
                select: {
                    id: true,
                    leaderId: true,
                    name: true,
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
//# sourceMappingURL=Requests.js.map