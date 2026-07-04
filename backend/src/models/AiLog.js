import mongoose from "mongoose";

// Every Gemini call is recorded here for admin monitoring / cost tracking.
const aiLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    kind: {
      type: String,
      // discovery | cultural-insight | enhance-trip | chat
      default: "discovery",
      index: true,
    },
    model: { type: String, default: "" },
    prompt: { type: String, default: "" },
    response: { type: String, default: "" },
    tokens: { type: Number, default: 0 },
    latencyMs: { type: Number, default: 0 },
    success: { type: Boolean, default: true },
    error: { type: String, default: "" },
  },
  { timestamps: true },
);

aiLogSchema.index({ createdAt: -1 });
aiLogSchema.index({ success: 1, createdAt: -1 });

export const AiLog = mongoose.model("AiLog", aiLogSchema);
