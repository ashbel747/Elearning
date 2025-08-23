import { ChatMessage } from "../shared/chatTypes";

// Mock AI responses for testing
const mockResponses = [
  "I understand you're asking about that. Let me help you with some guidance on this topic.",
  "That's a great question! Here's what I can tell you about that subject.",
  "Based on your question, I'd recommend looking into these key points:",
  "I can help you with that! Here are some suggestions to get you started:",
  "That's an interesting topic. Let me provide you with some relevant information:",
];

// Simple keyword-based responses
const getContextualResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  if (message.includes("course") || message.includes("enroll")) {
    return "To enroll in a course, navigate to the course page and click the 'Enroll' button. You can browse all available courses from your dashboard.";
  }

  if (message.includes("certificate")) {
    return "Your certificates are available in your profile section once you complete a course. They're automatically generated and ready for download.";
  }

  if (message.includes("profile") || message.includes("account")) {
    return "You can update your profile by clicking on your avatar in the top-right corner and selecting 'Profile Settings'.";
  }

  if (message.includes("quiz") || message.includes("test")) {
    return "Quizzes are available for each lesson to help you test your understanding. Your progress is automatically saved.";
  }

  if (message.includes("help") || message.includes("support")) {
    return "I'm here to help! You can ask me about courses, certificates, your profile, or general platform navigation.";
  }

  // Random response for other questions
  return (
    mockResponses[Math.floor(Math.random() * mockResponses.length)] +
    " Feel free to ask about courses, certificates, or your profile!"
  );
};

export const callAI = async (messages: ChatMessage[]): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  // Get the last user message
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return "Hello! How can I help you today?";
  }

  // Generate contextual response
  return getContextualResponse(lastMessage.content);
};
