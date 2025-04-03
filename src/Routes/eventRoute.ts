import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from "../Controllers/Event";
import { isAuthenticated } from "../Middlewares/authentication";
import { isArtist } from "../Middlewares/rolesMiddleware";

const router = express.Router();

// Public Routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected Routes
router.post("/event", isAuthenticated, isArtist, createEvent);
router.put("/:id", isAuthenticated, isArtist, updateEvent);
router.delete("/:id", isAuthenticated, isArtist, deleteEvent);


export default router