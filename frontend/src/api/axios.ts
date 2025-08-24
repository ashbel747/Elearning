import axios from "axios";

// 🔹 Environment-based API configuration
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? "http://localhost:3500/api" 
  : "https://elearning-backend-4hxa.onrender.com/api";

const API = axios.create({
  baseURL,
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
