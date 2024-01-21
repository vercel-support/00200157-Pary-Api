export declare class UserDto {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    familyName: string | null;
    givenName: string | null;
}
export declare class GoogleUserDto {
    user: UserDto;
    scopes?: string[];
    idToken: string | null;
    serverAuthCode: string | null;
}
