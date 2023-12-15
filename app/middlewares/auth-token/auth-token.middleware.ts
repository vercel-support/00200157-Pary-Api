import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { JWT_SECRET } from "app/main";
import { AuthenticatedRequestDecoded } from "app/types";
import { JwtPayload, VerifyErrors, verify } from "jsonwebtoken";

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void) {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")[1];

		if (!token) {
			throw new HttpException("No se ha proporcionado un token.", 401);
		}

		verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
			if (err) {
				throw new HttpException("Token inválido.", 403);
			}

			if (!decoded || typeof decoded === "string") {
				throw new HttpException("Token inválido.", 403);
			}
			req.decoded = decoded as AuthenticatedRequestDecoded;

			next();
		});
	}
}
