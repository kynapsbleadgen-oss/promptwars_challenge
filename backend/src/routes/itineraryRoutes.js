import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from "../controllers/itineraryController.js";

const router = Router();

router.use(requireAuth);

router.get("/", listItineraries);
router.get("/:id", getItinerary);
router.post("/", createItinerary);
router.put("/:id", updateItinerary);
router.delete("/:id", deleteItinerary);

export default router;
