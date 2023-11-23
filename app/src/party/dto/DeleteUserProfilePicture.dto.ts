import {IsNotEmpty, IsString} from "class-validator";

export class DeleteUserProfilePictureDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsString()
    id: string;
}
