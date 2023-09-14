import {Gender, Location} from "@prisma/client";
import {IsArray, IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class UpdateUserDto {
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
    musicInterest: string[];
    @IsArray()
    deportsInterest: string[];
    @IsArray()
    artAndCultureInterest: string[];
    @IsArray()
    techInterest: string[];
    @IsArray()
    hobbiesInterest: string[];
    @IsNotEmpty()
    location: Location;
    @IsBoolean()
    isCompany: boolean;
}
