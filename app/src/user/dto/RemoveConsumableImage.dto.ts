import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

// you can add validate using class-validator
export class RemoveConsumableImageDto {
	@IsString()
	imageUrl: string;
	@IsString()
	consumableId: string;
}
