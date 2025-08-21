import { Router } from "express";
import {
  signupUser,
  loginUser,
  forgotPassword,
  completePasswordReset,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", completePasswordReset);

export default router;
