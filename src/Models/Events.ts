import mongoose, { Schema } from "mongoose";
import { IEvent } from "../interfaces";

const EventSchema: Schema<IEvent> = new Schema (
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

const Events = mongoose.model<IEvent>("Events", EventSchema);

export default Events
