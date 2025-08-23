import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3500/api", // 🔹 Change to your backend URL
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
