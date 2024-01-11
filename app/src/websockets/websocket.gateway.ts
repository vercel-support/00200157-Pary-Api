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
		console.log("New client connected, id:", client.id, client.handshake.query?.userId);
		if (!client.handshake.query?.userId) {
			throw new Error("No user id provided");
		}
		await this.prisma.user.update({
			where: {
				id: client.handshake.query.userId as string
			},
			data: {
				webSocketId: client.id
			}
		});
	}

	@SubscribeMessage("user-message")
	async userMessage(client: Socket, chatRoom: ChatRoom) {
		for (const message of chatRoom.messages) {
			await this.prisma.message.create({
				data: {
					id: message._id,
					chatId: chatRoom.chatId,
					userId: chatRoom.userId,
					text: message.text,
					createdAt: message.createdAt,
					image: message.image,
					video: message.video,
					system: message.system,
					sent: message.sent,
					received: message.received
				}
			});
		}
		this.server.to(chatRoom.chatId).emit("new-messages", chatRoom.messages);
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
