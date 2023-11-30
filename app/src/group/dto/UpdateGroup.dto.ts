import {IsBoolean, IsNotEmpty} from "class-validator";
import {AgeRange} from "@prisma/client";

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
