import axios from "axios";
import {
  type ChatRequest,
  type ChatResponse,
  type ChatMessage,
} from "../shared/chatTypes";

export const sendMessage = async (req: ChatRequest) => {
  const { data } = await axios.post<ChatResponse>("/api/chat/message", req);
  return data;
};

export const getHistory = async (sessionId: string) => {
  const { data } = await axios.get<ChatMessage[]>(
    `/api/chat/history/${sessionId}`
  );
  return data;
};
