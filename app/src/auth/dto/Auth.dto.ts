import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class AuthDto {
	@IsString()
	password: string;

	@IsEmail()
	email: string;
}
