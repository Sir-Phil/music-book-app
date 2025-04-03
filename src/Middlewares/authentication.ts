import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import Artist from "../Models/Artist";
import User from "../Models/User";
import { IAuthRequest, IUser, IArtist } from "../interfaces";
import mongoose from "mongoose";

// General Authentication Middleware for Users, Artists, and Admins
export const isAuthenticated = asyncHandler(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      try {
        // Extract token from header
        token = req.headers.authorization.split(" ")[1];

        // Decode the token and extract user details
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
          id: string;
          role: "user" | "artist" | "admin";
        };

        let userOrArtist: IUser | IArtist | null = null;

        // Fetch user or artist based on role
        if (decoded.role === "user" || decoded.role === "admin") {
          userOrArtist = (await User.findById(decoded.id).select("-password")) as IUser | null;
        } else if (decoded.role === "artist") {
          userOrArtist = (await Artist.findById(decoded.id).select("-password")) as IArtist | null;
        }

        if (!userOrArtist) {
          res.status(401);
          throw new Error("User not found");
        }

        //  Ensure `_id` is correctly recognized as a string
        req.user = {
          id: (userOrArtist._id as mongoose.Types.ObjectId).toString(),
          role: decoded.role,
        };

        next(); // Continue to the next middleware
      } catch (error) {
        console.error("Authentication error:", error);
        res.status(401);
        throw new Error("Invalid token");
      }
    } else {
      res.status(401);
      throw new Error("No token provided");
    }
  }
);
