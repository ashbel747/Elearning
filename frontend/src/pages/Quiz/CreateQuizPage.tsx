// src/pages/CreateQuizPage.tsx
import React, { useState } from "react";
import { createQuiz } from "../../services/quizApi";
import { type QuestionType, type NewQuiz, type NewQuestion } from "../../shared/quiztypes";

export const CreateQuizPage: React.FC = () => {
  const [quiz, setQuiz] = useState<NewQuiz>({
    title: "",
    lessonId: "",
    questions: [],
  });

  const addQuestion = () => {
    const newQuestion: NewQuestion = {
      text: "",
      type: "multiple-choice",
      options: [""],
      correctAnswer: "",
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const updateQuestion = <K extends keyof NewQuestion>(
    index: number,
    field: K,
    value: NewQuestion[K]
  ) => {
    const updated = [...quiz.questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuiz({ ...quiz, questions: updated });
  };

  const handleSave = async () => {
    try {
      await createQuiz(quiz);
      alert("Quiz created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Quiz</h1>

        <div className="space-y-6">
          {/* Quiz Details Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
            
            <input
              className="w-full bg-yellow-100 text-gray-800 border-none rounded-lg p-3 mb-4 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Lesson ID"
              value={quiz.lessonId}
              onChange={(e) => setQuiz({ ...quiz, lessonId: e.target.value })}
            />

            <input
              className="w-full bg-yellow-100 text-gray-800 border-none rounded-lg p-3 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Quiz Title"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
          </div>

          {/* Questions Section */}
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Question {idx + 1}</h3>
              
              <input
                className="w-full bg-yellow-100 text-gray-800 border-none rounded-lg p-3 mb-4 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Write your Question Here"
                value={q.text}
                onChange={(e) => updateQuestion(idx, "text", e.target.value)}
              />

              <select
                className="w-full bg-yellow-100 text-gray-800 border-none rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={q.type}
                onChange={(e) =>
                  updateQuestion(idx, "type", e.target.value as QuestionType)
                }
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
              </select>

              {q.type === "multiple-choice" && (
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-3">Enter Choices</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {q.options?.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        className="bg-yellow-100 text-gray-800 border-none rounded-lg p-3 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`Choice ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...quiz.questions];
                          updated[idx].options![optIdx] = e.target.value;
                          setQuiz({ ...quiz, questions: updated });
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                      const updated = [...quiz.questions];
                      updated[idx].options!.push("");
                      setQuiz({ ...quiz, questions: updated });
                    }}
                  >
                    + Add Choice
                  </button>
                </div>
              )}

              <input
                className="w-full bg-yellow-100 text-gray-800 border-none rounded-lg p-3 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(idx, "correctAnswer", e.target.value)}
              />
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={addQuestion}
            >
              Add Question
            </button>

            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={handleSave}
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;