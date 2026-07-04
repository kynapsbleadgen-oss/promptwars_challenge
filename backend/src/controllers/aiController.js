import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiLog } from "../models/AiLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

function requireAi() {
  if (!env.aiEnabled) {
    throw ApiError.serviceUnavailable(
      "AI features are disabled. Set GOOGLE_GEMINI_API_KEY in .env.",
    );
  }
}

/**
 * POST /api/ai/cultural-insight
 * Free-form AI cultural question answering.
 */
export const culturalInsight = asyncHandler(async (req, res) => {
  requireAi();

  const { question } = req.body;
  if (!question || typeof question !== "string" || question.trim().length < 5) {
    throw ApiError.badRequest("Provide a question (at least 5 characters).");
  }

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: env.geminiModel });

  const prompt = `You are an expert cultural historian and travel advisor. Answer the following question in a thoughtful, well-researched, and engaging way. Provide specific, actionable information.\n\nQuestion: ${question.trim()}`;

  const start = Date.now();
  let text = "";

  try {
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } catch (err) {
    await AiLog.create({
      userId: req.user._id,
      kind: "cultural-insight",
      model: env.geminiModel,
      prompt,
      response: "",
      latencyMs: Date.now() - start,
      success: false,
      error: err.message,
    });
    throw ApiError.serviceUnavailable("AI generation failed. Try again.");
  }

  await AiLog.create({
    userId: req.user._id,
    kind: "cultural-insight",
    model: env.geminiModel,
    prompt,
    response: text.slice(0, 8000),
    latencyMs: Date.now() - start,
    success: true,
  });

  res.json({ answer: text });
});

/**
 * POST /api/ai/enhance-trip
 * Takes existing trip data and returns enhanced suggestions.
 */
export const enhanceTrip = asyncHandler(async (req, res) => {
  requireAi();

  const { location, interests, existingDestinations } = req.body;
  if (!location) throw ApiError.badRequest("Location is required.");

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: env.geminiModel });

  const existingNames = (existingDestinations || [])
    .map((d) => d.name)
    .filter(Boolean)
    .join(", ");

  const prompt = `You are an expert cultural travel advisor. A traveller already has these destinations planned for ${location}: ${existingNames || "none yet"}.

Their interests: ${(interests || []).join(", ") || "general cultural travel"}.

Suggest 2 additional lesser-known destinations and 2 unique experiences they should NOT miss. For each, provide: name, why it's special (2-3 sentences), and one practical tip.

Return ONLY a JSON object:
{
  "additionalDestinations": [{ "name": string, "whySpecial": string, "tip": string }],
  "uniqueExperiences": [{ "name": string, "whySpecial": string, "tip": string }]
}`;

  const start = Date.now();
  let text = "";

  try {
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } catch (err) {
    await AiLog.create({
      userId: req.user._id,
      kind: "enhance-trip",
      model: env.geminiModel,
      prompt,
      response: "",
      latencyMs: Date.now() - start,
      success: false,
      error: err.message,
    });
    throw ApiError.serviceUnavailable("AI generation failed. Try again.");
  }

  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw ApiError.serviceUnavailable("AI response could not be parsed.");
    parsed = JSON.parse(match[0]);
  }

  await AiLog.create({
    userId: req.user._id,
    kind: "enhance-trip",
    model: env.geminiModel,
    prompt,
    response: text.slice(0, 8000),
    latencyMs: Date.now() - start,
    success: true,
  });

  res.json(parsed);
});
