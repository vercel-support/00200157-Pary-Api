import multiPart from "@fastify/multipart";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./src/app.module";

export const {
	JWT_SECRET,
	JWT_REFRESH_SECRET,
	EXPO_ACCESS_TOKEN,
	PUBLIC_API_URL,
	PUBLIC_API_PORT,
	FINTOC_PUBLIC_KEY,
	FINTOC_SECRET_KEY
} = process.env;

if (JWT_SECRET === undefined) {
	throw new Error("No JWT_SECRET env variable found.");
}

if (JWT_REFRESH_SECRET === undefined) {
	throw new Error("No JWT_REFRESH_SECRET env variable found.");
}

if (EXPO_ACCESS_TOKEN === undefined) {
	throw new Error("No EXPO_ACCESS_TOKEN env variable found.");
}

if (FINTOC_PUBLIC_KEY === undefined) {
	throw new Error("No FINTOC_PUBLIC_KEY env variable found.");
}

if (FINTOC_SECRET_KEY === undefined) {
	throw new Error("No FINTOC_SECRET_KEY env variable found.");
}

const SWAGGER_ENVS = ["local", "dev", "staging", "production"];

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true, bodyLimit: 100 * 1024 * 1024 })
	);
	await app.register(multiPart);
	app.enableCors();
	app.setGlobalPrefix("api/v1");

	const config = new DocumentBuilder()
		.setTitle("Pary Api")
		.setDescription("La api oficial de Pary.")
		.addBearerAuth()
		.setVersion("1.0")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
		SwaggerModule.setup("", app, document, {
			customSiteTitle: "La api oficial de Pary",
			customfavIcon: "https://static1.smartbear.co/swagger/media/assets/swagger_fav.png",
			customJs: [
				"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.1/swagger-ui-standalone-preset.js",
				"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.1/swagger-ui-bundle.js",
				"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.1/swagger-ui-standalone-preset.js"
			],
			customCssUrl: ["https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.1/swagger-ui.css"]
		});
	}
	await app.listen(PUBLIC_API_PORT || 3000, PUBLIC_API_URL);
}

bootstrap();
