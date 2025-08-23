// src/pages/Quiz/QuizPage.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useQuiz } from "../../hooks/useQuiz";

const QuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { token, user } = useAuth();
  const { state, fetchQuiz, setAnswer, submitQuiz, resetQuizTaking } = useQuiz();

  useEffect(() => {
    if (lessonId && token) {
      fetchQuiz(lessonId, token);
    }
  }, [lessonId, token, fetchQuiz]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswer(questionId, value);
  };

  const handleSubmit = () => {
    if (token && user?._id && state.currentQuiz) {
      submitQuiz(user._id, token);
    }
  };

  if (state.loading) return <p>Loading quiz...</p>;
  if (state.error) return <p className="text-red-600">{state.error}</p>;
  if (!state.currentQuiz) return <p>No quiz found for this lesson.</p>;

  // After submission: calculate score and show feedback
  if (state.submitted) {
    const totalQuestions = state.currentQuiz.questions.length;
    const correctAnswers = state.currentQuiz.questions.filter(
      (q) => state.answers[q._id] === q.correctAnswer
    ).length;

    const feedbackMessage =
      correctAnswers / totalQuestions === 1
        ? "Excellent! You got all correct 🎉"
        : correctAnswers / totalQuestions >= 0.7
        ? "Good job! Most answers are correct 👍"
        : "Keep trying! Review and try again 💡";

    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Quiz Submitted!</h2>
        <p className="text-xl mb-2">
          Your score: {correctAnswers} / {totalQuestions}
        </p>
        <p className="mb-6">{feedbackMessage}</p>

        <div className="space-y-4 text-left">
          {state.currentQuiz.questions.map((q, idx) => {
            const userAnswer = state.answers[q._id] ?? "No answer";
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q._id}
                className={`p-3 border rounded ${
                  isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                }`}
              >
                <p className="font-medium">{`Q${idx + 1}: ${q.text}`}</p>
                <p>
                  Your answer:{" "}
                  <span className={isCorrect ? "text-green-700" : "text-red-700 font-medium"}>
                    {userAnswer}
                  </span>
                </p>
                {!isCorrect && (
                  <p>
                    Correct answer: <span className="text-green-700">{q.correctAnswer}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={resetQuizTaking}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Quiz-taking UI
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{state.currentQuiz.title}</h1>
      {state.currentQuiz.questions.map((q, idx) => (
        <div key={q._id} className="mb-4 border p-3 rounded">
          <p className="font-medium">{`Q${idx + 1}: ${q.text}`}</p>
          {q.type === "multiple-choice" && q.options && (
            <div className="ml-4">
              {q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={q._id ?? `q-${idx}`}
                    value={opt}
                    checked={state.answers[q._id!] === opt}
                    onChange={() => handleAnswerChange(q._id!, opt)}
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
          )}
          {q.type === "true-false" && (
            <div className="ml-4">
              {["true", "false"].map((opt) => (
                <label key={opt} className="block">
                  <input
                    type="radio"
                    name={q._id ?? `q-${idx}`}
                    value={opt}
                    checked={state.answers[q._id!] === opt}
                    onChange={() => handleAnswerChange(q._id!, opt)}
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
          )}
          {q.type === "short-answer" && (
            <input
              type="text"
              className="border p-1 w-full mt-2"
              value={state.answers[q._id!] ?? ""}
              onChange={(e) => handleAnswerChange(q._id!, e.target.value)}
            />
          )}
        </div>
      ))}
      <button
        className="bg-green-500 text-white px-3 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizPage;
