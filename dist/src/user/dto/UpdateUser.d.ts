import { Gender, Location, SocialMedia } from "@prisma/client";
export declare class UpdateUser {
    username: string;
    name: string;
    lastName: string;
    birthDate: Date;
    gender: Gender;
    phoneNumber: string;
    description: string;
    expoPushToken: string;
    interests: string[];
    location: Location;
    isCompany: boolean;
    socialMedia: SocialMedia;
}
