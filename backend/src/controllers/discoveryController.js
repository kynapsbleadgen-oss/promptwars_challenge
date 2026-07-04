import { GoogleGenerativeAI } from "@google/generative-ai";
import { Trip } from "../models/Trip.js";
import { AiLog } from "../models/AiLog.js";
import { Analytics } from "../models/Analytics.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { DiscoveryInputSchema, DiscoveryResultSchema } from "../utils/schemas.js";
import { env } from "../config/env.js";
import { ANALYTICS_ACTIONS } from "../config/constants.js";

function requireAi() {
  if (!env.aiEnabled) {
    throw ApiError.serviceUnavailable(
      "AI features are disabled. Set GOOGLE_GEMINI_API_KEY in .env.",
    );
  }
}

/**
 * POST /api/discover
 * Runs the Gemini cultural-discovery prompt. Optionally saves as a Trip
 * if the requester is authenticated.
 */
export const discover = asyncHandler(async (req, res) => {
  requireAi();

  const data = DiscoveryInputSchema.parse(req.body);

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: env.geminiModel });

  const prompt = `You are a deeply knowledgeable local cultural guide, writing in the editorial voice of National Geographic and Cereal Magazine. A traveller is planning a trip.

Traveller brief:
- Drawn to: ${data.location}
- Primary interests: ${data.interests.join(", ")}
- Duration: ${data.duration}
- Investment level: ${data.budget}
- Travel style: ${data.travelStyle}

Task:
1. Write a short evocative intro paragraph (2-3 sentences, editorial, second person).
2. Suggest EXACTLY 4 personalized destinations that match the brief — real places (cities, districts, valleys, regions). For each, give: name, region/country, one paragraph of cultural significance (3-4 sentences, storyteller voice), best season to visit, estimated budget (short phrase with currency), suggested duration, one line of local etiquette, one transportation tip, and a short imageQuery (3-6 words describing an evocative photograph of the place).
3. Suggest EXACTLY 4 hidden gems near or within those destinations — authentic places typical tourists miss (secret viewpoints, artisan workshops, tucked-away cafés, village experiences, quiet neighbourhoods). For each: name, category, why it's special (2-3 sentences), a short local story or anecdote, best time to visit, one visiting tip, difficulty (Easy/Moderate/Challenging), and a short imageQuery.

Return ONLY a JSON object matching this exact shape (no markdown, no code fences, no commentary):
{
  "intro": string,
  "destinations": [ { "name": string, "region": string, "culturalSignificance": string, "bestSeason": string, "estimatedBudget": string, "suggestedDuration": string, "localEtiquette": string, "transportationTip": string, "imageQuery": string } ],
  "hiddenGems": [ { "name": string, "category": string, "whySpecial": string, "localStory": string, "bestTimeToVisit": string, "visitingTip": string, "difficulty": string, "imageQuery": string } ]
}`;

  const start = Date.now();
  let aiText = "";
  let success = true;
  let errorMsg = "";

  try {
    const result = await model.generateContent(prompt);
    aiText = result.response.text();
  } catch (err) {
    success = false;
    errorMsg = err.message || "Gemini API error";

    await AiLog.create({
      userId: req.user?._id,
      kind: "discovery",
      model: env.geminiModel,
      prompt,
      response: "",
      latencyMs: Date.now() - start,
      success: false,
      error: errorMsg,
    });

    throw ApiError.serviceUnavailable("AI generation failed. Please try again.");
  }

  const latencyMs = Date.now() - start;

  // Strip markdown fences Gemini sometimes adds.
  const cleaned = aiText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      await AiLog.create({
        userId: req.user?._id,
        kind: "discovery",
        model: env.geminiModel,
        prompt,
        response: aiText,
        latencyMs,
        success: false,
        error: "Unparseable JSON",
      });
      throw ApiError.serviceUnavailable("AI response could not be parsed. Try again.");
    }
    parsed = JSON.parse(match[0]);
  }

  const validated = DiscoveryResultSchema.parse(parsed);

  // Log the AI call.
  await AiLog.create({
    userId: req.user?._id,
    kind: "discovery",
    model: env.geminiModel,
    prompt,
    response: aiText.slice(0, 8000),
    latencyMs,
    success,
    error: errorMsg,
  });

  // Auto-save as a Trip if the user is authenticated.
  let trip = null;
  if (req.user) {
    trip = await Trip.create({
      userId: req.user._id,
      title: `Trip to ${data.location}`,
      location: data.location,
      interests: data.interests,
      duration: data.duration,
      budget: data.budget,
      travelStyle: data.travelStyle,
      intro: validated.intro,
      destinations: validated.destinations,
      hiddenGems: validated.hiddenGems,
    });

    await Analytics.create({
      userId: req.user._id,
      action: ANALYTICS_ACTIONS.DISCOVERY,
      metadata: { location: data.location, tripId: trip._id },
    });
  }

  res.json({ ...validated, tripId: trip?._id || null });
});
