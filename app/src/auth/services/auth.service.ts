import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "app/main";
import { GoogleUser } from "app/types";
import { hash, verify } from "argon2";
import { OAuth2Client } from "google-auth-library";
import { sign } from "jsonwebtoken";
import { Resend } from "resend";
import { PrismaService } from "../../db/services/prisma.service";
import { UtilsService } from "../../utils/services/utils.service";
import { AuthDto } from "../dto/Auth.dto";

const client = new OAuth2Client();
const resend = new Resend(process.env.RESEND_API_KEY);

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
		if (!payload) throw new InternalServerErrorException("Token de acceso invalido.");

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

			user = await this.prisma.user.create({
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
					verifiedEmail: true,
					location: {
						create: {
							name: "",
							latitude: 0,
							longitude: 0,
							timestamp: new Date(),
							address: ""
						}
					},
					socialMedia: {
						instagram: ""
					}
				},
				select: {
					id: true
				}
			});
		}

		const accessToken = sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

		const refreshToken = sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "4weeks"
		});

		return await this.prisma.user.update({
			where: { id: user.id },
			data: {
				accessToken,
				refreshToken,
				lastLogin: new Date()
			},
			select: this.utils.getSafePersonalUserFields()
		});
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
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				accessToken,
				refreshToken
			},
			select: this.utils.getSafePersonalUserFields()
		});
	}

	async createToken(userId: string) {
		return sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
	}

	async verifyEmail(email: string, token: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email
			},
			select: {
				id: true,
				verifiedEmail: true
			}
		});

		if (user.verifiedEmail) {
			return {
				errors: [
					{
						type: "mail",
						message: "Este email ya está registrado."
					}
				]
			};
		}

		const emailVerification = await this.prisma.mailVerification.findFirst({
			where: {
				token,
				email
			}
		});

		if (!emailVerification) {
			return {
				errors: [
					{
						type: "token",
						message: "Token inválido."
					}
				]
			};
		}

		if (emailVerification.createdAt.getTime() + 1000 * 60 * 60 < new Date().getTime()) {
			return {
				errors: [
					{
						type: "token",
						message: "Token expirado (1hr)."
					}
				]
			};
		}

		await this.prisma.mailVerification.delete({
			where: {
				id: emailVerification.id
			}
		});

		const refreshToken = sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "4weeks"
		});

		const accessToken = sign({ id: user.id, refreshToken }, JWT_SECRET, { expiresIn: "1d" });

		return await this.prisma.user.update({
			where: { id: user.id },
			data: {
				accessToken,
				refreshToken,
				verifiedEmail: true,
				lastLogin: new Date()
			},
			select: this.utils.getSafePersonalUserFields()
		});
	}

	async register(registerDto: AuthDto) {
		const { email, password } = registerDto;
		const user = await this.prisma.user.count({
			where: {
				email
			}
		});

		const emailVerification = await this.prisma.mailVerification.findFirst({
			where: {
				email
			}
		});

		if (user > 0 && !emailVerification) {
			return {
				errors: [
					{
						type: "mail",
						message: "Este email ya está registrado."
					}
				]
			};
		}

		if (emailVerification) {
			if (emailVerification.createdAt.getTime() + 1000 * 60 * 60 < new Date().getTime()) {
				await this.prisma.mailVerification.delete({
					where: {
						id: emailVerification.id
					}
				});
			} else {
				return {
					errors: []
				};
			}
		}

		const generatedUsername = `${email.split("@")[0]}${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;

		const safePassword = await hash(password);

		await this.prisma.user.create({
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
				verifiedEmail: false,
				location: {
					create: {
						name: "",
						latitude: 0,
						longitude: 0,
						timestamp: new Date(),
						address: ""
					}
				},
				socialMedia: {
					instagram: ""
				}
			}
		});

		const token = this.utils.generatePassword(6);

		// send the email
		const { data, error } = await resend.emails.send({
			from: "Pary <noreply@parystudio.com>",
			to: [email],
			subject: "Verificación de email",
			html: `	<div style="background-color: #121212; font-family: Arial, sans-serif; color: rgba(255, 255, 255, 0.85); text-align: center; padding: 50px;">
						<div style="max-width: 600px; margin: auto; background-color: #1e1e1e; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
							<h2>¡Bienvenid@ a Pary!</h2>
							<div style="background-color: #272727; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0px 0px 5px rgba(0,0,0,0.1);">
								<h3>Tu clave de verificación</h3>
								<p style="color: rgba(255, 255, 255, 0.65);">Por favor, utiliza la siguiente clave para verificar tu dirección de correo electrónico. Si no la solicitaste, puedes ignorar este correo de manera segura.</p>
								<kbd style="display: block; margin: 20px auto; padding: 10px; border: 1px solid #424242; background-color: #272727; color: rgba(255, 255, 255, 0.65); border-radius: 8px; font-family: monospace;">
									${token}
								</kbd>
							</div>
						</div>
					</div>`
		});

		if (error) {
			console.log(error);
			await this.prisma.user.delete({
				where: {
					email
				}
			});
			throw new InternalServerErrorException("Error al enviar el correo de verificación.");
		}

		await this.prisma.mailVerification.create({
			data: {
				email,
				token
			}
		});

		return {
			errors: []
		};
	}

	async login(loginDto: AuthDto) {
		const { email, password } = loginDto;
		const user = await this.prisma.user.findFirst({
			where: {
				email
			},
			select: {
				password: true,
				id: true,
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

		return this.prisma.user.update({
			where: { id: user.id },
			data: {
				accessToken,
				refreshToken,
				signedIn: true,
				lastLogin: new Date()
			},
			select: this.utils.getSafePersonalUserFields()
		});
	}
}
