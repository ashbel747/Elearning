import API from "../api/axios";
import type {
  Quiz,
  NewQuiz,
  QuizAttempt,
  NewQuizAttempt,
} from "../shared/quiztypes";

export const api = API;

export const setAuthToken = (token: string | null) => {
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete API.defaults.headers.common.Authorization;
};

export const getQuizByLesson = async (lessonId: string): Promise<Quiz> => {
  const res = await API.get<Quiz>(`/quizzes/${lessonId}`);
  return res.data;
};

// ✔ Accept NewQuiz (no IDs) and return Quiz (with IDs)
export const createQuiz = async (payload: NewQuiz): Promise<Quiz> => {
  const res = await API.post<Quiz>("/quizzes", payload);
  return res.data;
};

export const submitQuizAttempt = async (
  attempt: NewQuizAttempt
): Promise<QuizAttempt> => {
  const res = await API.post<QuizAttempt>("/quiz-attempts", attempt);
  return res.data;
};

export const getQuizAttempts = async (
  quizId: string
): Promise<QuizAttempt[]> => {
  const res = await API.get<QuizAttempt[]>(`/quiz-attempts/${quizId}`);
  return res.data;
};
