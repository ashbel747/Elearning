import { ChatMessage } from "../shared/chatTypes";
import axios from "axios";

// AI API configuration
const AI_API_URL = process.env.AI_API_URL || "https://elearning-2-2qs2.onrender.com";
const AI_API_KEY = process.env.AI_API_KEY || "";

interface AIRequest {
  message: string;
  context?: string;
  sessionId: string;
}

interface AIResponse {
  reply: string;
  context?: string;
}

// Enhanced contextual responses for educational assistance
const getContextualResponse = (userMessage: string, context?: string): string => {
  const message = userMessage.toLowerCase();
  const contextLower = context?.toLowerCase() || "";

  // Course-related queries
  if (message.includes("course") || message.includes("enroll")) {
    if (contextLower.includes("foundations")) {
      return "For the Foundations course, you'll start with basic concepts like terminal usage and self-directed learning. This course is perfect for beginners and will prepare you for more advanced topics.";
    }
    if (contextLower.includes("fullstack")) {
      return "The Fullstack course covers JavaScript fundamentals and MongoDB. You'll learn both frontend and backend development to create complete web applications.";
    }
    if (contextLower.includes("genai")) {
      return "The GenAI course focuses on Vector Databases and FastAPI basics. You'll learn about modern AI technologies and how to build AI-powered applications.";
    }
    if (contextLower.includes("uiux")) {
      return "The UI/UX course covers design stages and design systems. You'll learn user-centered design principles and create beautiful, functional interfaces.";
    }
    return "To enroll in a course, navigate to the course page and click the 'Enroll' button. You can browse all available courses from your dashboard.";
  }

  // Lesson-specific queries
  if (message.includes("lesson") || message.includes("video")) {
    if (contextLower.includes("terminal")) {
      return "The Terminal lesson covers basic command line operations. You'll learn essential commands for navigating your system and managing files.";
    }
    if (contextLower.includes("javascript")) {
      return "The JavaScript lesson introduces you to programming fundamentals. You'll learn variables, functions, and control structures.";
    }
    if (contextLower.includes("mongodb")) {
      return "The MongoDB lesson teaches you database concepts and NoSQL data modeling. You'll learn to store and retrieve data efficiently.";
    }
    return "Video lessons can be accessed from your enrolled courses. You can pause, rewind, and take notes while watching. Your progress is automatically saved.";
  }

  // Quiz and assessment queries
  if (message.includes("quiz") || message.includes("test") || message.includes("assessment")) {
    return "Quizzes are available for each lesson to help you test your understanding. They include multiple-choice questions and practical exercises. Your progress is automatically saved and you can retake quizzes to improve your score.";
  }

  // Certificate and progress queries
  if (message.includes("certificate") || message.includes("progress")) {
    return "Your certificates are available in your profile section once you complete a course. Track your progress through the dashboard and see your completion percentage for each course.";
  }

  // Profile and account queries
  if (message.includes("profile") || message.includes("account") || message.includes("settings")) {
    return "You can update your profile by clicking on your avatar in the top-right corner and selecting 'Profile Settings'. Here you can manage your personal information, preferences, and account security.";
  }

  // Help and support queries
  if (message.includes("help") || message.includes("support") || message.includes("trouble")) {
    return "I'm here to help! You can ask me about specific courses, lessons, quizzes, certificates, or general platform navigation. For technical issues, please contact our support team.";
  }

  // Learning strategies and tips
  if (message.includes("learn") || message.includes("study") || message.includes("practice")) {
    return "For effective learning, I recommend: 1) Complete lessons in order, 2) Take notes during videos, 3) Practice with quizzes, 4) Work on projects, 5) Review concepts regularly. Consistency is key to success!";
  }

  // Default response with context awareness
  if (context) {
    return `I understand you're asking about: "${userMessage}". Based on your current context (${context}), I'd recommend focusing on the specific course content. You can ask me about lessons, quizzes, or general course guidance.`;
  }

  return "I understand you're asking about: " + userMessage + ". I'm here to help with your learning journey! You can ask me about courses, lessons, quizzes, certificates, or general platform navigation.";
};

export const callAI = async (messages: ChatMessage[]): Promise<string> => {
  try {
    // Get the last user message and context
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return "Hello! How can I help you today?";
    }

    // Extract context from recent messages
    const recentContext = messages
      .slice(-5)
      .map(msg => msg.content)
      .join(" ");

    // Try to call external AI API first
    if (AI_API_URL && AI_API_URL !== "https://elearning-2-2qs2.onrender.com") {
      try {
        const aiRequest: AIRequest = {
          message: lastMessage.content,
          context: recentContext,
          sessionId: crypto.randomUUID(),
        };

        const response = await axios.post<AIResponse>(
          `${AI_API_URL}/api/assistant/chat`,
          aiRequest,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(AI_API_KEY && { 'Authorization': `Bearer ${AI_API_KEY}` })
            },
            timeout: 10000, // 10 second timeout
          }
        );

        return response.data.reply || "I received a response but it seems incomplete. Let me provide some helpful guidance instead.";
      } catch (error) {
        console.warn("External AI API call failed, falling back to contextual responses:", error);
        // Fall back to contextual responses
      }
    }

    // Generate contextual response
    return getContextualResponse(lastMessage.content, recentContext);
  } catch (error) {
    console.error("Error in AI service:", error);
    return "I'm having trouble processing your request right now. Please try again in a moment, or ask me about courses, lessons, or general platform help.";
  }
};
