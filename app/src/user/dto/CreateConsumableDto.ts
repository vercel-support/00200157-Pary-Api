import { ConsumableType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Min } from "class-validator";

export class ConsumableItemDto {
	@IsOptional()
	@IsString()
	id: string;
	@IsNotEmpty()
	@IsString()
	name: string;
	@IsOptional()
	description: string;
	@IsNotEmpty()
	pictureUrl: string;
	@IsNotEmpty()
	type: ConsumableType;
}

export class CreateConsumableDto {
	@IsOptional()
	@IsString()
	id: string;
	@IsNotEmpty()
	brand: string;
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
	@IsInt()
	@Min(0)
	@Type(() => Number)
	weightOrVolume: number;
	@IsObject()
	item: ConsumableItemDto;
}
