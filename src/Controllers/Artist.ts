import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Artist from "../Models/Artist";
import { IArtistRequest } from "../interfaces";

// @desc    Register new artist
// @route   POST /api/artists/register
// @access  Public
export const registerArtist = asyncHandler(async (req: Request, res: Response) => {
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
    //   _id: artist._id,
      name: artist.name,
      email: artist.email,
      token: artist.getJwtToken(),
    });
  } else {
    res.status(400);
    throw new Error("Invalid artist data");
  }
});

// @desc    Login artist & get token
// @route   POST /api/artists/login
// @access  Public
export const loginArtist = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const artist = await Artist.findOne({ email });

  if (artist && (await artist.comparePassword(password))) {
    res.json({
    //   _id: artist._id,
      name: artist.name,
      email: artist.email,
      token: artist.getJwtToken(),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get artist profile
// @route   GET /api/artists/profile
// @access  Private
export const getArtistProfile = asyncHandler(async (req: IArtistRequest, res: Response) => {
  const artist = await Artist.findById(req.artist?.id);

  if (artist) {
    res.json({
    //   _id: artist._id,
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

// @desc    Update artist profile
// @route   PUT /api/artists/profile
// @access  Private
export const updateArtistProfile = asyncHandler(async (req: IArtistRequest, res: Response) => {
  const artist = await Artist.findById(req.artist?.id);

  if (artist) {
    artist.name = req.body.name || artist.name;
    artist.bio = req.body.bio || artist.bio;
    artist.genres = req.body.genres || artist.genres;
    artist.availability = req.body.availability ?? artist.availability;

    if (req.body.password) {
      artist.password = req.body.password;
    }

    const updatedArtist = await artist.save();

    res.json({
    //   _id: updatedArtist._id,
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
