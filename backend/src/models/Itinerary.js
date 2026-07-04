import mongoose from "mongoose";
import {
  ITINERARY_VISIBILITY,
  ITINERARY_VISIBILITY_VALUES,
} from "../config/constants.js";

// Educators (teacher/mentor) group trips into shareable itineraries.
const itinerarySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 2000 },
    category: { type: String, default: "General", trim: true, maxlength: 60 },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    visibility: {
      type: String,
      enum: ITINERARY_VISIBILITY_VALUES,
      default: ITINERARY_VISIBILITY.PRIVATE,
      index: true,
    },
  },
  { timestamps: true },
);

itinerarySchema.index({ createdBy: 1, createdAt: -1 });
itinerarySchema.index({ sharedWith: 1 });

export const Itinerary = mongoose.model("Itinerary", itinerarySchema);
