import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class JoinRequestDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    groupId?: string;

    @IsNotEmpty()
    @IsString()
    type: string;
}
