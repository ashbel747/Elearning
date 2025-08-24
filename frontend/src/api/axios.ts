import axios from "axios";

const API = axios.create({
  baseURL: "https://elearning-backend-4hxa.onrender.com/api", // 🔹 Change to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Optional: Attach token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
