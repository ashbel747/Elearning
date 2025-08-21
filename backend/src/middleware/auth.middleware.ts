import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IJwtPayload, IRequestWithUser } from "../shared/types";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * @desc Protects routes by verifying the JWT from the request header.
 * @param {IRequestWithUser} req - The Express Request object with the custom user property.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction.
 */
export const authMiddleware = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Get the token from the header
      token = authHeader.split(" ")[1];

      // Verify the token and decode the payload
      const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload;

      // Attach the user's ID and role to the request object for use in controllers
      req.user = { id: decoded.id, role: decoded.role };

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(401).json({ message: "Not authorized, token failed." });
    }
  } else if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided." });
  }
};
