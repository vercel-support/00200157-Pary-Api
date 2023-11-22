import {IsArray, IsBoolean, IsNotEmpty} from "class-validator";
import {AgeRange} from "@prisma/client";

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
