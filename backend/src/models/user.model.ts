// src/models/User.ts
import { Schema, model } from "mongoose";
import { UserRole } from "../shared/types";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    default: "student",
    required: true,
  },
  // Add the new password reset fields
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
});

export const User = model("User", userSchema);
