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

type Gender = "mujer" | "hombre" | "otro";
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
    profilePictures: ProfilePicture[];  // Consider using an array of ProfilePicture interface if applicable
    description: string;
    birthDate: string;  // Consider using a Date type if possible
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

export interface Party {
    id: string;
    location: string;
    name: string;
    description: string;
    image: string; // url
    creatorUsername: string;
    tags: string[];
}
