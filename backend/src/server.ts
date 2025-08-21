import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import searchRoutes from "./routes/search.route";
import notificationRoutes from "./routes/notification.route";
import progressRoutes from "./routes/progress.routes";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI as string;
connectDB(mongoURI);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running...🚀🚀" });
});
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/progress", progressRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
