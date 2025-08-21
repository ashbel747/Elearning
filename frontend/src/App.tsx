import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import Dashboard from "./pages/DashboardPage";
import Home from "./pages/HomePage";

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
