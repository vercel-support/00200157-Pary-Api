import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "app/main";
import { GoogleUser, User } from "app/types";
import { OAuth2Client } from "google-auth-library";
import { sign } from "jsonwebtoken";
import { PrismaService } from "../../db/services/prisma.service";
import { UtilsService } from "../../utils/services/utils.service";

const client = new OAuth2Client();

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private utils: UtilsService) {}

	async signInUser(googleUser: GoogleUser) {
		const { idToken } = googleUser;

		async function verify() {
			const ticket = await client.verifyIdToken({
				idToken,
				audience: process.env.GOOGLE_AUTH_WEN_TOKEN,
			});
			const payload = ticket.getPayload();
			if (!payload) throw new InternalServerErrorException("Invalid access token.");
		}

		await verify().catch(() => {
			throw new InternalServerErrorException("Invalid access token.");
		});

		let user = (await this.prisma.user.findUnique({
			where: {
				assignedGoogleID: googleUser.user.id,
			},
			select: {
				id: true,
			},
		})) as User;

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
					address: "",
				},
			});
			user = await this.prisma.user.create({
				data: {
					username: generatedUsername,
					name: googleUser.user.givenName ?? "",
					email: googleUser.user.email,
					lastName: googleUser.user.familyName ?? "",
					assignedGoogleID: googleUser.user.id,
					lastLogin: new Date(),
					createdAt: new Date(),
					birthDate: new Date(),
					socialMedia: {
						instagram: "",
					},
					locationId: userLocation.id,
				},
				include: this.utils.getUserFields(),
			});
		}

		const accessToken = sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
		const refreshToken = sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "4weeks" });

		user = await this.prisma.user.update({
			where: { id: user.id },
			data: {
				accessToken,
				refreshToken,
				lastLogin: new Date(),
			},
			include: this.utils.getUserFields(),
		});

		return user;
	}

	async logoutUser(userId: string) {
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				accessToken: "",
				refreshToken: "",
				expoPushToken: "",
			},
		});
	}

	async refreshToken(userId: string) {
		const accessToken = sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
		const refreshToken = sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "4weeks" });
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: {
				accessToken,
				refreshToken,
			},
			include: this.utils.getUserFields(),
		});

		return user;
	}

	async createToken(userId: string) {
		return sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
	}
}
