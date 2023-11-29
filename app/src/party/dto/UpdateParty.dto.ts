import {AgeRange, Location, PartyPicture, PartyType} from "@prisma/client";
import {IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdatePartyDto {
    @IsNotEmpty()
    @IsString()
    id: string;
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    location: Location;
    @IsNotEmpty()
    date: Date;
    @IsEnum(PartyType, {each: true})
    type: PartyType;
    @IsArray()
    tags: string[];
    @IsNotEmpty()
    image: PartyPicture;
    @IsOptional()
    oldImage: PartyPicture;
    @IsBoolean()
    showAddressInFeed: boolean;
    @IsNotEmpty()
    ageRange: AgeRange;
    @IsBoolean()
    isPrivate: boolean;
    @IsBoolean()
    advertisement: boolean;
}
