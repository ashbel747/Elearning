import React, { useState, useEffect, useRef } from "react";
import { type DisplayMessage, type ChatContext } from "../../shared/chatTypes";
import { MessageBubble } from "./MessageBubble";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";
import { sendMessage, getHistory, convertToDisplayMessage } from "../../services/chatApi";

export const VirtualAssistant: React.FC<{ context: ChatContext }> = ({ context }) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize session ID and load chat history
  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);

    // Load chat history if session exists
    const loadHistory = async () => {
      try {
        const historyResponse = await getHistory(newSessionId);
        if (historyResponse.history.length > 0) {
          const displayMessages = historyResponse.history.map(convertToDisplayMessage);
          setMessages(displayMessages);
        } else {
          // Show welcome message for new sessions
          const welcomeMessage: DisplayMessage = {
            id: crypto.randomUUID(),
            sender: "assistant",
            text: "Welcome to your AI Learning Assistant! I'm here to help you with your learning journey. Ask me anything about courses, lessons, or general help.",
            timestamp: new Date().toISOString(),
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        // Show welcome message on error
        const welcomeMessage: DisplayMessage = {
          id: crypto.randomUUID(),
          sender: "assistant",
          text: "Welcome to your AI Learning Assistant! I'm here to help you with your learning journey. Ask me anything about courses, lessons, or general help.",
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    };

    loadHistory();
  }, []);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !sessionId) return;

    const newMessage: DisplayMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Send message to API with context
      const response = await sendMessage({
        sessionId,
        message: text,
        context: {
          page: context.page,
          courseId: context.courseId,
          lessonId: context.lessonId,
        },
      });

      // Add AI response to messages
      const assistantResponse: DisplayMessage = {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: response.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Show error message
      const errorMessage: DisplayMessage = {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-amber-50 relative rounded-2xl overflow-hidden shadow-lg border border-amber-100">
      {/* Quick Actions Header */}
      <QuickActions onSelect={handleSend} />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 p-6 pt-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-white rounded-2xl border border-gray-300 px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
            <input
              className="w-full outline-none text-gray-700 placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask General Help..."
              onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
              disabled={isTyping}
            />
          </div>
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
          >
            {isTyping ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 4v4m0-8h.01M12 16h.01" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};