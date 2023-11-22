import {IsInt, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class FollowersFollowingDto {
    @IsInt()
    @Min(0)
    @Type(() => Number)
    page: number = 1;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit: number = 10;

    @IsString()
    username: string;
}
