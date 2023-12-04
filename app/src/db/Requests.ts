export const PARTY_REQUEST = {
    owner: {
        select: {
            username: true,
            name: true,
            lastName: true,
            profilePictures: {
                take: 1,
                select: {
                    url: true,
                    id: true,
                },
            },
            verified: true,
            isCompany: true,
            gender: true,
        },
    },
    moderators: {
        include: {
            user: {
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: {
                        take: 1,
                        select: {
                            url: true,
                            id: true,
                        },
                    },
                    verified: true,
                    isCompany: true,
                    gender: true,
                },
            },
        },
    },
    members: {
        include: {
            user: {
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: {
                        take: 1,
                        select: {
                            url: true,
                            id: true,
                        },
                    },
                    verified: true,
                    isCompany: true,
                    gender: true,
                },
            },
        },
    },
    invitations: {
        include: {
            invitingUser: {
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: {
                        take: 1,
                        select: {
                            url: true,
                            id: true,
                        },
                    },
                },
            },
            invitedUser: {
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: {
                        take: 1,
                        select: {
                            url: true,
                            id: true,
                        },
                    },
                },
            },
        },
    },
    membershipRequests: {
        include: {
            group: {
                select: {
                    leader: {
                        select: {
                            username: true,
                            name: true,
                            lastName: true,
                            profilePictures: {
                                take: 1,
                                select: {
                                    url: true,
                                    id: true,
                                },
                            },
                            verified: true,
                            isCompany: true,
                            gender: true,
                        },
                    },
                    members: {
                        include: {
                            user: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                        select: {
                                            url: true,
                                            id: true,
                                        },
                                    },
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                    moderators: {
                        include: {
                            user: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                        select: {
                                            url: true,
                                            id: true,
                                        },
                                    },
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                },
            },
            user: {
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: {
                        take: 1,
                        select: {
                            url: true,
                            id: true,
                        },
                    },
                    verified: true,
                    isCompany: true,
                    gender: true,
                },
            },
        },
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
                            name: true,
                            lastName: true,
                            profilePictures: {
                                take: 1,
                                select: {
                                    url: true,
                                    id: true,
                                },
                            },
                            verified: true,
                            isCompany: true,
                            gender: true,
                        },
                    },
                    members: {
                        include: {
                            user: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                        select: {
                                            url: true,
                                            id: true,
                                        },
                                    },
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                    moderators: {
                        include: {
                            user: {
                                select: {
                                    username: true,
                                    name: true,
                                    lastName: true,
                                    profilePictures: {
                                        take: 1,
                                        select: {
                                            url: true,
                                            id: true,
                                        },
                                    },
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
