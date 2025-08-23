// src/components/Dashboard.tsx
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Welcome {user?.name}</h1>

      {user?.role === "instructor" ? (
        <div>
          <Link
            to="/create-quiz"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Quiz
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-2">Your Quizzes:</p>
          {/* Later: map over available quizzes and link to /quiz/:lessonId */}
        </div>
      )}
    </div>
  );
}
