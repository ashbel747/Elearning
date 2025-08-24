import joi from "joi";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import contentRoutes from "./routes/contentRoutes";
import chatRoutes from "./routes/chat.routes";
// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import quizRoutes from "./routes/Quiz/quiz.routes";
import quizAttemptRoutes from "./routes/Quiz/quizAttempts";
import searchRoutes from "./routes/search.route";
import notificationRoutes from "./routes/notification.route";
import progressRoutes from "./routes/progress.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import instructorRoutes from "./routes/instructor.routes";

import { errorMiddleware } from "./middleware/errorHandler";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("PORT:", process.env.PORT);
console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 3500;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// MOVE LOGGING HERE - BEFORE ALL ROUTES
// Replace your logging middleware with this:
const loggingMiddleware = (req: Request, res: Response, next: any) => {
  console.log("=== REQUEST RECEIVED ===");
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

app.use(loggingMiddleware);

// Routes (logging will catch these now)
app.get("/test", (req, res) => res.json({ message: "Routing is working" }));
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/content", contentRoutes);

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
