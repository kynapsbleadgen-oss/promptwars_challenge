import { z } from "zod";

// Shared Zod shapes — used to validate the Gemini output on the backend and
// re-exported conceptually to the frontend types. Mirrors the original
// frontend discovery.schemas.ts contract so nothing downstream breaks.

export const DiscoveryInputSchema = z.object({
  location: z.string().trim().min(2).max(120),
  interests: z.array(z.string().min(1).max(40)).min(1).max(8),
  duration: z.string().min(1).max(40),
  budget: z.string().min(1).max(40),
  travelStyle: z.string().min(1).max(40).optional().default("Cultural immersion"),
});

export const DestinationSchema = z.object({
  name: z.string(),
  region: z.string(),
  culturalSignificance: z.string(),
  bestSeason: z.string(),
  estimatedBudget: z.string(),
  suggestedDuration: z.string(),
  localEtiquette: z.string(),
  transportationTip: z.string(),
  imageQuery: z.string(),
});

export const HiddenGemSchema = z.object({
  name: z.string(),
  category: z.string(),
  whySpecial: z.string(),
  localStory: z.string(),
  bestTimeToVisit: z.string(),
  visitingTip: z.string(),
  difficulty: z.string(),
  imageQuery: z.string(),
});

export const DiscoveryResultSchema = z.object({
  intro: z.string(),
  destinations: z.array(DestinationSchema),
  hiddenGems: z.array(HiddenGemSchema),
});
