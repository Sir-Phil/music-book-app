import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../Controllers/User";
import { isAuthenticated } from "../Middlewares/authentication";
import { isAdmin } from "../Middlewares/rolesMiddleware";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private Routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);
router.delete("/:id", isAuthenticated, isAdmin, deleteUserAccount);

export default router;
