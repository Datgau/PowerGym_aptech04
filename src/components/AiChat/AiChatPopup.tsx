import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2, RotateCcw } from "lucide-react";
import { aiChatService } from "../../services/aiChatService";
import type {
  ChatMessage,
  ChatApiResponse,
  ServiceCard,
  MembershipCard,
  TrainerCard,
} from "../../services/aiChatService";
import "./AiChatPopup.css";

// ==================== CARD COMPONENTS ====================

const ServiceCardItem: React.FC<{ s: ServiceCard }> = ({ s }) => (
  <div className="ai-card">
    {s.thumbnail && (
      <img src={s.thumbnail} alt={s.name} className="ai-card-img"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    )}
    <div className="ai-card-body">
      <h4 className="ai-card-name">{s.name}</h4>
      {s.category && <span className="ai-card-badge">{s.category}</span>}
      {s.description && <p className="ai-card-desc">{s.description}</p>}
      <div className="ai-card-meta">
        {s.priceFormatted && <span className="ai-card-price">{s.priceFormatted}</span>}
        {s.duration && <span className="ai-card-sub">{s.duration} phút</span>}
        {s.maxParticipants && <span className="ai-card-sub">Tối đa {s.maxParticipants} người</span>}
      </div>
      <a href={`/service/${s.id}`} className="ai-card-btn">Đăng ký ngay →</a>
    </div>
  </div>
);

const MembershipCardItem: React.FC<{ m: MembershipCard }> = ({ m }) => (
  <div className="ai-card ai-card--membership" style={{ borderTop: m.color ? `3px solid ${m.color}` : undefined }}>
    <div className="ai-card-body">
      <div className="ai-card-header-row">
        <h4 className="ai-card-name">{m.name}</h4>
        {m.isPopular && <span className="ai-card-badge ai-card-badge--popular">Phổ biến</span>}
      </div>
      {m.discount && m.discount > 0 && (
        <span className="ai-card-badge ai-card-badge--discount">Giảm {m.discount}%</span>
      )}
      {m.description && <p className="ai-card-desc">{m.description}</p>}
      <div className="ai-card-meta">
        <span className="ai-card-price">{m.priceFormatted}</span>
        {m.originalPriceFormatted && (
          <span className="ai-card-original-price">{m.originalPriceFormatted}</span>
        )}
        <span className="ai-card-sub">{m.duration} ngày</span>
      </div>
      {m.features && m.features.length > 0 && (
        <ul className="ai-card-features">
          {m.features.slice(0, 3).map((f, i) => <li key={i}>✓ {f}</li>)}
          {m.features.length > 3 && <li className="ai-card-more">+{m.features.length - 3} quyền lợi khác</li>}
        </ul>
      )}
      <a href="/pricing" className="ai-card-btn">Đăng ký gói →</a>
    </div>
  </div>
);

const TrainerCardItem: React.FC<{ t: TrainerCard }> = ({ t }) => (
  <div className="ai-card ai-card--trainer">
    <div className="ai-card-trainer-top">
      {t.avatar
        ? <img src={t.avatar} alt={t.fullName} className="ai-card-avatar"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        : <div className="ai-card-avatar-placeholder">{t.fullName.charAt(0)}</div>
      }
      <div>
        <h4 className="ai-card-name">{t.fullName}</h4>
        {t.totalExperienceYears != null && (
          <span className="ai-card-sub">{t.totalExperienceYears} năm kinh nghiệm</span>
        )}
      </div>
    </div>
    {t.specialties && t.specialties.length > 0 && (
      <div className="ai-card-specialties">
        {t.specialties.map((sp, i) => (
          <span key={i} className="ai-card-badge">{sp.name}</span>
        ))}
      </div>
    )}
    {t.bio && <p className="ai-card-desc">{t.bio}</p>}
    <a href="/service" className="ai-card-btn">Đặt lịch →</a>
  </div>
);

