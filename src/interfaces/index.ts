import mongoose, { Document } from "mongoose";
import { Request } from "express"
import { promises } from "dns";



export interface IUserRequest extends Request {
    user?: IUser;
}

export interface IArtistRequest extends Request {
  artist?: IArtist;
}

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<Boolean>
    generateToken():string
  }

export interface IArtist extends mongoose.Document {
    name: string;
    bio?: string;
    genres: string[];
    availability?: boolean;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(enteredPassword: string): Promise<Boolean>;
    getJwtToken(): string;
  }
  
  export interface IEvent extends mongoose.Document {
    title: string;
    date: Date;
    location: string;
    description?: string;
    artist: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IBooking extends mongoose.Document {
    artist: mongoose.Types.ObjectId;
    event: mongoose.Types.ObjectId;
    status: "Pending" | "Confirmed" | "Cancelled";
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ILoginRequest extends mongoose.Document {
    email: string;
    password: string;
  }
  