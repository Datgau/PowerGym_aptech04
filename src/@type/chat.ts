export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  senderEmail: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UserSearchResult {
  id: number;
  email: string;
  fullName: string;
  avatar: string;
}

export interface Conversation {
  roomId: number;
  isGroup: boolean;
  roomName: string | null;
  memberIds: number[];
  members: UserSearchResult[];
  lastMessage: ChatMessage | null;
  lastUpdated: string | null;
  unreadCount: number;
}

export interface SendMessageRequest {
  roomId: number;
  senderId: number;
  message: string;
}

export interface CreateRoomRequest {
  name: string;
  memberIds: number[];
}

export interface WebSocketMessage {
  roomId: number;
  senderId: number;
  message: string;
}
