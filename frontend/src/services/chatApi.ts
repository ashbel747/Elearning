import API from "../api/axios";
import {
  type ChatRequest,
  type ChatResponse,
  type HistoryResponse,
  type ChatMessage,
} from "../shared/chatTypes";

export const sendMessage = async (req: ChatRequest): Promise<ChatResponse> => {
  const { data } = await API.post<ChatResponse>("/chat/message", req);
  return data;
};

export const getHistory = async (sessionId: string): Promise<HistoryResponse> => {
  const { data } = await API.get<HistoryResponse>(`/chat/history/${sessionId}`);
  return data;
};

// Helper function to convert backend messages to frontend display format
export const convertToDisplayMessage = (message: ChatMessage): {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
} => {
  return {
    id: crypto.randomUUID(),
    sender: message.role === "user" ? "user" : "assistant",
    text: message.content,
    timestamp: message.timestamp,
  };
};
