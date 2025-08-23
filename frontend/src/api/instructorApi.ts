// src/api/instructorApi.ts
import API from "./axios";
import type { InstructorDashboardData, Course, StudentProgress } from "../types/instructor";

// Fetch instructor dashboard data
export const fetchDashboardData = async (): Promise<InstructorDashboardData> => {
  const { data } = await API.get("/instructor/instr-dashboard");
  return data;
};

// Fetch all courses for instructor
export const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await API.get("/instructor/courses");
  // API might return { courses: [] } or [] directly
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any).courses)) return (data as any).courses;
  return [];
};

// Fetch single course by ID
export const fetchCourseById = async (id: string): Promise<Course> => {
  const { data } = await API.get(`/instructor/courses/${id}`);
  return data;
};

// Create a new course
export const createCourse = async (course: Partial<Course>): Promise<Course> => {
  const { data } = await API.post("/instructor/courses", course);
  return data;
};

// Update an existing course
export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<Course> => {
  const { data } = await API.put(`/instructor/courses/${courseId}`, updates);
  return data;
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<{ message: string; courseId: string }> => {
  const { data } = await API.delete(`/instructor/courses/${courseId}`);
  return data;
};

// Fetch students for a specific course
export const fetchStudents = async (courseId: string): Promise<StudentProgress[]> => {
  const { data } = await API.get(`/instructor/students/${courseId}`);
  return data;
};
