/**
 * seed.js — Populates the database with demo data for local development.
 *
 * Usage:  npm run seed
 *         node seed.js
 *
 * Creates:
 *   - 1 admin user
 *   - 1 teacher user
 *   - 2 regular users
 *   - 3 sample trips (owned by demo user)
 *   - 1 sample itinerary
 *   - A handful of analytics events
 *
 * Safe to run multiple times — drops existing data first.
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { User } from "./src/models/User.js";
import { Trip } from "./src/models/Trip.js";
import { Itinerary } from "./src/models/Itinerary.js";
import { Analytics } from "./src/models/Analytics.js";
import { AiLog } from "./src/models/AiLog.js";
import { ANALYTICS_ACTIONS } from "./src/config/constants.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/atlas-ai";

async function seed() {
  console.log("[seed] Connecting to MongoDB…");
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("[seed] Connected.");

  // Clear all collections.
  await Promise.all([
    User.deleteMany({}),
    Trip.deleteMany({}),
    Itinerary.deleteMany({}),
    Analytics.deleteMany({}),
    AiLog.deleteMany({}),
  ]);
  console.log("[seed] Cleared existing data.");

  // ── Users ────────────────────────────────────────────────
  const admin = await User.create({
    name: "Atlas Admin",
    email: "admin@atlas.dev",
    password: "admin1234",
    role: "admin",
  });

  const teacher = await User.create({
    name: "Maya Sen",
    email: "maya@atlas.dev",
    password: "teacher1234",
    role: "teacher",
  });

  const mentor = await User.create({
    name: "Rafael Costa",
    email: "rafael@atlas.dev",
    password: "mentor1234",
    role: "mentor",
    bio: "Guides students through immersive field study. Ex-archaeologist.",
  });

  const director = await User.create({
    name: "Priya Nair",
    email: "priya@atlas.dev",
    password: "director1234",
    role: "director",
    bio: "Programme director. Oversees cohorts and cross-team analytics.",
  });

  const user1 = await User.create({
    name: "Leo Tanaka",
    email: "leo@atlas.dev",
    password: "user1234",
    role: "user",
    bio: "Curious traveller. Tea enthusiast. Kyoto dreamer.",
  });

  const user2 = await User.create({
    name: "Amira Khoury",
    email: "amira@atlas.dev",
    password: "user1234",
    role: "user",
    bio: "Architecture nerd. Loves medinas and souks.",
  });

  console.log("[seed] Created 6 users.");

  // ── Trips ────────────────────────────────────────────────
  const trip1 = await Trip.create({
    userId: user1._id,
    title: "Cultural Kyoto Pilgrimage",
    location: "Kyoto, Japan",
    interests: ["Sacred Architecture", "Culinary Rituals", "Village Life"],
    duration: "1–2 Weeks",
    budget: "Classic Cultural",
    travelStyle: "Cultural immersion",
    intro:
      "You will find Kyoto not in its famous temples alone, but in the quiet ritual of a tea master's hands, the rustle of a bamboo grove at dawn, and the ghost of a geisha's footsteps on a stone-paved lane.",
    destinations: [
      {
        name: "Higashiyama District",
        region: "Kyoto, Japan",
        culturalSignificance:
          "Higashiyama preserves the soul of old Kyoto — narrow lanes climbing between wooden machiya, incense drifting from Kiyomizu-dera, and the click of geta sandals on stone. It is a district that refuses to be modern.",
        bestSeason: "Late March (cherry blossoms) or November (autumn foliage)",
        estimatedBudget: "¥8,000–12,000/day",
        suggestedDuration: "3–4 days",
        localEtiquette: "Walk quietly in temple grounds; photography is often restricted inside.",
        transportationTip: "Walk. The district is best experienced on foot from Gion to Kiyomizu.",
        imageQuery: "Kyoto Higashiyama stone path lanterns",
      },
      {
        name: "Fushimi",
        region: "Southern Kyoto, Japan",
        culturalSignificance:
          "Beyond the vermillion torii of Fushimi Inari, this neighbourhood is Japan's sake heartland — 37 breweries line the canal, and the water itself is considered sacred.",
        bestSeason: "January–February (sake brewing season)",
        estimatedBudget: "¥5,000–8,000/day",
        suggestedDuration: "1–2 days",
        localEtiquette: "Sake tastings are free but it's polite to buy a bottle.",
        transportationTip: "JR Nara line from Kyoto Station, 5 minutes.",
        imageQuery: "Fushimi sake brewery canal Kyoto",
      },
    ],
    hiddenGems: [
      {
        name: "Ōtagi Nenbutsu-ji",
        category: "Temple",
        whySpecial:
          "Tucked in the western hills, this temple holds 1,200 stone rakan statues — each with a unique, often whimsical face carved by amateur visitors in the 1980s.",
        localStory:
          "A monk invited anyone to carve a statue as prayer. Farmers, schoolchildren, and businessmen all left their mark. No two are alike.",
        bestTimeToVisit: "Early morning, before 9am",
        visitingTip: "Combine with a walk through the Arashiyama bamboo grove nearby.",
        difficulty: "Easy",
        imageQuery: "Otagi Nenbutsu-ji moss stone statues",
      },
      {
        name: "Nishiki Market Back Alleys",
        category: "Food Market",
        whySpecial:
          "While the main arcade is tourist-heavy, the perpendicular alleys hide family-run tsukemono shops and a 90-year-old knife sharpener.",
        localStory:
          "The knife sharpener, Yamada-san, learned from his grandfather. He still uses the same whetstone.",
        bestTimeToVisit: "10am–12pm weekdays",
        visitingTip: "Ask for 'ura Nishiki' (back Nishiki) — locals will know.",
        difficulty: "Easy",
        imageQuery: "Nishiki market narrow alley Kyoto pickles",
      },
    ],
    status: "published",
    tags: ["japan", "temples", "food"],
  });

  const trip2 = await Trip.create({
    userId: user2._id,
    title: "Moroccan Medina Trail",
    location: "Fez, Morocco",
    interests: ["Ancient History", "Textile Craft", "Sacred Architecture"],
    duration: "4–7 Days",
    budget: "Sustainable / Local",
    travelStyle: "Cultural immersion",
    intro:
      "Fez does not reveal itself to the hurried. Its medina — the largest car-free urban area on Earth — asks you to slow down, follow the scent of cedar and saffron, and let the alleyways lead.",
    destinations: [
      {
        name: "Fez el-Bali",
        region: "Fez, Morocco",
        culturalSignificance:
          "Founded in the 9th century, Fez el-Bali is a living medieval city — 9,400 alleyways, 400 mosques, and the oldest continuously operating university on the planet, al-Qarawiyyin.",
        bestSeason: "October–November or March–April",
        estimatedBudget: "300–500 MAD/day",
        suggestedDuration: "4–5 days",
        localEtiquette: "Always greet with 'Salaam alaikum.' Accept mint tea if offered.",
        transportationTip: "Hire a local guide for the first day; GPS is useless in the medina.",
        imageQuery: "Fez medina blue tiles narrow alley",
      },
    ],
    hiddenGems: [
      {
        name: "Chouara Tannery Terraces",
        category: "Artisan Workshop",
        whySpecial:
          "The tanneries of Fez are 1,000 years old. From the terraces of surrounding leather shops, you watch men knee-deep in vats of saffron, indigo, and poppy.",
        localStory:
          "The guild of tanners has passed skills father-to-son since the 11th century. They still use pigeon dung as a softening agent.",
        bestTimeToVisit: "Morning for best light and less heat",
        visitingTip: "You'll be offered mint to hold against your nose — take it.",
        difficulty: "Easy",
        imageQuery: "Fez Chouara tannery colourful vats aerial",
      },
    ],
    status: "draft",
    tags: ["morocco", "medina", "craft"],
  });

  const trip3 = await Trip.create({
    userId: user1._id,
    title: "Portuguese Alentejo Escape",
    location: "Alentejo, Portugal",
    interests: ["Coastal Heritage", "Culinary Rituals", "Village Life"],
    duration: "4–7 Days",
    budget: "Classic Cultural",
    travelStyle: "Cultural immersion",
    intro:
      "The Alentejo is Portugal's slow heartbeat — cork oak plains stretching to the horizon, whitewashed villages drowsy in afternoon heat, and a cuisine that remembers poverty with dignity.",
    destinations: [],
    hiddenGems: [],
    status: "draft",
    tags: ["portugal", "coast", "wine"],
  });

  console.log("[seed] Created 3 trips.");

  // ── Itinerary ────────────────────────────────────────────
  await Itinerary.create({
    createdBy: teacher._id,
    title: "East Asian Cultural Heritage — Spring Term",
    description:
      "Curated set of cultural destinations for the spring term exchange programme. Students explore temple architecture, tea ceremony, and artisan craft traditions.",
    category: "Education",
    trips: [trip1._id],
    sharedWith: [user1._id, user2._id],
    visibility: "shared",
  });

  console.log("[seed] Created 1 itinerary.");

  // ── Analytics events ─────────────────────────────────────
  const events = [
    { userId: user1._id, action: ANALYTICS_ACTIONS.REGISTER, metadata: { role: "user" } },
    { userId: user2._id, action: ANALYTICS_ACTIONS.REGISTER, metadata: { role: "user" } },
    { userId: user1._id, action: ANALYTICS_ACTIONS.LOGIN, metadata: { role: "user" } },
    { userId: user2._id, action: ANALYTICS_ACTIONS.LOGIN, metadata: { role: "user" } },
    { userId: user1._id, action: ANALYTICS_ACTIONS.DISCOVERY, metadata: { location: "Kyoto, Japan" } },
    { userId: user2._id, action: ANALYTICS_ACTIONS.DISCOVERY, metadata: { location: "Fez, Morocco" } },
    { userId: user1._id, action: ANALYTICS_ACTIONS.DISCOVERY, metadata: { location: "Alentejo, Portugal" } },
    { userId: user1._id, action: ANALYTICS_ACTIONS.SAVE, metadata: { tripId: trip1._id } },
    { userId: user2._id, action: ANALYTICS_ACTIONS.SAVE, metadata: { tripId: trip2._id } },
    { userId: user1._id, action: ANALYTICS_ACTIONS.SAVE, metadata: { tripId: trip3._id } },
    { userId: user1._id, action: ANALYTICS_ACTIONS.VIEW, metadata: { tripId: trip1._id } },
    { userId: user2._id, action: ANALYTICS_ACTIONS.VIEW, metadata: { tripId: trip2._id } },
    { userId: teacher._id, action: ANALYTICS_ACTIONS.LOGIN, metadata: { role: "teacher" } },
    { userId: teacher._id, action: ANALYTICS_ACTIONS.DISCOVERY, metadata: { location: "Kyoto, Japan" } },
    { userId: mentor._id, action: ANALYTICS_ACTIONS.REGISTER, metadata: { role: "mentor" } },
    { userId: mentor._id, action: ANALYTICS_ACTIONS.LOGIN, metadata: { role: "mentor" } },
    { userId: mentor._id, action: ANALYTICS_ACTIONS.DISCOVERY, metadata: { location: "Fez, Morocco" } },
    { userId: director._id, action: ANALYTICS_ACTIONS.REGISTER, metadata: { role: "director" } },
    { userId: director._id, action: ANALYTICS_ACTIONS.LOGIN, metadata: { role: "director" } },
    { userId: admin._id, action: ANALYTICS_ACTIONS.LOGIN, metadata: { role: "admin" } },
  ];
  await Analytics.insertMany(events);
  console.log(`[seed] Created ${events.length} analytics events.`);

  // ── Done ─────────────────────────────────────────────────
  await mongoose.disconnect();
  console.log("\n[seed] ✓ Database seeded successfully.");
  console.log("\n  Demo accounts:");
  console.log("  ─────────────────────────────────────────────");
  console.log("  admin@atlas.dev     / admin1234    (admin)");
  console.log("  priya@atlas.dev     / director1234 (director)");
  console.log("  maya@atlas.dev      / teacher1234  (teacher)");
  console.log("  rafael@atlas.dev    / mentor1234   (mentor)");
  console.log("  leo@atlas.dev       / user1234     (user)");
  console.log("  amira@atlas.dev     / user1234     (user)");
  console.log("");
}

seed().catch((err) => {
  console.error("[seed] Fatal:", err);
  process.exit(1);
});
