import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../Models/User";
import { IUserRequest } from "../interfaces";


/** @desc Register a new User */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    if (user) {
        res.status(201).json({
            // _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: user.generateToken()
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

/** @desc Authenticate User (Login) */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check password
    if (user && (await user.comparePassword(password))) {
        res.json({
            // _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: user.generateToken(),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

/** @desc Get User Profile */
export const getUserProfile = asyncHandler(async (req: IUserRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (user) {
        res.json({
            // _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

/** @desc Update User Profile */
export const updateUserProfile = asyncHandler(async (req: IUserRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save();

        res.json({
            // _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: updatedUser.generateToken()
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

/** @desc Delete User */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

/** @desc Get All Users (Admin Only) */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({});
    res.json(users);
});
