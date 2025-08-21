import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import Dashboard from "./pages/DashboardPage";
import Home from "./pages/HomePage";
import LessonPlayer from "./components/modules/LessonPlayer";

function App() {
  return (
    <Routes>
      {/* Routes with Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

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
                duration: 100
              }}
              progress={{
                lessonId: "1",
                completed: false,
                progress: 0,
                lastWatched: 0
              }}
              onProgressUpdate={(progress) => console.log("Progress updated:", progress)}
              onNextLesson={() => console.log("Go to next lesson")}
              onPrevLesson={() => console.log("Go to previous lesson")}
            />
          </Layout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
