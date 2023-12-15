import { IsNotEmpty } from "class-validator";

export class DeleteProfilePictureDto {
	@IsNotEmpty()
	id: string;
}
