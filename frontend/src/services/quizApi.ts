import axios from "axios";
import { type Quiz, type QuizAttempt } from "../shared/quiztypes";

const API_BASE = "http://localhost:3500/api";

export const getQuizByLesson = async (lessonId: string): Promise<Quiz> => {
  const res = await axios.get(`${API_BASE}/quizzes/${lessonId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const submitQuizAttempt = async (
  attempt: Omit<QuizAttempt, "_id" | "score">
) => {
  const res = await axios.post(`${API_BASE}/quiz-attempts`, attempt, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const getQuizAttempts = async (
  quizId: string
): Promise<QuizAttempt[]> => {
  const res = await axios.get(`${API_BASE}/quiz-attempts/${quizId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};
