import mongoose, { Document, Schema } from "mongoose";
import { IBooking } from "../interfaces";

const BookingSchema: Schema<IBooking> = new Schema(
  {
    artist: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Artist", required: true 
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event", required: true 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // User should be required for each booking
    },
    status: { 
        type: String, 
        enum: ["Pending", "Confirmed", "Cancelled"], 
        default: "Pending" 
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking
