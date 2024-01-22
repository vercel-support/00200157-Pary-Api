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
	ValidationPipe
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "app/main";
import { GoogleUserDto } from "app/src/auth/dto/SignIn.dto";
import { AuthService } from "app/src/auth/services/auth.service";
import { verify } from "jsonwebtoken";
import { User } from "../../../types";
import { UtilsService } from "../../utils/services/utils.service";
import { AuthDto } from "../dto/Auth.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private utils: UtilsService
	) {}

	@Post("signIn")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async signIn(@Body() googleUser: GoogleUserDto): Promise<User> {
		return await this.authService.signInUser(googleUser);
	}

	@Post("logout")
	async logout(@Req() request: any) {
		return await this.authService.logoutUser(request.raw.decoded.id);
	}

	@Post("refresh-token")
	async refreshToken(@Req() request: any): Promise<any> {
		return await this.authService.refreshToken(request.raw.decoded.id);
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
				return { message: "Access token is valid." };
			}
			throw new InternalServerErrorException("Invalid access token.");
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
				return { message: "Access token is valid." };
			}
			throw new InternalServerErrorException("Invalid access token.");
		} catch (error) {
			throw new InternalServerErrorException("Failed to authenticate token.");
		}
	}

	@Get("create-token/:id")
	async createToken(@Param("id") id: string): Promise<any> {
		return this.authService.createToken(id);
	}

	@Post("register")
	async register(@Body() registerDto: AuthDto) {
		return this.authService.register(registerDto);
	}

	@Post("login")
	async login(@Body() loginDto: AuthDto) {
		return this.authService.login(loginDto);
	}
}
