// import api from './api';
// import type {ChatMessage, Conversation, CreateRoomRequest, UserSearchResult} from '../@type/chat';
// import {type ApiResponse, unwrapApiResponse} from "../@type/apiResponse.ts";
//
// export const chatService = {
//   async getConversations(userId: number): Promise<Conversation[]> {
//     const response = await api.get(`/chat/conversations/${userId}`);
//     return response.data;
//   },
//
//   async getMessages(roomId: number, page: number = 0, size: number = 50): Promise<ChatMessage[]> {
//     const response = await api.get(`/chat/rooms/${roomId}/messages`, {
//       params: { page, size }
//     });
//     return response.data;
//   },
//
//   async getOrCreateOneToOne(userA: number, userB: number): Promise<number> {
//     const response = await api.post(`/chat/rooms/1to1?userA=${userA}&userB=${userB}`);
//     return response.data;
//   },
//
//   // Tạo group room
//   async createGroupRoom(request: CreateRoomRequest): Promise<number> {
//     const response = await api.post('/chat/rooms', request);
//     return response.data;
//   },
//
//   async sendMessage(roomId: number, senderId: number, message: string): Promise<ChatMessage> {
//     const response = await api.post('/chat/messages', {
//       roomId,
//       senderId,
//       message
//     });
//     return response.data;
//   },
//
//
//   async getUsersByFollow(
//       page: number = 0,
//       size: number = 20
//   ): Promise<UserSearchResult[]> {
//     try {
//       const res = await api.get<ApiResponse<UserSearchResult[]>>(
//           `/chat/users`,
//           { params: { page, size } }
//       );
//
//       return unwrapApiResponse(res.data);
//     } catch (error) {
//       console.error("Get all users error", error);
//       return [];
//     }
//   },
//
//
//   async markMessagesAsRead(roomId: number, userId: number): Promise<void> {
//     await api.post(`/chat/rooms/${roomId}/read`, null, {
//       params: { userId }
//     });
//   }
// };
