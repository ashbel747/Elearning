/**
 * @file This file contains the type definitions and interfaces used for
 * authentication-related requests, responses, and user data.
 */

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type UserRole = "student" | "instructor";

// Interface for the request body of the sign-up and login routes.
export interface IAuthRequest {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
}

// Interface for the response data after a successful sign-up or login.
export interface IAuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

// Interface for the response data of a successful password reset.
export interface IResetPasswordResponse {
  message: string;
}

// Interface for the JWT payload, which contains the user's ID and role.
export interface IJwtPayload extends JwtPayload {
  id: string;
  role: UserRole;
}

// This custom interface extends Express's Request object,
// adding a 'user' property that will be populated by the auth middleware.
export interface IRequestWithUser extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
