import { AgeRange, Consumable, Location, PartyPicture, PartyType, Ticket } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePartyDto {
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	description: string;
	@IsNotEmpty()
	location: Location;
	@IsNotEmpty()
	date: Date;
	@IsEnum(PartyType, { each: true })
	type: PartyType;
	@IsArray()
	tags: string[];
	@IsArray()
	participants: string[];
	@IsNotEmpty()
	image: string;
	@IsBoolean()
	showAddressInFeed: boolean;
	@IsNotEmpty()
	ageRange: AgeRange;
	@IsBoolean()
	advertisement: boolean;
	@IsOptional()
	@IsArray()
	consumables: Consumable[];
	@IsOptional()
	@IsArray()
	covers: Consumable[];
	@IsOptional()
	@IsArray()
	tickets: Ticket[];
}
