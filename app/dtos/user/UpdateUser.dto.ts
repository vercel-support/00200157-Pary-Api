import {Gender, Location} from "@prisma/client";
import {IsArray, IsBoolean, IsDate, IsNotEmpty} from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    lastName: string;
    @IsNotEmpty()
    gender: Gender;
    @IsNotEmpty()
    phoneNumber: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    expoPushToken: string;
    @IsDate()
    birthDate: Date;
    @IsArray()
    musicInterests: string[];
    @IsArray()
    movieInterests: string[];
    @IsArray()
    deportsInterest: string[];
    @IsArray()
    artAndCultureInterest: string[];
    @IsArray()
    techInterest: string[];
    @IsArray()
    hobbiesInterest: string[];
    @IsArray()
    musicInterest: string[];
    @IsNotEmpty()
    location: Location;
    @IsBoolean()
    isCompany: boolean;
}
