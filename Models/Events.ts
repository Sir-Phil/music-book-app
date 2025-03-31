import mongoose, { Document, Schema } from "mongoose";
import { IEvent } from "../interfaces";

const EventSchema: Schema = new Schema (
  {
    title: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    artist: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Artist" 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent & Document>("Event", EventSchema);
