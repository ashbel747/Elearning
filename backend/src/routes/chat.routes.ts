import { Router } from "express";
import { ChatSession } from "../models/ChatSession";
import { callAI } from "../services/aiService";
import {
  MessageRequest,
  MessageResponse,
  HistoryResponse,
  ErrorResponse,
  ChatMessage,
} from "../shared/chatTypes";

const router = Router();

// POST /api/chat/message - Send a message
router.post("/message", async (req, res) => {
  try {
    const { sessionId, message, context }: MessageRequest & { context?: any } = req.body;

    // Validation
    if (!sessionId || !message) {
      const errorResponse: ErrorResponse = {
        error: "sessionId and message are required",
        code: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Find or create a chat session
    let session = await ChatSession.findById(sessionId);
    if (!session) {
      session = new ChatSession({
        _id: sessionId,
        messages: [],
        context: context || {},
      });
    }

    // Update context if provided
    if (context) {
      session.context = { ...session.context, ...context };
    }

    // Create user message
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Add user message to session
    session.messages.push(userMessage);

    // Call AI service with context
    const aiResponse = await callAI(session.messages);

    // Create AI message
    const aiMessage: ChatMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    // Add AI response to session
    session.messages.push(aiMessage);

    // Save session
    await session.save();

    // Send response
    const response: MessageResponse = {
      sessionId,
      reply: aiResponse,
      context: session.messages.slice(-10), // Last 10 messages for context
    };

    res.json(response);
  } catch (err) {
    console.error("Error in /message:", err);
    const errorResponse: ErrorResponse = {
      error: "Internal server error",
      code: 500,
    };
    res.status(500).json(errorResponse);
  }
});

// GET /api/chat/history/:sessionId - Get chat history
router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!sessionId) {
      const errorResponse: ErrorResponse = {
        error: "sessionId is required",
        code: 400,
      };
      return res.status(400).json(errorResponse);
    }

    const session = await ChatSession.findById(sessionId);

    if (!session) {
      // Return empty history if session doesn't exist
      const response: HistoryResponse = {
        sessionId,
        history: [],
      };
      return res.json(response);
    }

    const response: HistoryResponse = {
      sessionId,
      history: session.messages.slice(-limit), // Get last N messages
    };

    res.json(response);
  } catch (err) {
    console.error("Error in /history:", err);
    const errorResponse: ErrorResponse = {
      error: "Internal server error",
      code: 500,
    };
    res.status(500).json(errorResponse);
  }
});

export default router;
