import { Optional } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, Min } from "class-validator";

export class PersonalizedPartiesDto {
	@IsNumber()
	@Min(0)
	@Type(() => Number)
	partyPage = 0;

	@IsNumber()
	@Min(1)
	@Type(() => Number)
	partyLimit = 15;

	@Optional()
	@IsNumber()
	@Min(0)
	@Type(() => Number)
	groupPage?: number = 0;

	@Optional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	groupLimit?: number = 10;

	@IsNumber()
	@Min(0)
	@Type(() => Number)
	maxAge = 100;

	@IsNumber()
	@Min(0)
	@Type(() => Number)
	minAge = 18;

	@IsNumber()
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
