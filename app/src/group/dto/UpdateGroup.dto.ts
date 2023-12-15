import { AgeRange } from "@prisma/client";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateGroupDto {
	@IsNotEmpty()
	id: string;
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	description: string;
	@IsNotEmpty()
	ageRange: AgeRange;
	@IsBoolean()
	isPrivate: boolean;
	@IsBoolean()
	showInFeed: boolean;
}
