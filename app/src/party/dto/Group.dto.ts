import { IsOptional, IsString } from "class-validator";

export class OptionalGroupIdDto {
	@IsOptional()
	@IsString()
	groupId?: string;
}
