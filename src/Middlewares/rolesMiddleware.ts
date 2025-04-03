import { NextFunction, Response } from "express";
import { IAuthRequest } from "../interfaces";
import asyncHandler from "express-async-handler";

// Ensure user is an Artist
export const isArtist = asyncHandler(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "artist") {
      next();
    } else {
      res.status(403);
      throw new Error("Access denied. Only artists can perform this action.");
    }
  }
);

// Ensure user is an Admin
export const isAdmin = asyncHandler(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403);
      throw new Error("Access denied. Admins only.");
    }
  }
);

// Middleware to check if the user is an Artist or Admin
export const isArtistOrAdmin = asyncHandler(async (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "artist" && req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an artist or admin");
  }
  next();
});
