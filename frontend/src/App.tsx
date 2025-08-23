import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import Home from "./pages/HomePage";
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
import {VirtualAssistant} from './components/VirtualAssistant/VirtualAssistant'
import CourseView from "./components/modules/CourseCard";

const dummyCourseData = {
  title: "Foundations of UI/UX",
  modules: [
    {
      id: "mod1",
      name: "Module 1",
      lessons: [
        {
          id: "1",
          title: "Lesson 1.1 - What is UIX Design, Really?",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          notes: "*Design is empathy made visible\n*Accessibility is not optional but foundational\n*Every interface tells an emotional story\n*Inclusive design invites everyone to belong.",
          duration: 273, // 04:33 in seconds
        },
        {
          id: "2",
          title: "Lesson 1.2 - Emotional Intelligence in Design",
          videoUrl: "https://www.w3schools.com/html/movie.mp4",
          notes: "Notes for Emotional Intelligence lesson.",
          duration: 120,
        },
        {
          id: "3",
          title: "Lesson 1.3 - Accessibility as a Design Imperative",
          videoUrl: "https://www.w3schools.com/html/movie.mp4",
          notes: "Notes for Accessibility lesson.",
          duration: 150,
        },
        {
          id: "4",
          title: "Lesson 1.4 - Designing for Emotional Accessibility",
          videoUrl: "https://www.w3schools.com/html/movie.mp4",
          notes: "Notes for Emotional Accessibility lesson.",
          duration: 180,
        }
      ],
    },
    // Add more modules as needed
  ],
};


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
          path="/course/foundations-of-ui-ux"
          element={
            <Layout>
              <CourseView course={dummyCourseData} />
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

           <Route
            path="/assistant"
            element={
              <VirtualAssistant context={{ page: "GeneralHelp" }} />
               
            }
          />







        </Routes>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
