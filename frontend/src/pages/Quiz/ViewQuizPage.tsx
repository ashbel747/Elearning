// src/pages/ViewQuizPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "../../components/QuestionCard";
import { useAuth } from "../../hooks/useAuth";
import { getQuizByLesson, setAuthToken } from "../../services/quizApi";
import { type Quiz } from "../../shared/quiztypes";

const ViewQuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set auth token if available
  useEffect(() => {
    if (user?.token) setAuthToken(user.token);
  }, [user]);

  // Fetch quiz
  useEffect(() => {
    if (!lessonId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await getQuizByLesson(lessonId);
        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [lessonId]);

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!quiz) return <p>No quiz found for this lesson.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      {quiz.questions.map((q) => (
        <QuestionCard
          key={q._id}
          question={q}
          onAnswer={() => {}}
        />
      ))}
    </div>
  );
};

export default ViewQuizPage;
