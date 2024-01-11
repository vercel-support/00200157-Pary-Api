import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
	@IsOptional()
	@IsString()
	image?: string;
	@IsOptional()
	@IsString()
	video?: string;
	@IsOptional()
	@IsBoolean()
	system?: boolean;
	@IsOptional()
	@IsBoolean()
	sent?: boolean;
	@IsOptional()
	@IsBoolean()
	received?: boolean;
	@IsOptional()
	@IsBoolean()
	pending?: boolean;
}

export class ChatRoom {
	@IsNotEmpty()
	messages: MessageDto[];
	chatId: string;
}
