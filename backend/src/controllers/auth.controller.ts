/**
 * @file This file contains the complete authentication logic for the application.
 * It includes functions for user signup, login, password reset requests, and
 * the final password update using a reset token.
 */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { User } from "../models/user.model";
import {
  IAuthRequest,
  IAuthResponse,
  IResetPasswordResponse,
} from "../shared/types";
// Import the email utility (you will need to implement this)
// import { sendEmail } from '../utils/emailSender';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = async (
  req: Request<{}, {}, IAuthRequest>,
  res: Response<IAuthResponse>
) => {
  const { name, email, password, role } = req.body;

  // Add validation to ensure all required fields are present
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "Please enter all fields",
      token: "",
      user: { id: "", name: "", email: "", role: "student" }, // Placeholder for type safety
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists.",
        token: "",
        user: { id: "", name: "", email: "", role: "student" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      message: "Server error",
      token: "",
      user: { id: "", name: "", email: "", role: "student" },
    });
  }
};

// @desc    Authenticate a user and get a token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (
  req: Request<{}, {}, IAuthRequest>,
  res: Response<IAuthResponse>
) => {
  const { email, password } = req.body;

  // Add validation to ensure all required fields are present
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter all fields",
      token: "",
      user: { id: "", name: "", email: "", role: "student" },
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        token: "",
        user: { id: "", name: "", email: "", role: "student" },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        token: "",
        user: { id: "", name: "", email: "", role: "student" },
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
      token: "",
      user: { id: "", name: "", email: "", role: "student" },
    });
  }
};

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response<IResetPasswordResponse>
) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Please provide an email address." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({
          message:
            "If a matching account was found, a password reset link has been sent to your email.",
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = new Date(Date.now() + 3600000);

    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    try {
      // You must implement your own sendEmail utility here.
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Password Reset Request',
      //   message,
      // });

      res
        .status(200)
        .json({ message: "Password reset link has been sent to your email." });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      console.error("Email sending error:", emailError);
      return res
        .status(500)
        .json({ message: "Server error: Email could not be sent." });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reset password with a token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const completePasswordReset = async (
  req: Request,
  res: Response<IResetPasswordResponse>
) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
