import { AgeRange } from "@prisma/client";
import { IsArray, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateGroupDto {
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	description: string;
	@IsArray()
	inviteUserNames: string[];
	@IsNotEmpty()
	ageRange: AgeRange;
	@IsBoolean()
	isPrivate: boolean;
	@IsBoolean()
	showInFeed: boolean;
}
