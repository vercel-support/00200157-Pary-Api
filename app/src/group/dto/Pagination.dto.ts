import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class PaginationDto {
	@IsInt()
	@Min(0)
	@Type(() => Number)
	page = 1;

	@IsInt()
	@Min(1)
	@Type(() => Number)
	limit = 10;
}
