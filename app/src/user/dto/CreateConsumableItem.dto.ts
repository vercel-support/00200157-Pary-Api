import { ConsumableType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateConsumableItemDto {
	@IsOptional()
	@IsString()
	id: string;
	@IsNotEmpty()
	name: string;
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
	description: string;
	@IsNotEmpty()
	pictureUrl: string;
	@IsNotEmpty()
	type: ConsumableType;
	@IsOptional()
	@IsArray()
	tags: string[] = [];
	@IsInt()
	@Min(0)
	@Type(() => Number)
	weightOrVolume: number;
	@IsOptional()
	@Type(() => Date)
	expiresAt: Date;
}
