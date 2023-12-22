import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Min } from "class-validator";
import { Consumable } from "@prisma/client";

export class TicketBaseDto {
	@IsOptional()
	@IsString()
	id: string;
	@IsNotEmpty()
	@IsString()
	name: string;
	@IsOptional()
	description: string;
	@IsNotEmpty()
	type: string;
}

export class CreateTicketDto {
	@IsOptional()
	@IsString()
	id: string;
	@IsInt()
	@Min(0)
	@Type(() => Number)
	stock: number;
	@IsInt()
	@Min(0)
	@Type(() => Number)
	price: number;
	@IsOptional()
	@IsArray()
	tags: string[] = [];
	@IsObject()
	base: TicketBaseDto;
	@IsNotEmpty()
	@IsString()
	color: TicketColor;
	@IsOptional()
	@IsArray()
	consumables: ConsumableStack[] = [];
}

export class ConsumableStack {
	@IsOptional()
	@IsString()
	id: string;
	@IsInt()
	@Min(0)
	@Type(() => Number)
	quantity: number;
	@IsObject()
	consumable: Consumable;
}

export type TicketColor =
	| "blue"
	| "green"
	| "purple"
	| "yellow"
	| "orange"
	| "teal"
	| "pink"
	| "lightBlue"
	| "grey"
	| "red";
