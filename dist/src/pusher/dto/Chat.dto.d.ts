export declare class ChatUser {
    _id: string;
    name: string;
    avatar: string;
    username: string;
}
export declare class MessageDto {
    _id: string;
    text: string;
    user: ChatUser;
    createdAt: Date;
    image?: string;
    video?: string;
    system?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
}
export declare class ChatRoom {
    messages: MessageDto[];
    chatId: string;
}
