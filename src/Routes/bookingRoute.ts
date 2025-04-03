import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../Controllers/Booking";
import { isAuthenticated } from "../Middlewares/authentication";
import { isArtistOrAdmin } from "../Middlewares/rolesMiddleware";

const router = express.Router();

// Private Routes (Require authentication)
router.post("/", isAuthenticated, createBooking);
router.get("/", isAuthenticated, isArtistOrAdmin, getBookings);
router.get("/:id", isAuthenticated, getBookingById);
router.put("/:id", isAuthenticated, isArtistOrAdmin, updateBookingStatus);
router.delete("/:id", isAuthenticated, deleteBooking);

export default router;
