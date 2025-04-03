import mongoose, { Document } from "mongoose";
import { Request } from "express";

// Unified interface for authentication requests (User & Artist)
export interface IAuthRequest extends Request {
  user?: {
    id: string;
    role: "user" | "artist" | "admin";
  };
}

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  generateToken(): string;
}

// Artist Interface (Extends IUser for common properties)
export interface IArtist extends Document {
  name: string;
  bio?: string;
  genres: string[];
  availability?: boolean;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getJwtToken(): string;
}

// Event Interface
export interface IEvent extends Document {
  title: string;
  date: Date;
  location: string;
  description?: string;
  artist: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Booking Interface
export interface IBooking extends Document {
  artist: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IUser;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

// Login Request Interface (No need for mongoose.Document)
export interface ILoginRequest {
  email: string;
  password: string;
}
