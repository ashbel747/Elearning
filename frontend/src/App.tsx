// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import {Login} from "./pages/LoginPage";
import {Signup} from "./pages/SignupPage";
import {ChangePassword} from "./pages/ResetPasswordPage";
import QuizPage from "./components/QuizPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
         
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ChangePassword />} />
           <Route path="/quiz/:lessonId" element={<QuizPage />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
