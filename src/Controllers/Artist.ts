import { Response } from "express";
import asyncHandler from "express-async-handler";
import Artist from "../Models/Artist";
import { IAuthRequest } from "../interfaces";

/**
 * @desc    Register new artist
 * @route   POST /api/artists/register
 * @access  Public
 */
export const registerArtist = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { name, bio, genres, email, password } = req.body;

  // Check if artist exists
  const artistExists = await Artist.findOne({ email });
  if (artistExists) {
    res.status(400);
    throw new Error("Artist already exists");
  }

  // Create new artist
  const artist = await Artist.create({ name, bio, genres, email, password });

  if (artist) {
    res.status(201).json({
      name: artist.name,
      email: artist.email,
      token: artist.getJwtToken(),
    });
  } else {
    res.status(400);
    throw new Error("Invalid artist data");
  }
});

/**
 * @desc    Login artist & get token
 * @route   POST /api/artists/login
 * @access  Public
 */
export const loginArtist = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { email, password } = req.body;

  const artist = await Artist.findOne({ email });

  if (artist && (await artist.comparePassword(password))) {
    res.json({
      name: artist.name,
      email: artist.email,
      token: artist.getJwtToken(),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

/**
 * @desc    Get artist profile
 * @route   GET /api/artists/profile
 * @access  Private
 */
export const getArtistProfile = asyncHandler(async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const artist = await Artist.findById(req.user.id);

  if (artist) {
    res.json({
      name: artist.name,
      email: artist.email,
      bio: artist.bio,
      genres: artist.genres,
      availability: artist.availability,
    });
  } else {
    res.status(404);
    throw new Error("Artist not found");
  }
});

/**
 * @desc    Update artist profile
 * @route   PUT /api/artists/profile
 * @access  Private
 */
export const updateArtistProfile = asyncHandler(async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const artist = await Artist.findById(req.user.id);

  if (artist) {
    artist.name = req.body.name || artist.name;
    artist.bio = req.body.bio || artist.bio;
    artist.genres = req.body.genres || artist.genres;
    artist.availability = req.body.availability ?? artist.availability;

    if (req.body.password) {
      artist.password = req.body.password; // Will trigger password hashing in model
    }

    const updatedArtist = await artist.save();

    res.json({
      name: updatedArtist.name,
      email: updatedArtist.email,
      bio: updatedArtist.bio,
      genres: updatedArtist.genres,
      availability: updatedArtist.availability,
    });
  } else {
    res.status(404);
    throw new Error("Artist not found");
  }
});
