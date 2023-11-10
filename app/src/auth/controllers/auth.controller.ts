import {
    Body,
    Controller,
    ForbiddenException,
    Headers,
    InternalServerErrorException,
    Post,
    Req,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {GoogleUserDto} from "app/dtos/auth/SignIn.dto";
import {AuthService} from "app/services/auth/auth.service";
import {UtilsService} from "app/services/utils/utils.service";
import {JWT_REFRESH_SECRET, JWT_SECRET} from "app/src/main";
import {verify} from "jsonwebtoken";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private utils: UtilsService,
    ) {}

    @Post("signIn")
    @UsePipes(new ValidationPipe())
    async signIn(@Body("googleUser") googleUser: GoogleUserDto): Promise<any> {
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

    /* @Get("test-users")
    async testUsers(@Res() response: FastifyReply): Promise<any> {
        const users = await prisma.user.findMany();
        return response.send(users);
    } */
}
