// Types cho Notification và Message
export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "system";
  user?: {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  content: string;
  postId?: string;
  read: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
    online: boolean;
  }[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}
