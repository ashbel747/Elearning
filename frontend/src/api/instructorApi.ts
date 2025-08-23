// src/api/instructorApi.ts
import API from "./axios";
import type {
  InstructorDashboardData,
  Course,
  StudentProgress,
} from "../types/instructor";

export const fetchDashboardData = async (): Promise<InstructorDashboardData> => {
  const { data } = await API.get("/instructor/instr-dashboard");
  return data;
};

export const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await API.get("/instructor/courses");
  return data;
};

export const createCourse = async (course: Partial<Course>): Promise<Course> => {
  const { data } = await API.post("/instructor/courses", course);
  return data;
};

export const updateCourse = async (
  courseId: string,
  updates: Partial<Course>
): Promise<Course> => {
  const { data } = await API.put(`/instructor/courses/${courseId}`, updates);
  return data;
};

export const fetchCourseById = async (id: string) => {
  const res = await API.get(`/instructor/courses/${id}`);
  return res.data;
};

export const fetchStudents = async (
  courseId: string
): Promise<StudentProgress[]> => {
  const { data } = await API.get(`/instructor/students/${courseId}`);
  return data;
};
