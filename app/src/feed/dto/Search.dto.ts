import { Type } from "class-transformer";
import { IsInt, IsString, Min } from "class-validator";

export class SearchDto {
	@IsInt()
	@Min(0)
	@Type(() => Number)
	page = 0;

	@IsInt()
	@Min(1)
	@Type(() => Number)
	limit = 5;

	@IsString()
	search: string;
}
