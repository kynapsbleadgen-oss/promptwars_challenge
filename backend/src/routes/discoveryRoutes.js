import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { discover } from "../controllers/discoveryController.js";

const router = Router();

// Discovery works for anonymous users too (no trip saved), but authenticated
// users get their result auto-saved as a Trip.
router.post("/", aiLimiter, optionalAuth, discover);

export default router;
