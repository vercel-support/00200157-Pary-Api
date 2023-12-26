import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";

export class GetPreferenceIdDto {
	@IsNotEmpty()
	@IsString()
	payerEmail: string;
	@IsNotEmpty()
	@IsArray()
	items: any;
}
