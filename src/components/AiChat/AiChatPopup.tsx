import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import { aiChatService } from "../../services/aiChatService";
import type { ChatMessage } from "../../services/aiChatService";
import "./AiChatPopup.css";

export const AiChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
          "Hello! I'm the AI assistant of PowerGym. I can help you explore membership plans, gym services, trainers, and book workout sessions. How can I assist you?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await aiChatService.sendMessage(userMessage.content);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
            error.message ||
            "Sorry, something went wrong. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
      <>
        {/* Chat Button */}
        {!isOpen && (
            <button
                className="ai-chat-button"
                onClick={() => setIsOpen(true)}
                aria-label="Open AI chat"
            >
              <MessageCircle size={24} />
              <span className="ai-chat-button-badge">Power-AI</span>
            </button>
        )}

        {/* Chat Window */}
        {isOpen && (
            <div className="ai-chat-window">
              {/* Header */}
              <div className="ai-chat-header">
                <div className="ai-chat-header-content">
                  <div className="ai-chat-avatar">
                    <MessageCircle size={20} />
                  </div>
                  <div className="ai-chat-header-text">
                    <h3>PowerGym AI Assistant</h3>
                    <span className="ai-chat-status">
                  <span className="ai-chat-status-dot"></span>
                  Active
                </span>
                  </div>
                </div>
                <button
                    className="ai-chat-close-button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="ai-chat-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`ai-chat-message ${
                            message.role === "user"
                                ? "ai-chat-message-user"
                                : "ai-chat-message-assistant"
                        }`}
                    >
                      <div className="ai-chat-message-content">
                        <p>{message.content}</p>
                        <span className="ai-chat-message-time">
                    {formatTime(message.timestamp)}
                  </span>
                      </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="ai-chat-message ai-chat-message-assistant">
                      <div className="ai-chat-message-content">
                        <div className="ai-chat-loading">
                          <Loader2 size={16} className="ai-chat-loading-spinner" />
                          <span>Thinking...</span>
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
                <button
                    className="ai-chat-send-button"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
        )}
      </>
  );
};