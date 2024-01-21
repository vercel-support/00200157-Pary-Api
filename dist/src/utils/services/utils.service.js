"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
const common_1 = require("@nestjs/common");
let UtilsService = class UtilsService {
    haversineDistance(location1, location2) {
        const R = 6371;
        const lat1 = (location1.latitude * Math.PI) / 180;
        const lat2 = (location2.latitude * Math.PI) / 180;
        const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180;
        const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    extractToken(bearerToken) {
        return bearerToken.split(" ")[1];
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
    calculateAge(birthday) {
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
};
exports.UtilsService = UtilsService;
exports.UtilsService = UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
//# sourceMappingURL=utils.service.js.map