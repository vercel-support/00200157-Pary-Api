import { Gender, Location, SocialMedia } from "@prisma/client";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UpdateUser {
	@IsNotEmpty()
	username: string;
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	lastName: string;
	@IsNotEmpty()
	birthDate: Date;
	@IsNotEmpty()
	gender: Gender;
	@IsNotEmpty()
	phoneNumber: string;
	@IsString()
	description: string;
	@IsNotEmpty()
	expoPushToken: string;
	@IsArray()
	interests: string[];
	@IsNotEmpty()
	location: Location;
	@IsBoolean()
	isCompany: boolean;
	@IsNotEmpty()
	socialMedia: SocialMedia;
}
