import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xssClean from "xss-clean";

import { env } from "./config/env.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import discoveryRoutes from "./routes/discoveryRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

/**
 * Build the Express app. Kept separate from server.js so tests can import the
 * app without opening a network port.
 */
export function createApp() {
  const app = express();

  // Behind a proxy (Render/Railway/nginx) so rate-limit + secure cookies work.
  app.set("trust proxy", 1);

  // Security headers. CSP is relaxed enough for a JSON API; the SPA sets its own.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  // CORS — single whitelisted origin, credentials enabled for the refresh cookie.
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use(compression());

  // Sanitization: strip Mongo operators, clean XSS, guard param pollution.
  app.use(mongoSanitize());
  app.use(xssClean());
  app.use(hpp());

  if (!env.isTest) {
    app.use(morgan(env.isProd ? "combined" : "dev"));
  }

  // Liveness / readiness — cheap, unauthenticated.
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      env: env.nodeEnv,
      aiEnabled: env.aiEnabled,
      time: new Date().toISOString(),
    });
  });

  // Apply the general limiter to everything under /api, then mount routes.
  app.use("/api", generalLimiter);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/trips", tripRoutes);
  app.use("/api/discover", discoveryRoutes);
  app.use("/api/itineraries", itineraryRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/ai", aiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
