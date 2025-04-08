import { Response } from "express";
import asyncHandler from "express-async-handler";
import { IAuthRequest } from "../interfaces";
import User from "../Models/User";

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      name: user.name,
      email: user.email,
      token: user.generateToken(),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({
      name: user.name,
      email: user.email,
      token: user.generateToken(),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (user) {
    res.json({
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
export const deleteUserAccount = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to delete user account");
    }
  
    const user = await User.findById(req.params.id);
  
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    await user.deleteOne();
    res.json({ message: "User account deleted successfully" });
  });
  
