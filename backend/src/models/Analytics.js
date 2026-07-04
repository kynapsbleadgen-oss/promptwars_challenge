import mongoose from "mongoose";
import { ANALYTICS_ACTIONS } from "../config/constants.js";

// Lightweight event log powering the real dashboard aggregations.
const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(ANALYTICS_ACTIONS),
      required: true,
      index: true,
    },
    // Free-form context (e.g. { location, tripId, role }).
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false },
);

// Time-series queries by action and day.
analyticsSchema.index({ action: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1, timestamp: -1 });

export const Analytics = mongoose.model("Analytics", analyticsSchema);
