import express from "express";
import {
  registerArtist,
  loginArtist,
  getArtistProfile,
  updateArtistProfile,
} from "../Controllers/Artist";
import { isAuthenticated } from "../Middlewares/authentication";

const router = express.Router();

// Public Routes
router.post("/register", registerArtist);
router.post("/login", loginArtist);

// Private Routes (Require authentication)
router.get("/profile", isAuthenticated, getArtistProfile);
router.put("/profile", isAuthenticated, updateArtistProfile);

export default router;
