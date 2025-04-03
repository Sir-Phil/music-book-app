import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Events from "../Models/Events";
import { IAuthRequest } from "../interfaces";

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Artist only)
 */
export const createEvent = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { title, date, location, description } = req.body;

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const event = await Events.create({
    title,
    date,
    location,
    description,
    artist: req.user.id, // Assuming artist is authenticated
  });

  if (event) {
    res.status(201).json(event);
  } else {
    res.status(400);
    throw new Error("Invalid event data");
  }
});

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await Events.find().populate("artist", "name bio");
  res.json(events);
});

/**
 * @desc    Get event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await Events.findById(req.params.id).populate("artist", "name bio");

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private (Only event creator)
 */
export const updateEvent = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const event = await Events.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  // Ensure only the event creator can update
  if (event.artist.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this event");
  }

  event.title = req.body.title || event.title;
  event.date = req.body.date || event.date;
  event.location = req.body.location || event.location;
  event.description = req.body.description || event.description;

  const updatedEvent = await event.save();
  res.json(updatedEvent);
});

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private (Only event creator)
 */
export const deleteEvent = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const event = await Events.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (event.artist.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this event");
  }

  await event.deleteOne();
  res.json({ message: "Event deleted successfully" });
});
