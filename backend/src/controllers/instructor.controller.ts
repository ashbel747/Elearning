import { Request, Response } from "express";
import mongoose from "mongoose";
import  Course  from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";

/**
 * GET /api/instructor/dashboard
 * Returns aggregated metrics for the logged-in instructor
 */
export const getInstructorDashboard = async (req: Request, res: Response) => {
  try {
    const instructorId = (req as any).user.id; // match authMiddleware

    // Fetch instructor's courses
    const courses = await Course.find({ instructor: instructorId }).lean();
    const courseIds = courses.map(c => c._id);

    // Aggregate enrollment stats
    const enrollAgg = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: "$course",
          studentsCount: { $sum: 1 },
          avgComplete: { $avg: "$percentComplete" },
          completions: { $sum: { $cond: [{ $eq: ["$percentComplete", 100] }, 1, 0] } },
        },
      },
    ]);

    // Map stats to courses
    const perCourseStats: Record<string, any> = {};
    enrollAgg.forEach(e => {
      perCourseStats[e._id.toString()] = e;
    });

    const coursesWithStats = courses.map(c => {
      const stats = perCourseStats[c._id.toString()] || { studentsCount: 0, avgComplete: 0, completions: 0 };
      return {
        courseId: c._id,
        title: c.title,
        price: c.price,
        published: c.published,
        studentsCount: stats.studentsCount,
        avgComplete: Math.round((stats.avgComplete || 0) * 100) / 100,
        completions: stats.completions,
      };
    });

    const totals = {
      totalCourses: courses.length,
      totalStudents: enrollAgg.reduce((acc, cur) => acc + cur.studentsCount, 0),
      avgCompletion: enrollAgg.length
        ? Math.round((enrollAgg.reduce((acc, cur) => acc + (cur.avgComplete || 0), 0) / enrollAgg.length) * 100) / 100
        : 0,
      totalCompletions: enrollAgg.reduce((acc, cur) => acc + (cur.completions || 0), 0),
    };

    return res.json({ totals, courses: coursesWithStats });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * GET /api/instructor/courses
 * Returns all courses for the logged-in instructor with optional pagination
 */
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const instructorId = (req as any).user.id; // match authMiddleware
    const page = parseInt((req.query.page as string) || "1");
    const limit = Math.min(50, parseInt((req.query.limit as string) || "20"));
    const skip = (page - 1) * limit;

    // Fetch courses
    const [courses, total] = await Promise.all([
      Course.find({ instructor: instructorId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments({ instructor: instructorId }),
    ]);

    // Get enrollment stats per course
    const courseIds = courses.map(c => c._id);
    const enrollCounts = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: "$course",
          studentsCount: { $sum: 1 },
          avgComplete: { $avg: "$percentComplete" },
        },
      },
    ]);

    // Map stats to courses
    const coursesWithStats = courses.map(c => {
      const stat = enrollCounts.find(ec => ec._id.toString() === c._id.toString());
      return {
        ...c,
        studentsCount: stat?.studentsCount || 0,
        avgComplete: stat?.avgComplete || 0,
      };
    });

    return res.json({
      page,
      limit,
      total,
      courses: coursesWithStats,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /api/instructor/students/:courseId
 */
export const getCourseStudents = async (req: Request, res: Response) => {
  try {
    const instructorId = (req as any).user._id;
    const courseId = req.params.courseId;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId }).lean();
    if (!course) return res.status(404).json({ message: "Course not found or you are not the instructor" });

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email")
      .lean();

    const students = enrollments.map(e => ({
      studentId: (e.student as any)._id,
      name: (e.student as any).name,
      email: (e.student as any).email,
      percentComplete: e.percentComplete,
      lastActivity: e.lastActivity,
    }));

    return res.json({ courseId, title: course.title, students });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * POST /api/instructor/courses/:courseId/publish
 * Toggle publish/unpublish for a course
 */
export const publishCourse = async (req: Request, res: Response) => {
  try {
    // Use req.user from your authMiddleware
    const instructorId = (req as any).user?._id || (req as any).user?.id;
    const { courseId } = req.params;
    const { publish } = req.body;

    if (!instructorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find course that belongs to this instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or you are not the instructor" });
    }

    // Toggle published status
    course.published = Boolean(publish);
    await course.save();

    return res.json({
      message: `Course ${course.published ? "published" : "unpublished"}`,
      courseId: course._id,
      published: course.published,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const instructorId = (req as any).user.id; // From authMiddleware
    const course = new Course({
      ...req.body,
      instructor: instructorId, // ✅ Set instructor automatically
    });

    await course.save();
    res.status(201).json(course);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};