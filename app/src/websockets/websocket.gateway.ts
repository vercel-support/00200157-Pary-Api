import { Injectable } from "@nestjs/common";
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

@WebSocketGateway(parseInt(PUBLIC_API_PORT), {
	cors: {
		origin: "*"
	}
})
@Injectable()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private prisma: PrismaService) {}
	@WebSocketServer() server: Server;

	afterInit(server: any) {
		this.server = server;
	}

	handleDisconnect(client: Socket) {}

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
	}
}
