import mongoose, { Schema, Document } from "mongoose";
import { IArtist } from "../interfaces";


const ArtistSchema: Schema = new Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    bio: { 
        type: String
     },
    genres: { 
        type: [String], 
        required: true 
    },
    availability: { 
        type: Boolean, 
        default: true 
    },
    email: { type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IArtist & Document>("Artist", ArtistSchema);
