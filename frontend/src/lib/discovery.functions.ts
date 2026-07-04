import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import {
  DiscoveryInputSchema,
  ResponseSchema,
  type DiscoveryResult,
} from "./discovery.schemas";

// Re-export for backward compatibility
export type { DiscoveryResult } from "./discovery.schemas";

export const discover = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DiscoveryInputSchema.parse(data))
  .handler(async ({ data }): Promise<DiscoveryResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

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

    const { text } = await generateText({ model, prompt });

    // Gemini sometimes wraps JSON in ```json fences — strip them.
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to extract the first {...} block
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("The AI response could not be parsed. Please try again.");
      }
      parsed = JSON.parse(match[0]);
    }

    return ResponseSchema.parse(parsed);
  });
