import mongoose from "mongoose";
import { TRIP_STATUS, TRIP_STATUS_VALUES } from "../config/constants.js";

// Sub-shapes mirror the Gemini discovery output so the whole AI result is
// persisted verbatim alongside the user's structured query.
const destinationSchema = new mongoose.Schema(
  {
    name: String,
    region: String,
    culturalSignificance: String,
    bestSeason: String,
    estimatedBudget: String,
    suggestedDuration: String,
    localEtiquette: String,
    transportationTip: String,
    imageQuery: String,
  },
  { _id: false },
);

const hiddenGemSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    whySpecial: String,
    localStory: String,
    bestTimeToVisit: String,
    visitingTip: String,
    difficulty: String,
    imageQuery: String,
  },
  { _id: false },
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    interests: [{ type: String, trim: true, maxlength: 60 }],
    duration: { type: String, trim: true, maxlength: 60 },
    budget: { type: String, trim: true, maxlength: 60 },
    travelStyle: { type: String, trim: true, maxlength: 60, default: "Cultural immersion" },

    // Full AI response.
    intro: { type: String, default: "" },
    destinations: { type: [destinationSchema], default: [] },
    hiddenGems: { type: [hiddenGemSchema], default: [] },

    status: {
      type: String,
      enum: TRIP_STATUS_VALUES,
      default: TRIP_STATUS.DRAFT,
      index: true,
    },
    notes: { type: String, default: "", maxlength: 2000 },
    tags: [{ type: String, trim: true, maxlength: 40 }],
  },
  { timestamps: true },
);

// Common access patterns: a user's trips newest-first, and status filters.
tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ status: 1, createdAt: -1 });
// Text search across title/location/tags for the search bar.
tripSchema.index({ title: "text", location: "text", tags: "text" });

export const Trip = mongoose.model("Trip", tripSchema);
