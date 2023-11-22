import {IsBoolean, IsInt, Min} from "class-validator";
import {Transform, Type} from "class-transformer";

export class PersonalizedPartiesDto {
    @IsInt()
    @Min(0)
    @Type(() => Number)
    page: number = 0;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit: number = 15;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    maxAge: number = 100;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    minAge: number = 18;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    distanceLimit: number = 100;

    @IsBoolean()
    @Transform(({value}) => {
        if (typeof value === "boolean") {
            return value;
        }
        return value === "true";
    })
    showGroups: boolean;
}
