import { GoogleUserDto } from "app/src/auth/dto/SignIn.dto";
import { AuthService } from "app/src/auth/services/auth.service";
import { User } from "../../../types";
import { UtilsService } from "../../utils/services/utils.service";
export declare class AuthController {
    private authService;
    private utils;
    constructor(authService: AuthService, utils: UtilsService);
    signIn(googleUser: GoogleUserDto): Promise<User>;
    logout(request: any): Promise<boolean>;
    refreshToken(request: any): Promise<any>;
    testToken(bearerToken: string): Promise<any>;
    testRefreshToken(bearerToken: string): Promise<any>;
    createToken(id: string): Promise<any>;
}
