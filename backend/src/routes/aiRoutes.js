import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  culturalInsight,
  enhanceTrip,
} from "../controllers/aiController.js";

const router = Router();

router.use(requireAuth);
router.use(aiLimiter);

router.post("/cultural-insight", culturalInsight);
router.post("/enhance-trip", enhanceTrip);

export default router;
