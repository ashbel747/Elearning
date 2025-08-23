// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { QuizProvider } from "./context/QuizContext";
import { Login } from "./pages/LoginPage";
import { Signup } from "./pages/SignupPage";
import { ChangePassword } from "./pages/ResetPasswordPage";
import QuizPage from "./pages/Quiz/QuizPage";
import CreateQuizPage from "./pages/Quiz/CreateQuizPage";
import ViewQuizPage from "./pages/Quiz/ViewQuizPage";

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ChangePassword />} />

            {/* Student Quiz */}
            <Route path="/quiz/:lessonId" element={<QuizPage />} />

            {/* Instructor Quiz Management */}
            <Route path="/quiz" element={<CreateQuizPage />} />
            <Route path="/view-quiz/:lessonId" element={<ViewQuizPage />} />
          </Routes>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
