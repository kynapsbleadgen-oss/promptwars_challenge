import dotenv from "dotenv";

dotenv.config();

// Required variables — the process refuses to start without them so we never
// silently run with a broken auth or database configuration.
const REQUIRED = ["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];

// GOOGLE_GEMINI_API_KEY is "soft required": the server boots without it, but AI
// endpoints return a clear 503 instead of crashing. We warn loudly on boot.
const SOFT_REQUIRED = ["GOOGLE_GEMINI_API_KEY"];

function bool(value, fallback) {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

function int(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function loadEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `\n[env] Missing required environment variables: ${missing.join(", ")}\n` +
        `[env] Copy backend/.env.example to backend/.env and fill them in.\n`,
    );
    process.exit(1);
  }

  const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: int(process.env.PORT, 5000),
    mongoUri: process.env.MONGODB_URI,

    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || "15m",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || "7d",

    geminiApiKey: process.env.GOOGLE_GEMINI_API_KEY || "",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",

    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

    rateLimitWindowMs: int(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    rateLimitMax: int(process.env.RATE_LIMIT_MAX, 100),
    aiRateLimitMax: int(process.env.AI_RATE_LIMIT_MAX, 20),
    authRateLimitMax: int(process.env.AUTH_RATE_LIMIT_MAX, 20),

    cookieSecure: bool(process.env.COOKIE_SECURE, false),
  };

  env.isProd = env.nodeEnv === "production";
  env.isTest = env.nodeEnv === "test";
  env.aiEnabled = Boolean(env.geminiApiKey);

  const softMissing = SOFT_REQUIRED.filter((key) => !process.env[key]);
  if (softMissing.length > 0 && !env.isTest) {
    // eslint-disable-next-line no-console
    console.warn(
      `\n[env] Warning: ${softMissing.join(", ")} not set. ` +
        `AI features will return a 503 until you add a key.\n`,
    );
  }

  return env;
}

export const env = loadEnv();
