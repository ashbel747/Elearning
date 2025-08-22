import { z } from "zod";
import { UserRole } from "../shared/Authtypes";

// A common, simple regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signupSchema = z.object({
  email: z.string().regex(emailRegex, { message: "Invalid email format" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  role: z
    .enum(Object.values(UserRole) as [string, ...string[]])
    .default(UserRole.Student),
});

export const loginSchema = z.object({
  email: z.string().regex(emailRegex, { message: "Invalid email format" }),
  password: z.string(),
});
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 8 characters long."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 8 characters long."),
  })
  .superRefine(({ oldPassword, newPassword }, refinementContext) => {
    if (oldPassword === newPassword) {
      refinementContext.addIssue({
        code: "custom",
        message: "New password cannot be the same as the old password.",
        path: ["newPassword"],
      });
    }
  });
