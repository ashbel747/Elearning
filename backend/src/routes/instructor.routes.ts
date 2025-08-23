// src/routes/instructor.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import {
  getInstructorDashboard,
  getInstructorCourses,
  getCourseStudents,
  publishCourse,
  createCourse,
} from "../controllers/instructor.controller";
import { UserRole } from "../shared/Authtypes"; 

const router = Router();

// Require auth + instructor role for all these routes
router.get(
  "/instr-dashboard",
  authMiddleware,
  roleMiddleware([UserRole.Instructor]),
  getInstructorDashboard
);

router.get(
  "/courses",
  authMiddleware,
  roleMiddleware([UserRole.Instructor]), 
  getInstructorCourses
);

router.get(
  "/students/:courseId",
  authMiddleware,
  roleMiddleware([UserRole.Instructor]), 
  getCourseStudents
);

router.post(
  "/courses/:courseId/publish",
  authMiddleware,
  roleMiddleware([UserRole.Instructor]),
  publishCourse
);

router.post(
  "/courses",
  authMiddleware,
  roleMiddleware([UserRole.Instructor]), 
  createCourse
);

export default router;
