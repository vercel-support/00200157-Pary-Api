"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINTOC_SECRET_KEY = exports.FINTOC_PUBLIC_KEY = exports.PUBLIC_API_PORT = exports.PUBLIC_API_URL = exports.EXPO_ACCESS_TOKEN = exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = void 0;
const multipart_1 = require("@fastify/multipart");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./src/app.module");
_a = process.env, exports.JWT_SECRET = _a.JWT_SECRET, exports.JWT_REFRESH_SECRET = _a.JWT_REFRESH_SECRET, exports.EXPO_ACCESS_TOKEN = _a.EXPO_ACCESS_TOKEN, exports.PUBLIC_API_URL = _a.PUBLIC_API_URL, exports.PUBLIC_API_PORT = _a.PUBLIC_API_PORT, exports.FINTOC_PUBLIC_KEY = _a.FINTOC_PUBLIC_KEY, exports.FINTOC_SECRET_KEY = _a.FINTOC_SECRET_KEY;
if (exports.JWT_SECRET === undefined) {
    throw new Error("No JWT_SECRET env variable found.");
}
if (exports.JWT_REFRESH_SECRET === undefined) {
    throw new Error("No JWT_REFRESH_SECRET env variable found.");
}
if (exports.EXPO_ACCESS_TOKEN === undefined) {
    throw new Error("No EXPO_ACCESS_TOKEN env variable found.");
}
if (exports.FINTOC_PUBLIC_KEY === undefined) {
    throw new Error("No FINTOC_PUBLIC_KEY env variable found.");
}
if (exports.FINTOC_SECRET_KEY === undefined) {
    throw new Error("No FINTOC_SECRET_KEY env variable found.");
}
const SWAGGER_ENVS = ["local", "dev", "staging", "production"];
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({ logger: true, bodyLimit: 100 * 1024 * 1024 }));
    await app.register(multipart_1.default);
    app.enableCors();
    app.setGlobalPrefix("api/v1");
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Pary Api")
        .setDescription("La api oficial de Pary.")
        .addBearerAuth()
        .setVersion("1.3.1")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
        swagger_1.SwaggerModule.setup("", app, document, {
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
    await app.listen(exports.PUBLIC_API_PORT || 3000, exports.PUBLIC_API_URL);
}
bootstrap();
//# sourceMappingURL=main.js.map