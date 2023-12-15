import { Type } from "class-transformer";
import { IsInt, IsString, Min } from "class-validator";

export class FollowersFollowingDto {
	@IsInt()
	@Min(0)
	@Type(() => Number)
	page = 1;

	@IsInt()
	@Min(1)
	@Type(() => Number)
	limit = 10;

	@IsString()
	username: string;
}
