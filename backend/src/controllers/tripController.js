import { Trip } from "../models/Trip.js";
import { Analytics } from "../models/Analytics.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginatedResponse } from "../utils/pagination.js";
import { ANALYTICS_ACTIONS } from "../config/constants.js";

/**
 * GET /api/trips — own trips (users), all trips (admin/director)
 */
export const listTrips = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query);

  const filter = {};
  const isElevated = ["admin", "director"].includes(req.user.role);

  // Regular users only see their own trips.
  if (!isElevated) filter.userId = req.user._id;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const [items, total] = await Promise.all([
    Trip.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Trip.countDocuments(filter),
  ]);

  res.json(paginatedResponse({ items, total, page, limit }));
});

/**
 * GET /api/trips/:id
 */
export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).lean();
  if (!trip) throw ApiError.notFound("Trip not found");

  const isOwner = trip.userId.toString() === req.user._id.toString();
  const isElevated = ["admin", "director"].includes(req.user.role);
  if (!isOwner && !isElevated) throw ApiError.forbidden();

  await Analytics.create({
    userId: req.user._id,
    action: ANALYTICS_ACTIONS.VIEW,
    metadata: { tripId: trip._id },
  });

  res.json({ trip });
});

/**
 * POST /api/trips
 */
export const createTrip = asyncHandler(async (req, res) => {
  const {
    title, location, interests, duration, budget, travelStyle,
    intro, destinations, hiddenGems, status, notes, tags,
  } = req.body;

  const trip = await Trip.create({
    userId: req.user._id,
    title: title || `Trip to ${location}`,
    location,
    interests,
    duration,
    budget,
    travelStyle,
    intro,
    destinations,
    hiddenGems,
    status,
    notes,
    tags,
  });

  await Analytics.create({
    userId: req.user._id,
    action: ANALYTICS_ACTIONS.SAVE,
    metadata: { tripId: trip._id, location },
  });

  res.status(201).json({ trip });
});

/**
 * PUT /api/trips/:id
 */
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw ApiError.notFound("Trip not found");

  const isOwner = trip.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw ApiError.forbidden();

  const allowed = [
    "title", "location", "interests", "duration", "budget", "travelStyle",
    "intro", "destinations", "hiddenGems", "status", "notes", "tags",
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) trip[key] = req.body[key];
  }

  await trip.save();
  res.json({ trip });
});

/**
 * DELETE /api/trips/:id
 */
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw ApiError.notFound("Trip not found");

  const isOwner = trip.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw ApiError.forbidden();

  await trip.deleteOne();
  res.json({ message: "Trip deleted" });
});
