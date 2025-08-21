import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// GET /api/auth/profile
router.get("/profile", authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json(user);
});

export default router;
