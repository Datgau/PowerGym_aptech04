import { publicClient } from "./api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
}

/**
 * AI Chat Service
 * Handles communication with AI Gym Chatbot backend
 */
class AiChatService {
  /**
   * Send a message to the AI chatbot
   * @param message User's message
   * @returns AI's response
   */
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await publicClient.post<string>("/chat/ask", {
        message,
      });
      return response.data;
    } catch (error: any) {
      console.error("AI Chat error:", error);
      
      if (error.response?.status === 503) {
        throw new Error("Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.");
      }
      
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      
      throw new Error("Không thể kết nối với chatbot. Vui lòng thử lại sau.");
    }
  }
}

export const aiChatService = new AiChatService();
export type { AiChatService };
