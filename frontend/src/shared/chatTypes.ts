export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface ChatContext {
  page: string;
  courseId?: string;
  lessonId?: string;
}

// Frontend-specific message structure for display
export interface DisplayMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

// API request structure
export interface ChatRequest {
  sessionId: string;
  message: string;
  context?: {
    page: string;
    courseId?: string;
    lessonId?: string;
  };
}

// API response structure
export interface ChatResponse {
  sessionId: string;
  reply: string;
  context: ChatMessage[];
}

// History response structure
export interface HistoryResponse {
  sessionId: string;
  history: ChatMessage[];
}

// Error response structure
export interface ErrorResponse {
  error: string;
  code?: number;
}
