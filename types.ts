import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export interface GoogleUser {
    user: {
        id: string;
        name: string | null;
        email: string;
        photo: string | null;
        familyName: string | null;
        givenName: string | null;
    };
    scopes?: string[];
    idToken: string | null;
    /**
     * Not null only if a valid webClientId and offlineAccess: true was
     * specified in configure().
     */
    serverAuthCode: string | null;
}

type Gender = "Masculino" | "Femenino" | "NoBinario" | "Otro";
type Interest = string[];

export interface User extends BasicUserData {
    id: string;
    email: string;
    signedIn: boolean;
    accessToken: string;
    refreshToken: string;
}
// Represents the basic information of a user.
export interface BasicUserData {
    username: string;
    name: string;
    lastName: string;
    profilePictures: ProfilePicture[];
    description: string;
    birthDate: Date;
    gender: Gender;
    musicInterest: Interest;
    deportsInterest: Interest;
    artAndCultureInterest: Interest;
    techInterest: Interest;
    hobbiesInterest: Interest;
    verified: boolean;
}

export interface ProfilePicture {
    id?: string;
    url: string;
    amazonId: string;
}

export interface FetchedParty extends Party {
    distance: number;
}

export interface Party {
    id: string;
    location: Location;
    name: string;
    description: string;
    image: ProfilePicture; // url
    creatorUsername: string;
    tags: string[];
    type: PartyType;
    creationDate: Date;
    date: Date;
    private: boolean;
    advertisement: boolean;
    participants?: string[]; // usernames, made it optional
    moderators?: string[];  // made it optional
    active: boolean;
    ownerId: string;
    groupIds?: string[];
}

export type PartyType = "carrete" | "junta" | "evento" | "previa" | "otro";


export interface AuthenticatedRequest extends Request {
    decoded?: JwtPayload;
}


export interface Location {
    name: string;
    latitude: number;
    longitude: number;
    timestamp: Date | string;
}