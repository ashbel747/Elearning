// src/api/instructorApi.ts
import API from "./axios";
import type { InstructorDashboardData, Course, StudentProgress } from "../types/instructor";
import type { AxiosResponse } from "axios";

// Define response types for better type safety
interface CoursesResponse {
  courses?: Course[];
}

// Fetch instructor dashboard data
export const fetchDashboardData = async (): Promise<InstructorDashboardData> => {
  const response: AxiosResponse<InstructorDashboardData> = await API.get("/instructor/instr-dashboard");
  return response.data;
};

// Fetch all courses for instructor
export const fetchCourses = async (): Promise<Course[]> => {
  const response: AxiosResponse<CoursesResponse | Course[]> = await API.get("/instructor/courses");
  const data = response.data;
  // API might return { courses: [] } or [] directly
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'courses' in data && Array.isArray(data.courses)) {
    return data.courses;
  }
  return [];
};

// Fetch single course by ID
export const fetchCourseById = async (id: string): Promise<Course> => {
  const response: AxiosResponse<Course> = await API.get(`/instructor/courses/${id}`);
  return response.data;
};

// Create a new course
export const createCourse = async (course: Partial<Course>): Promise<Course> => {
  const response: AxiosResponse<Course> = await API.post("/instructor/courses", course);
  return response.data;
};

// Update an existing course
export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<Course> => {
  const response: AxiosResponse<Course> = await API.put(`/instructor/courses/${courseId}`, updates);
  return response.data;
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<{ message: string; courseId: string }> => {
  const response: AxiosResponse<{ message: string; courseId: string }> = await API.delete(`/instructor/courses/${courseId}`);
  return response.data;
};

// Fetch students for a specific course
export const fetchStudents = async (courseId: string): Promise<StudentProgress[]> => {
  const response: AxiosResponse<StudentProgress[]> = await API.get(`/instructor/students/${courseId}`);
  return response.data;
};
