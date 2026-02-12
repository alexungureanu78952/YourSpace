export interface MessageDto {
    id: number;
    senderId: number;
    senderUsername: string;
    receiverId: number;
    receiverUsername: string;
    content: string;
    sentAt: string;
    isRead: boolean;
    readAt?: string;
}

export interface ConversationDto {
    otherUserId: number;
    otherUsername: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
}

export interface SendMessageRequest {
    receiverId: number;
    content: string;
}
