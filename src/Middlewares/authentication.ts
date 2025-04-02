import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import Artist from "../Models/Artist";
import User from "../Models/User";
import { IArtistRequest, IUserRequest } from "../interfaces";

// General Authentication Middleware for both Users & Artists
export const isAuthenticated = asyncHandler(
  async (req: IUserRequest & IArtistRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        // Extract token from header
        token = req.headers.authorization.split(" ")[1];

        // Decode the token and get the user or artist id
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

        // Determine if it's a user or artist by checking the decoded data
        if (decoded.role === "user" || decoded.role === "admin") {
          req.user = await User.findById(decoded.id).select("-password"); // Get user without password
          console.log("Authenticated user data:", req.user);
        } else if (decoded.role === "artist") {
          req.artist = await Artist.findById(decoded.id).select("-password"); // Get artist without password
          console.log("Authenticated artist data:", req.artist);
        } else {
          res.status(401);
          throw new Error("Invalid role in token");
        }

        next(); // Continue if authenticated

      } catch (error: any) {
        console.log(error.message);
        res.status(401);
        throw new Error("Invalid token");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("No token provided");
    }
  }
);
