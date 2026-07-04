import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { ELEVATED_ROLES } from "../config/constants.js";
import {
  getDashboard,
  getAiLogs,
} from "../controllers/analyticsController.js";

const router = Router();

router.use(requireAuth);
router.use(authorize(...ELEVATED_ROLES));

router.get("/dashboard", getDashboard);
router.get("/ai-logs", getAiLogs);

export default router;
