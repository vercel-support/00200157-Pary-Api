import {IsNotEmpty, IsString} from "class-validator";

export class UploadImageDto {
    @IsNotEmpty()
    @IsString()
    image: string;
}
