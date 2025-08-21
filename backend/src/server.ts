// src/server.ts

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/errorHandler"; // Import the error middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// The global error handler middleware. It MUST be placed after all other routes
// so that it can catch any errors that are passed to the 'next' function.
app.use(errorMiddleware);

// Connect to the database and then start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to the database:", err);
    // Exit the process if the database connection fails
    process.exit(1);
  });
