import {AgeRange, Location, PartyPicture, PartyType} from "@prisma/client";
import {IsArray, IsBoolean, IsNotEmpty} from "class-validator";

export class CreatePartyDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    location: Location;
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    type: PartyType;
    @IsArray()
    tags: string[];
    @IsArray()
    participants: string[];
    @IsNotEmpty()
    image: PartyPicture;
    @IsBoolean()
    showAddressInFeed: boolean;
    @IsNotEmpty()
    ageRange: AgeRange;
    @IsBoolean()
    isPrivate: boolean;
    @IsBoolean()
    advertisement: boolean;
}
