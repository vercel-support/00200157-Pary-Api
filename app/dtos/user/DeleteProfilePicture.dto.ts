import {IsNotEmpty} from "class-validator";

export class DeleteProfilePictureDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    amazonId: string;
}
