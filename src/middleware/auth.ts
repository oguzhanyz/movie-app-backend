import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}
