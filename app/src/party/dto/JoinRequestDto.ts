import {IsOptional, IsString} from "class-validator";

export class JoinRequestDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    groupId?: string;

    @IsOptional()
    @IsString()
    type: string;
}
