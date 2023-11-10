import {NestFactory} from "@nestjs/core";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {AppModule} from "./app.module";

export const {JWT_SECRET, JWT_REFRESH_SECRET, EXPO_ACCESS_TOKEN, PUBLIC_API_URL} = process.env;

if (JWT_SECRET === undefined) {
    throw new Error("No JWT_SECRET env variable found.");
}

if (JWT_REFRESH_SECRET === undefined) {
    throw new Error("No JWT_REFRESH_SECRET env variable found.");
}

if (EXPO_ACCESS_TOKEN === undefined) {
    throw new Error("No EXPO_ACCESS_TOKEN env variable found.");
}

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({logger: true, bodyLimit: 50 * 1024 * 1024}),
    );
    app.enableCors();
    await app.listen(3000, PUBLIC_API_URL);
}
bootstrap();
