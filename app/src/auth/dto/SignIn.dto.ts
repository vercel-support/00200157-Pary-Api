import {IsEmail, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class UserDto {
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name: string | null;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    photo: string | null;

    @IsOptional()
    @IsString()
    familyName: string | null;

    @IsOptional()
    @IsString()
    givenName: string | null;
}

export class GoogleUserDto {
    @IsNotEmpty()
    @IsObject({message: "Invalid Google user object."})
    user: UserDto;
    scopes?: string[];
    idToken: string | null;
    /**
     * Not null only if a valid webClientId and offlineAccess: true was
     * specified in configure().
     */
    serverAuthCode: string | null;
}
