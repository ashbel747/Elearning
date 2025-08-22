import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizByLesson, submitQuizAttempt } from "../services/quizApi";
import { type Quiz } from "../shared/quiztypes";
import QuestionCard from "./QuestionCard";

const QuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (lessonId) getQuizByLesson(lessonId).then(setQuiz);
  }, [lessonId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const attempt = await submitQuizAttempt({
      quizId: quiz._id,
      userId: localStorage.getItem("userId") || "",
      answers: Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, answer: ans })),
    });
    setScore(attempt.score);
    setSubmitted(true);
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      {!submitted ? (
        <>
          {quiz.questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              onAnswer={(ans) => handleAnswer(q._id, ans)}
            />
          ))}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Submit
          </button>
        </>
      ) : (
        <p className="text-green-600 font-bold text-xl">You scored {score} / {quiz.questions.length}</p>
      )}
    </div>
  );
};

export default QuizPage;
