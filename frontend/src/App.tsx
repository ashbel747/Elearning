import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import Home from "./pages/HomePage";
import LessonPlayer from "./components/modules/LessonPlayer";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ChangePassword />} />

            {/* Protected Student Quiz */}
            <Route
              path="/quiz/:lessonId"
              element={
                <ProtectedRoute role="student">
                  <Layout>
                    <QuizPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Instructor Quiz Management */}
            <Route
              path="/quiz"
              element={
                <ProtectedRoute role="instructor">
                  <Layout>
                    <CreateQuizPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-quiz/:lessonId"
              element={
                <ProtectedRoute role="instructor">
                  <Layout>
                    <ViewQuizPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Lesson route */}
            <Route
              path="/lesson"
              element={
                <Layout>
                  <LessonPlayer
                    lesson={{
                      id: "1",
                      title: "Introduction to React",
                      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                      notes: "This is a sample lesson with **markdown** notes.",
                      duration: 100,
                    }}
                    progress={{
                      lessonId: "1",
                      completed: false,
                      progress: 0,
                      lastWatched: 0,
                    }}
                    onProgressUpdate={(progress) =>
                      console.log("Progress updated:", progress)
                    }
                    onNextLesson={() => console.log("Go to next lesson")}
                    onPrevLesson={() => console.log("Go to previous lesson")}
                  />
                </Layout>
              }
            />

            {/* Public homepage */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
