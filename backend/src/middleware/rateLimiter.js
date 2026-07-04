import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const shared = {
  standardHeaders: true,
  legacyHeaders: false,
  // Don't rate-limit in the test env (breaks Supertest bursts).
  skip: () => env.isTest,
  message: { error: { message: "Too many requests, please try again later." } },
};

// Broad limiter applied to all /api traffic.
export const generalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  ...shared,
});

// Stricter limiter for auth endpoints (brute-force protection).
export const authLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.authRateLimitMax,
  ...shared,
});

// Tightest limiter for expensive AI endpoints.
export const aiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.aiRateLimitMax,
  ...shared,
});
