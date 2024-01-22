import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "app/main";
import { GoogleUser } from "app/types";
import { hash, verify } from "argon2";
import { OAuth2Client } from "google-auth-library";
import { sign } from "jsonwebtoken";
import { PrismaService } from "../../db/services/prisma.service";
import { UtilsService } from "../../utils/services/utils.service";
import { AuthDto } from "../dto/Auth.dto";

const client = new OAuth2Client();

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private utils: UtilsService
	) {}

	async signInUser(googleUser: GoogleUser) {
		const { idToken } = googleUser;

		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_AUTH_WEB_TOKEN
		});
		const payload = ticket.getPayload();
		if (!payload) throw new InternalServerErrorException("Invalid access token.");

		let user: any = await this.prisma.user.findFirst({
			where: {
				assignedGoogleID: googleUser.user.id
			},
			select: {
				id: true
			}
		});

		if (!user) {
			const generatedUsername = `${googleUser.user.givenName ?? ""}${
				googleUser.user.familyName ?? ""
			}${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;

			const userLocation = await this.prisma.location.create({
				data: {
					name: "",
					latitude: 0,
					longitude: 0,
					timestamp: new Date(),
					address: ""
				}
			});

			user = await this.prisma.$transaction([
				this.prisma.user.create({
					data: {
						username: generatedUsername,
						name: googleUser.user.givenName ?? "",
						password: "",
						email: googleUser.user.email,
						lastName: googleUser.user.familyName ?? "",
						assignedGoogleID: googleUser.user.id,
						lastLogin: new Date(),
						createdAt: new Date(),
						birthDate: new Date(),
						socialMedia: {
							instagram: ""
						},
						locationId: userLocation.id
					},
					include: this.utils.getUserFields()
				})
			]);
		}

		const refreshToken = sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "4weeks"
		});

		const accessToken = sign({ id: user.id, refreshToken }, JWT_SECRET, { expiresIn: "1d" });

		this.prisma.user.update({
			where: { id: user.id },
			data: {
				accessToken,
				refreshToken,
				lastLogin: new Date()
			},
			include: this.utils.getUserFields()
		});

		return {
			...user,
			accessToken,
			refreshToken,
			lastLogin: new Date()
		};
	}

	async logoutUser(userId: string) {
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				accessToken: "",
				refreshToken: "",
				expoPushToken: "",
				webSocketId: ""
			}
		});
		return true;
	}

	async refreshToken(userId: string) {
		const accessToken = sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
		const refreshToken = sign({ id: userId }, JWT_REFRESH_SECRET, {
			expiresIn: "4weeks"
		});
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: {
				accessToken,
				refreshToken
			},
			include: this.utils.getUserFields()
		});

		return user;
	}

	async createToken(userId: string) {
		return sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
	}

	async register(registerDto: AuthDto) {
		const { email, password } = registerDto;
		const user = await this.prisma.user.findFirst({
			where: {
				email
			}
		});

		if (user) {
			return {
				errors: [
					{
						type: "mail",
						message: "Este email ya está registrado."
					}
				]
			};
		}

		const generatedUsername = `${email.split("@")[0]}${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;

		const userLocation = await this.prisma.location.create({
			data: {
				name: "",
				latitude: 0,
				longitude: 0,
				timestamp: new Date(),
				address: ""
			}
		});

		const safePassword = await hash(password);

		const newUser = await this.prisma.user.create({
			data: {
				username: generatedUsername,
				name: "",
				email,
				password: safePassword,
				lastName: "",
				assignedGoogleID: "",
				lastLogin: new Date(),
				createdAt: new Date(),
				birthDate: new Date(),
				socialMedia: {
					instagram: ""
				},
				locationId: userLocation.id
			},
			include: this.utils.getUserFields()
		});

		const refreshToken = sign({ id: newUser.id }, JWT_REFRESH_SECRET, {
			expiresIn: "4weeks"
		});

		const accessToken = sign({ id: newUser.id, refreshToken }, JWT_SECRET, { expiresIn: "1d" });

		this.prisma.user.update({
			where: { id: newUser.id },
			data: {
				accessToken,
				refreshToken
			},
			include: this.utils.getUserFields()
		});

		return {
			...newUser,
			accessToken,
			refreshToken
		};
	}

	async login(loginDto: AuthDto) {
		const { email, password } = loginDto;
		const user = await this.prisma.user.findFirst({
			where: {
				email
			},
			select: {
				id: true,
				password: true,
				assignedGoogleID: true
			}
		});

		if (!user) {
			return {
				errors: [
					{
						type: "mail",
						message: "Este email no está registrado"
					}
				]
			};
		}

		if (user.password.length === 0 && user.assignedGoogleID.length > 0) {
			return {
				errors: [
					{
						type: "mail",
						message: "Este email ya está registrado con Google."
					}
				]
			};
		}

		const safePassword = await verify(user.password, password);

		if (!safePassword) {
			return {
				errors: [
					{
						type: "password",
						message: "Contraseña incorrecta"
					}
				]
			};
		}

		const refreshToken = sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "4weeks"
		});

		const accessToken = sign({ id: user.id, refreshToken }, JWT_SECRET, { expiresIn: "1d" });

		this.prisma.user.update({
			where: { id: user.id },
			data: {
				accessToken,
				refreshToken
			},
			include: this.utils.getUserFields()
		});

		return {
			...user,
			accessToken,
			refreshToken
		};
	}
}
