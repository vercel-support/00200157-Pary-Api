export const PARTY_REQUEST  = {
    owner: {
        select: {
            username: true,
            name: true,
            lastName: true,
            profilePictures: {take: 1},
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
                    profilePictures: {take: 1},
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
                    profilePictures: {take: 1},
                    verified: true,
                    isCompany: true,
                    gender: true,
                },
            },
        },
    },
    invitations: {
        include: {
            invitedUser: {
                select: {
                    username: true,
                    name: true,
                    lastName: true,
                    profilePictures: {take: 1},
                    verified: true,
                    isCompany: true,
                    gender: true,
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
                            profilePictures: {take: 1},
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
                                    profilePictures: {take: 1},
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
                                    profilePictures: {take: 1},
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
                    profilePictures: {take: 1},
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
                    leader: {
                        select: {
                            username: true,
                            name: true,
                            lastName: true,
                            profilePictures: {take: 1},
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
                                    profilePictures: {take: 1},
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
                                    profilePictures: {take: 1},
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                },
            }
        }
    }
}
