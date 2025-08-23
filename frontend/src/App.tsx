import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import Home from "./pages/HomePage";
import LessonPlayer from "./components/modules/LessonPlayer";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { QuizProvider } from "./context/QuizContext";
import { Login } from "./pages/LoginPage";
import { Signup } from "./pages/SignupPage";
import { ChangePassword } from "./pages/ResetPasswordPage";
import QuizPage from "./pages/Quiz/QuizPage";
import CreateQuizPage from "./pages/Quiz/CreateQuizPage";
import ViewQuizPage from "./pages/Quiz/ViewQuizPage";
import Profile from "./pages/Profile";
import Dashboard from "./pages/instructor/Dashboard";
import Courses from "./pages/instructor/Courses";
import CourseForm from "./pages/instructor/CourseForm";


function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Routes>
          <Route
            path="/instructor/dashboard"
            element={
              <AuthProvider>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthProvider>
            }
          />
          <Route 
            path="/instructor/courses" 
            element={
              <AuthProvider>
                <Layout>
                  <Courses />
                </Layout>
              </AuthProvider>
            } 
          />
          <Route 
            path="/instructor/courses/new" 
            element={
              <AuthProvider>
                <Layout>
                  <CourseForm />
                </Layout>
              </AuthProvider>
            } 
          />

          <Route 
            path="/instructor/courses/:id" 
            element={
              <AuthProvider>
                <Layout>
                  <CourseForm />
                </Layout>
              </AuthProvider>
            } 
          />
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ChangePassword />} />

          <Route
            path="/quiz/:lessonId"
            element={
              <QuizPage />
                 }
          />

          {/* Instructor Quiz Management */}
          <Route
            path="/quiz"
            element={
        <CreateQuizPage />
                            
            }
          />
          <Route
            path="/view-quiz/:lessonId"
            element={
           <ViewQuizPage />
               
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
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
