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
import { ChatRoom, MessageDto } from "./dto/Chat.dto";

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

	async handleDisconnect(client: Socket) {
		const user = await this.prisma.user.findFirst({
			where: {
				webSocketId: client.id
			},
			select: {
				id: true
			}
		});
		console.log("Client disconnected:", client.id, user?.id);
		if (user) {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					webSocketId: ""
				}
			});
		}
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log("New client connected, id:", client.id);
		const user = await this.prisma.user.findFirst({
			where: {
				webSocketId: client.id
			},
			select: {
				id: true
			}
		});

		if (!user) {
			client.send("reconnect-user");
			console.log("User not found, reconnecting user:", client.id);
		}
	}

	@SubscribeMessage("connect-user")
	async connectUser(client: Socket, userId: string) {
		console.log("User connectedd:", client.id, userId);
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				webSocketId: client.id
			}
		});
	}

	@SubscribeMessage("user-message")
	async userMessage(client: Socket, chatRoom: ChatRoom) {
		console.log(client.id, "Sent a message:", chatRoom);
		return true;
	}

	@SubscribeMessage("join-chat-room")
	async joinChatRoom(client: Socket, chatId: string) {
		console.log(client.id, "Joined chat room:", chatId);
		client.rooms.forEach(room => {
			client.leave(room);
		});
		client.join(chatId);
	}

	@SubscribeMessage("leave-chat-room")
	async leaveChatRoom(client: Socket) {
		console.log(client.id, "Left chat room");
		client.rooms.forEach(room => {
			client.leave(room);
		});
	}
}
