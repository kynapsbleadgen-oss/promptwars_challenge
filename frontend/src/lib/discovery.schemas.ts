import { z } from "zod";

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

export const ResponseSchema = z.object({
  intro: z.string(),
  destinations: z.array(DestinationSchema),
  hiddenGems: z.array(HiddenGemSchema),
  tripId: z.string().nullable().optional(),
});

export type DiscoveryResult = z.infer<typeof ResponseSchema>;
