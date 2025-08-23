import joi from "joi";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import quizRoutes from "./routes/Quiz/quiz.routes";
import quizAttemptRoutes from "./routes/Quiz/quizAttempts";
import searchRoutes from "./routes/search.route";
import notificationRoutes from "./routes/notification.route";
import progressRoutes from "./routes/progress.routes";
import testimonialRoutes from "./routes/testimonial.routes";

import { errorMiddleware } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => res.json({ message: "Routing is working" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Test & root routes
app.get("/", (req, res) => res.json({ message: "API is running...🚀🚀" }));

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err);
    process.exit(1);
  });
