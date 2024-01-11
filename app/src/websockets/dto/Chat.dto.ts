import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ChatUser {
	@IsString()
	@IsNotEmpty()
	_id: string;
	@IsString()
	@IsNotEmpty()
	name: string;
	@IsString()
	@IsNotEmpty()
	avatar: string;
}

export class MessageDto {
	@IsString()
	@IsNotEmpty()
	_id: string;
	@IsString()
	@IsNotEmpty()
	text: string;

	@IsString()
	@IsNotEmpty()
	user: ChatUser;

	@IsDate()
	@IsNotEmpty()
	createdAt: Date;
}

export class ChatRoom {
	@IsNotEmpty()
	messages: MessageDto[];
	chatId: string;
	userId: string;
}
