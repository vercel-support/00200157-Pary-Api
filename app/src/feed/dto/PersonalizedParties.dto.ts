import { Optional } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, Min } from "class-validator";

export class PersonalizedPartiesDto {
	@IsInt()
	@Min(0)
	@Type(() => Number)
	partyPage = 0;

	@IsInt()
	@Min(1)
	@Type(() => Number)
	partyLimit = 15;

	@Optional()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	groupPage?: number = 0;

	@Optional()
	@IsInt()
	@Min(1)
	@Type(() => Number)
	groupLimit?: number = 10;

	@IsInt()
	@Min(0)
	@Type(() => Number)
	maxAge = 100;

	@IsInt()
	@Min(0)
	@Type(() => Number)
	minAge = 18;

	@IsInt()
	@Min(0)
	@Type(() => Number)
	distanceLimit = 100;

	@IsBoolean()
	@Transform(({ value }) => {
		if (typeof value === "boolean") {
			return value;
		}
		return value === "true";
	})
	showGroups: boolean;
}
