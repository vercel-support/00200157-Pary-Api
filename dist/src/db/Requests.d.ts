export declare const PARTY_REQUEST: {
    location: {
        select: {
            id: boolean;
            name: boolean;
            latitude: boolean;
            longitude: boolean;
            timestamp: boolean;
            address: boolean;
        };
    };
    owner: {
        select: {
            username: boolean;
            socialMedia: boolean;
            name: boolean;
            lastName: boolean;
            profilePictures: {
                take: number;
                select: {
                    url: boolean;
                    id: boolean;
                };
            };
            verified: boolean;
            isCompany: boolean;
            gender: boolean;
            userType: boolean;
        };
    };
    moderators: {
        include: {
            user: {
                select: {
                    username: boolean;
                    socialMedia: boolean;
                    name: boolean;
                    lastName: boolean;
                    profilePictures: {
                        take: number;
                        select: {
                            url: boolean;
                            id: boolean;
                        };
                    };
                    verified: boolean;
                    isCompany: boolean;
                    gender: boolean;
                    userType: boolean;
                };
            };
        };
    };
    members: {
        include: {
            user: {
                select: {
                    username: boolean;
                    socialMedia: boolean;
                    name: boolean;
                    lastName: boolean;
                    profilePictures: {
                        take: number;
                        select: {
                            url: boolean;
                            id: boolean;
                        };
                    };
                    verified: boolean;
                    isCompany: boolean;
                    gender: boolean;
                    userType: boolean;
                };
            };
        };
    };
    invitations: {
        include: {
            invitingUser: {
                select: {
                    username: boolean;
                    socialMedia: boolean;
                    name: boolean;
                    lastName: boolean;
                    profilePictures: {
                        take: number;
                        select: {
                            url: boolean;
                            id: boolean;
                        };
                    };
                    verified: boolean;
                    isCompany: boolean;
                    gender: boolean;
                    userType: boolean;
                };
            };
            invitedUser: {
                select: {
                    username: boolean;
                    socialMedia: boolean;
                    name: boolean;
                    lastName: boolean;
                    profilePictures: {
                        take: number;
                        select: {
                            url: boolean;
                            id: boolean;
                        };
                    };
                    verified: boolean;
                    isCompany: boolean;
                    gender: boolean;
                    userType: boolean;
                };
            };
        };
    };
    membershipRequests: {
        include: {
            group: {
                select: {
                    leader: {
                        select: {
                            username: boolean;
                            socialMedia: boolean;
                            name: boolean;
                            lastName: boolean;
                            profilePictures: {
                                take: number;
                                select: {
                                    url: boolean;
                                    id: boolean;
                                };
                            };
                            verified: boolean;
                            isCompany: boolean;
                            gender: boolean;
                            userType: boolean;
                        };
                    };
                    members: {
                        include: {
                            user: {
                                select: {
                                    username: boolean;
                                    socialMedia: boolean;
                                    name: boolean;
                                    lastName: boolean;
                                    profilePictures: {
                                        take: number;
                                        select: {
                                            url: boolean;
                                            id: boolean;
                                        };
                                    };
                                    verified: boolean;
                                    isCompany: boolean;
                                    gender: boolean;
                                    userType: boolean;
                                };
                            };
                        };
                    };
                    moderators: {
                        include: {
                            user: {
                                select: {
                                    username: boolean;
                                    socialMedia: boolean;
                                    name: boolean;
                                    lastName: boolean;
                                    profilePictures: {
                                        take: number;
                                        select: {
                                            url: boolean;
                                            id: boolean;
                                        };
                                    };
                                    verified: boolean;
                                    isCompany: boolean;
                                    gender: boolean;
                                    userType: boolean;
                                };
                            };
                        };
                    };
                };
            };
            user: {
                select: {
                    username: boolean;
                    socialMedia: boolean;
                    name: boolean;
                    lastName: boolean;
                    profilePictures: {
                        take: number;
                        select: {
                            url: boolean;
                            id: boolean;
                        };
                    };
                    verified: boolean;
                    isCompany: boolean;
                    gender: boolean;
                    userType: boolean;
                };
            };
        };
    };
    groups: {
        include: {
            group: {
                select: {
                    id: boolean;
                    leaderId: boolean;
                    name: boolean;
                    leader: {
                        select: {
                            username: boolean;
                            socialMedia: boolean;
                            name: boolean;
                            lastName: boolean;
                            profilePictures: {
                                take: number;
                                select: {
                                    url: boolean;
                                    id: boolean;
                                };
                            };
                            verified: boolean;
                            isCompany: boolean;
                            gender: boolean;
                            userType: boolean;
                        };
                    };
                    members: {
                        include: {
                            user: {
                                select: {
                                    username: boolean;
                                    socialMedia: boolean;
                                    name: boolean;
                                    lastName: boolean;
                                    profilePictures: {
                                        take: number;
                                        select: {
                                            url: boolean;
                                            id: boolean;
                                        };
                                    };
                                    verified: boolean;
                                    isCompany: boolean;
                                    gender: boolean;
                                    userType: boolean;
                                };
                            };
                        };
                    };
                    moderators: {
                        include: {
                            user: {
                                select: {
                                    username: boolean;
                                    socialMedia: boolean;
                                    name: boolean;
                                    lastName: boolean;
                                    profilePictures: {
                                        take: number;
                                        select: {
                                            url: boolean;
                                            id: boolean;
                                        };
                                    };
                                    verified: boolean;
                                    isCompany: boolean;
                                    gender: boolean;
                                    userType: boolean;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    consumables: {
        include: {
            item: boolean;
        };
    };
    covers: {
        include: {
            item: boolean;
        };
    };
    tickets: {
        include: {
            base: boolean;
            consumables: {
                include: {
                    consumable: {
                        include: {
                            item: boolean;
                        };
                    };
                };
            };
        };
    };
};
