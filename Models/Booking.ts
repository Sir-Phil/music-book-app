import mongoose, { Document, Schema } from "mongoose";
import { IBooking } from "../interfaces";

const BookingSchema: Schema = new Schema(
  {
    artist: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Artist", required: true 
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event", required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Confirmed", "Cancelled"], 
        default: "Pending" 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking & Document>("Booking", BookingSchema);
