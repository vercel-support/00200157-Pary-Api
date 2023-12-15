import {ConsumableType} from "@prisma/client";
import {IsArray, IsNotEmpty, IsOptional} from "class-validator";

export class CreateConsumableItemDto {
    @IsNotEmpty()
    name: string;
    @IsOptional()
    description: string;
    @IsNotEmpty()
    pictureUrl: string;
    @IsNotEmpty()
    type: ConsumableType;
    @IsOptional()
    @IsArray()
    tags: string[];
}
