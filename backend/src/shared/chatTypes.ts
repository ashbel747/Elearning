export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string; // ISO string
}

// What the frontend sends when user sends a message
export interface MessageRequest {
  sessionId: string;
  message: string;
}

// What the backend replies with after processing a user message
export interface MessageResponse {
  sessionId: string;
  reply: string;
  context: ChatMessage[]; // updated session history
}

// For retrieving chat history of a session
export interface HistoryResponse {
  sessionId: string;
  history: ChatMessage[];
}

// Error shape for consistency
export interface ErrorResponse {
  error: string;
  code?: number;
}