// ==================== MAIN COMPONENT ====================

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hello! I'm PowerGym's AI assistant. I can help you find membership packages, gym services, trainers, and book training sessions. How can I assist you today?",
  timestamp: new Date(),
};

interface MessageWithCards {
  message: ChatMessage;
  services?: ServiceCard[];
  memberships?: MembershipCard[];
  trainers?: TrainerCard[];
}

export const AiChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<MessageWithCards[]>([{ message: WELCOME_MESSAGE }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setItems((prev) => [...prev, { message: { role: "user", content: userText, timestamp: new Date() } }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res: ChatApiResponse = await aiChatService.sendMessage(userText);

      setItems((prev) => [
        ...prev,
        {
          message: { role: "assistant", content: res.text, timestamp: new Date() },
          services: res.services ?? undefined,
          memberships: res.memberships ?? undefined,
          trainers: res.trainers ?? undefined,
        },
      ]);
    } catch (error: any) {
      setItems((prev) => [
        ...prev,
        { message: { role: "assistant", content: error.message || "Sorry, an error occurred.", timestamp: new Date() } },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    aiChatService.resetSession();
    setItems([{ message: { ...WELCOME_MESSAGE, timestamp: new Date() } }]);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {!isOpen && (
        <button className="ai-chat-button" onClick={() => setIsOpen(true)} aria-label="Open AI chat">
          <MessageCircle size={24} />
          <span className="ai-chat-button-badge">Power-AI</span>
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-content">
              <div className="ai-chat-avatar"><MessageCircle size={20} /></div>
              <div className="ai-chat-header-text">
                <h3>PowerGym AI Assistant</h3>
                <span className="ai-chat-status">
                  <span className="ai-chat-status-dot"></span>Active
                </span>
              </div>
            </div>
            <div className="ai-chat-header-actions">
              <button className="ai-chat-new-button" onClick={handleNewChat} title="New conversation">
                <RotateCcw size={16} />
              </button>
              <button className="ai-chat-close-button" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {items.map((item, index) => (
              <div key={index}>
                {/* Message bubble */}
                <div className={`ai-chat-message ${item.message.role === "user" ? "ai-chat-message-user" : "ai-chat-message-assistant"}`}>
                  <div className="ai-chat-message-content">
                    <p>{item.message.content}</p>
                    <span className="ai-chat-message-time">{formatTime(item.message.timestamp)}</span>
                  </div>
                </div>

                {/* Service cards */}
                {item.services && item.services.length > 0 && (
                  <div className="ai-cards-section">
                    <p className="ai-cards-label">🏋️ Dịch vụ được đề xuất</p>
                    <div className="ai-cards-list">
                      {item.services.map((s) => <ServiceCardItem key={s.id} s={s} />)}
                    </div>
                  </div>
                )}

                {/* Membership cards */}
                {item.memberships && item.memberships.length > 0 && (
                  <div className="ai-cards-section">
                    <p className="ai-cards-label">🎫 Gói thành viên</p>
                    <div className="ai-cards-list">
                      {item.memberships.map((m) => <MembershipCardItem key={m.id} m={m} />)}
                    </div>
                  </div>
                )}

                {/* Trainer cards */}
                {item.trainers && item.trainers.length > 0 && (
                  <div className="ai-cards-section">
                    <p className="ai-cards-label">👤 Huấn luyện viên</p>
                    <div className="ai-cards-list">
                      {item.trainers.map((t) => <TrainerCardItem key={t.id} t={t} />)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="ai-chat-message ai-chat-message-assistant">
                <div className="ai-chat-message-content">
                  <div className="ai-chat-loading">
                    <Loader2 size={16} className="ai-chat-loading-spinner" />
                    <span>Processing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat-input-container">
            <textarea
              ref={inputRef}
              className="ai-chat-input"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              disabled={isLoading}
            />
            <button className="ai-chat-send-button" onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
