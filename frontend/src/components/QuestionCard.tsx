import React, { useState } from "react";
import { type Question } from "../shared/quiztypes";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  if (!question) {
    return (
      <div className="border border-red-300 bg-red-50 p-4 rounded mb-4">
        <p className="text-red-600">Invalid question data</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 p-6 rounded-lg bg-white shadow-sm mb-6">
      <p className="text-lg font-medium mb-4">{question.text}</p>
      
      {question.type === "multiple-choice" && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label 
              key={`${question._id}-${option}-${index}`} 
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-transparent hover:border-gray-200 transition-all"
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 flex-1">{option}</span>
            </label>
          ))}
        </div>
      )}
      
      {question.type === "true-false" && (
        <div className="space-y-3">
          {["true", "false"].map((option) => (
            <label 
              key={`${question._id}-${option}`} 
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-transparent hover:border-gray-200 transition-all"
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 flex-1 capitalize">{option}</span>
            </label>
          ))}
        </div>
      )}
      
      {question.type === "short-answer" && (
        <div>
          <textarea
            value={selectedAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
            rows={4}
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>Characters: {selectedAnswer.length}</span>
            <span className={selectedAnswer.trim() ? "text-green-600" : "text-gray-400"}>
              {selectedAnswer.trim() ? "✓ Answered" : "○ Not answered"}
            </span>
          </div>
        </div>
      )}

      {/* Answer status indicator */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Question Type: {question.type.replace('-', ' ')}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            selectedAnswer.trim() 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-500'
          }`}>
            {selectedAnswer.trim() ? 'Answered' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;