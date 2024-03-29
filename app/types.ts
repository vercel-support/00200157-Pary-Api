import { IncomingMessage } from "http";
import { Party } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
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
type UserType = "Normal" | "Staff" | "Enterprise";

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
	interests: Interest;
	verified: boolean;
	userType: UserType;
}

export interface ProfilePicture {
	id?: string;
	url: string;
}

export interface FetchedParty extends Party {
	distance: number;
}

export interface AuthenticatedRequest extends IncomingMessage {
	decoded: JwtPayload;
}

export interface AuthenticatedRequestDecoded {
	id: string;
	iat: number;
	exp: number;
}

export interface Location {
	name: string;
	latitude: number;
	longitude: number;
	timestamp: Date | string;
}

export type NotificationType =
	| "follow"
	| "like"
	| "comment"
	| "message"
	| "newParty"
	| "partyUpdate"
	| "partyDelete"
	| "groupInvite"
	| "group"
	| "groupNewMember";
