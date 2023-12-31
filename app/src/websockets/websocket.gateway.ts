import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { PUBLIC_API_PORT } from "app/main";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../db/services/prisma.service";
import { UtilsService } from "../utils/services/utils.service";
import { Injectable } from "@nestjs/common";

@WebSocketGateway(parseInt(PUBLIC_API_PORT), {
	cors: {
		origin: "*"
	}
})
@Injectable()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private prisma: PrismaService,
		private utils: UtilsService
	) {}
	@WebSocketServer() server: Server;

	afterInit(server: any) {
		this.server = server;
	}

	handleDisconnect(client: Socket) {
		console.log("WebsocketGateway disconnected:", client.id);
	}

	handleConnection(client: Socket, ...args: any[]) {}

	@SubscribeMessage("connect-user")
	async connectUser(client: Socket, userId: string) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				webSocketId: client.id
			}
		});
		console.log("Usuario Conectado", client.id, userId);
		client.emit("payment", "ok");
	}
}
