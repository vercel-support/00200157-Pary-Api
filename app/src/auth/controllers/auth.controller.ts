import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    InternalServerErrorException,
    Param,
    Post,
    Req,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {GoogleUserDto} from "app/src/auth/dto/SignIn.dto";
import {AuthService} from "app/src/auth/services/auth.service";
import {JWT_REFRESH_SECRET, JWT_SECRET} from "app/main";
import {verify} from "jsonwebtoken";
import {UtilsService} from "../../utils/services/utils.service";
import {ApiTags} from "@nestjs/swagger";
import {User} from "../../../types";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private utils: UtilsService,
    ) {}

    @Post("signIn")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async signIn(@Body() googleUser: GoogleUserDto): Promise<User> {
        console.log("googleUser", googleUser);
        return this.authService.signInUser(googleUser);
    }

    @Post("logout")
    async logout(@Req() request: any) {
        return this.authService.logoutUser(request.raw.decoded.id);
    }

    @Post("refresh-token")
    async refreshToken(@Req() request: any): Promise<any> {
        return this.authService.refreshToken(request.raw.decoded.id);
    }

    @Post("test-token")
    async testToken(@Headers("authorization") bearerToken: string): Promise<any> {
        if (!bearerToken) {
            throw new ForbiddenException("No token provided.");
        }
        const token = this.utils.extractToken(bearerToken);
        try {
            const decoded = verify(token, JWT_SECRET);
            if (typeof decoded === "object" && "id" in decoded) {
                return {message: "Access token is valid."};
            } else {
                throw new InternalServerErrorException("Invalid access token.");
            }
        } catch (error) {
            throw new InternalServerErrorException("Failed to authenticate token.");
        }
    }

    @Post("test-refresh-token")
    async testRefreshToken(@Headers("authorization") bearerToken: string): Promise<any> {
        if (!bearerToken) {
            throw new ForbiddenException("No token provided.");
        }

        const token = this.utils.extractToken(bearerToken);

        try {
            const decoded = verify(token, JWT_REFRESH_SECRET);
            if (typeof decoded === "object" && "id" in decoded) {
                return {message: "Access token is valid."};
            } else {
                throw new InternalServerErrorException("Invalid access token.");
            }
        } catch (error) {
            throw new InternalServerErrorException("Failed to authenticate token.");
        }
    }

    @Get("create-token/:id")
    async createToken(@Param("id") id: string): Promise<any> {
        return this.authService.createToken(id);
    }
}
