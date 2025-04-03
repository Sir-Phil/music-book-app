import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Booking from "../Models/Booking";
import { IAuthRequest } from "../interfaces";
import Events from "../Models/Events";

/**
 * @desc    Create a booking
 * @route   POST /api/bookings
 * @access  Private (User only)
 */
export const createBooking = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { eventId, userDetails } = req.body;

  const event = await Events.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const booking = await Booking.create({
    event: eventId,
    user: req.user.id, // User is authenticated
    userDetails,
    status: "Pending",
  });

  res.status(201).json(booking);
});

/**
 * @desc    Get all bookings (Admin or Artist can view)
 * @route   GET /api/bookings
 * @access  Private (Admin/Artist only)
 */
export const getBookings = asyncHandler(async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  let filter = {};

  if (req.user.role === "artist") {
    // Fetch only bookings associated with the artist's events
    const artistEvents = await Events.find({ artist: req.user.id });
    const eventIds = artistEvents.map(event => event._id);
    filter = { event: { $in: eventIds } };
  }

  const bookings = await Booking.find(filter).populate("event").populate("user", "name email");
  res.json(bookings);
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private (User/Artist/Admin)
 */
export const getBookingById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate("event")
    .populate("user", "name email");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  // Allow access for the user who made the booking or an admin
  if (req.user.id !== booking.user.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.json(booking);
});

/**
 * @desc    Update booking status (Only Admin or Event Owner)
 * @route   PUT /api/bookings/:id
 * @access  Private (Admin/Artist)
 */
export const updateBookingStatus = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { status } = req.body;

  if (!status || !["Pending", "Confirmed", "Cancelled"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status. Valid values: 'Pending', 'Confirmed', 'Cancelled'.");
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const event = await Events.findById(booking.event);
  if (!event) {
    res.status(404);
    throw new Error("Associated event not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  // Only the event creator or admin can update
  if (event.artist.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this booking");
  }

  booking.status = status;
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

/**
 * @desc    Delete booking (Only Admin or Booking Owner)
 * @route   DELETE /api/bookings/:id
 * @access  Private (Admin/User)
 */
export const deleteBooking = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (req.user.id !== booking.user.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this booking");
  }

  await booking.deleteOne();
  res.json({ message: "Booking deleted successfully" });
});
