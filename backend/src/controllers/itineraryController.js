import { Itinerary } from "../models/Itinerary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginatedResponse } from "../utils/pagination.js";

/**
 * GET /api/itineraries
 */
export const listItineraries = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query);

  const filter = {};
  const isElevated = ["admin", "director"].includes(req.user.role);

  if (!isElevated) {
    // Users see itineraries they created or that are shared with them, plus public ones.
    filter.$or = [
      { createdBy: req.user._id },
      { sharedWith: req.user._id },
      { visibility: "public" },
    ];
  }

  const [items, total] = await Promise.all([
    Itinerary.find(filter)
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Itinerary.countDocuments(filter),
  ]);

  res.json(paginatedResponse({ items, total, page, limit }));
});

/**
 * GET /api/itineraries/:id
 */
export const getItinerary = asyncHandler(async (req, res) => {
  const item = await Itinerary.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("trips")
    .lean();
  if (!item) throw ApiError.notFound("Itinerary not found");

  const isOwner = item.createdBy._id.toString() === req.user._id.toString();
  const isShared = item.sharedWith?.some(
    (id) => id.toString() === req.user._id.toString(),
  );
  const isPublic = item.visibility === "public";
  const isElevated = ["admin", "director"].includes(req.user.role);

  if (!isOwner && !isShared && !isPublic && !isElevated) {
    throw ApiError.forbidden();
  }

  res.json({ itinerary: item });
});

/**
 * POST /api/itineraries
 */
export const createItinerary = asyncHandler(async (req, res) => {
  const { title, description, category, trips, sharedWith, visibility } =
    req.body;

  const item = await Itinerary.create({
    createdBy: req.user._id,
    title,
    description,
    category,
    trips: trips || [],
    sharedWith: sharedWith || [],
    visibility,
  });

  res.status(201).json({ itinerary: item });
});

/**
 * PUT /api/itineraries/:id
 */
export const updateItinerary = asyncHandler(async (req, res) => {
  const item = await Itinerary.findById(req.params.id);
  if (!item) throw ApiError.notFound("Itinerary not found");

  const isOwner = item.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw ApiError.forbidden();

  const allowed = ["title", "description", "category", "trips", "sharedWith", "visibility"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) item[key] = req.body[key];
  }

  await item.save();
  res.json({ itinerary: item });
});

/**
 * DELETE /api/itineraries/:id
 */
export const deleteItinerary = asyncHandler(async (req, res) => {
  const item = await Itinerary.findById(req.params.id);
  if (!item) throw ApiError.notFound("Itinerary not found");

  const isOwner = item.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw ApiError.forbidden();

  await item.deleteOne();
  res.json({ message: "Itinerary deleted" });
});
