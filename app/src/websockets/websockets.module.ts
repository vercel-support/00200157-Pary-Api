import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { WebsocketGateway } from "./websocket.gateway";
import { PrismaModule } from "../prisma/prisma.module";
import { UtilsModule } from "../utils/utils.module";

@Module({
	providers: [WebsocketGateway],
	exports: [WebsocketGateway],
	imports: [PrismaModule, UtilsModule]
})
export class WebSocketsModule {}
