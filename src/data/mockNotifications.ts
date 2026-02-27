// Mock data for Notifications and Messages
// TODO: Replace with API calls
import type { Notification, Conversation, Message } from "../@type/notification";

// Mock Notifications - TODO: Replace with API call to /api/notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "like",
    user: {
      id: "user-1",
      email: "trainer1@powergym.com",
      fullName: "PT John Smith",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    content: "liked your workout",
    postId: "post-1",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    type: "comment",
    user: {
      id: "user-2",
      email: "member1@powergym.com",
      fullName: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    content: "commented on your workout: 'Perfect form!'",
    postId: "post-3",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    type: "follow",
    user: {
      id: "user-3",
      email: "trainer2@powergym.com",
      fullName: "PT Mike Wilson",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    content: "started following you",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    type: "mention",
    user: {
      id: "user-4",
      email: "member2@powergym.com",
      fullName: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    content: "mentioned you in a comment about a workout",
    postId: "post-2",
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-5",
    type: "system",
    content: "Welcome to PowerGym! Please complete your workout profile.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-6",
    type: "like",
    user: {
      id: "user-5",
      email: "trainer3@powergym.com",
      fullName: "PT David Brown",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    content: "and 5 others liked your workout video",
    postId: "post-4",
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Messages - TODO: Replace with API call to /api/messages
const mockMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "user-1",
    content: "Hi! Do you have a workout scheduled today?",
    type: "text",
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "current-user",
    content: "Yes, I'm getting ready to go to the gym. What's up?",
    type: "text",
    read: true,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-3",
    conversationId: "conv-2",
    senderId: "user-2",
    content: "Want to grab coffee today? ☕",
    type: "text",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-4",
    conversationId: "conv-3",
    senderId: "user-3",
    content: "Thanks for sharing the post!",
    type: "text",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-5",
    conversationId: "conv-4",
    senderId: "user-4",
    content: "Can you send me the file?",
    type: "text",
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-6",
    conversationId: "conv-5",
    senderId: "user-5",
    content: "Meeting at 3pm!",
    type: "text",
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Conversations - TODO: Replace with API call to /api/conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [
      {
        id: "user-1",
        email: "trainer1@powergym.com",
        fullName: "PT John Smith",
        avatar: "https://i.pravatar.cc/150?img=11",
        online: true,
      },
    ],
    lastMessage: mockMessages[1],
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "conv-2",
    participants: [
      {
        id: "user-2",
        email: "member1@powergym.com",
        fullName: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=5",
        online: true,
      },
    ],
    lastMessage: mockMessages[2],
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "conv-3",
    participants: [
      {
        id: "user-3",
        email: "trainer2@powergym.com",
        fullName: "PT Mike Wilson",
        avatar: "https://i.pravatar.cc/150?img=12",
        online: false,
      },
    ],
    lastMessage: mockMessages[3],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "conv-4",
    participants: [
      {
        id: "user-4",
        email: "member2@powergym.com",
        fullName: "Emily Davis",
        avatar: "https://i.pravatar.cc/150?img=9",
        online: false,
      },
    ],
    lastMessage: mockMessages[4],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "conv-5",
    participants: [
      {
        id: "user-5",
        email: "trainer3@powergym.com",
        fullName: "PT David Brown",
        avatar: "https://i.pravatar.cc/150?img=13",
        online: true,
      },
    ],
    lastMessage: mockMessages[5],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper function to get messages by conversation
export const getMessagesByConversation = (conversationId: string): Message[] => {
  return mockMessages.filter((msg) => msg.conversationId === conversationId);
};
