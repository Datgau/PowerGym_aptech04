import { publicClient } from "./api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ServiceCard {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  priceFormatted: string | null;
  duration: number | null;
  maxParticipants: number | null;
  category: string | null;
  images: string[];
  thumbnail: string | null;
}

export interface MembershipCard {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  priceFormatted: string | null;
  originalPriceFormatted: string | null;
  duration: number | null;
  discount: number | null;
  isPopular: boolean;
  color: string | null;
  features: string[];
}

export interface TrainerCard {
  id: number;
  fullName: string;
  bio: string | null;
  avatar: string | null;
  totalExperienceYears: number | null;
  specialties: { name: string; experienceYears: number | null }[];
}

/** Full response from /api/chat/ask — data is embedded, no extra fetch needed */
export interface ChatApiResponse {
  text: string;
  services?: ServiceCard[] | null;
  memberships?: MembershipCard[] | null;
  trainers?: TrainerCard[] | null;
}

class AiChatService {
  private sessionId: string = crypto.randomUUID();

  async sendMessage(message: string): Promise<ChatApiResponse> {
    try {
      const response = await publicClient.post<ChatApiResponse>("/chat/ask", {
        message,
        sessionId: this.sessionId,
      });
      return response.data;
    } catch (error: any) {
      console.error("AI Chat error:", error);
      if (error.response?.status === 503) {
        throw new Error("Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.");
      }
      if (error.response?.data?.text) {
        throw new Error(error.response.data.text);
      }
      throw new Error("Không thể kết nối với chatbot. Vui lòng thử lại sau.");
    }
  }

  resetSession(): void {
    this.sessionId = crypto.randomUUID();
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const aiChatService = new AiChatService();
