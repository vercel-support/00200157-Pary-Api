import {IsBoolean, IsInt, Min} from "class-validator";
import {Transform, Type} from "class-transformer";
import {Optional} from "@nestjs/common";

export class PersonalizedPartiesDto {
    @IsInt()
    @Min(0)
    @Type(() => Number)
    partyPage: number = 0;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    partyLimit: number = 15;

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
