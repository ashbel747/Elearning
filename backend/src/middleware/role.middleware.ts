/**
 * @file This file contains the role-based access control middleware.
 * It checks if an authenticated user has the necessary permissions to
 * access a specific route.
 */

import { Response, NextFunction } from "express";
import { UserRole, IRequestWithUser } from "../shared/types";

/**
 * @desc Role-based access control middleware.
 * @param {UserRole[]} allowedRoles - An array of roles that are permitted to access the route.
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: IRequestWithUser, res: Response, next: NextFunction) => {
    // Check if the user is authenticated and has a role
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Access denied. No user role found." });
    }

    // Check if the user's role is in the list of allowed roles.
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};
