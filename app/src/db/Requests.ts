export const PARTY_REQUEST = {
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
                    id: true,
                },
            },
            verified: true,
            isCompany: true,
            gender: true,
            userType: true,
        },
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
                            id: true,
                        },
                    },
                    verified: true,
                    isCompany: true,
                    gender: true,
                    userType: true,
                },
            },
        },
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
                            id: true,
                        },
                    },
                    verified: true,
                    isCompany: true,
                    gender: true,
                    userType: true,
                },
            },
        },
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
                            id: true,
                        },
                    },
                },
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
                            socialMedia: true,
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
                            userType: true,
                        },
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
                                            id: true,
                                        },
                                    },
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                    userType: true,
                                },
                            },
                        },
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
                                            id: true,
                                        },
                                    },
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                    userType: true,
                                },
                            },
                        },
                    },
                },
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
                            id: true,
                        },
                    },
                    verified: true,
                    isCompany: true,
                    gender: true,
                    userType: true,
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
                            socialMedia: true,
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
                                    socialMedia: true,
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
                                    userType: true,
                                },
                            },
                        },
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
                                            id: true,
                                        },
                                    },
                                    verified: true,
                                    isCompany: true,
                                    gender: true,
                                    userType: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
