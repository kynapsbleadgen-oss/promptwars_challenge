import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginatedResponse } from "../utils/pagination.js";

/**
 * GET /api/users — admin/director only
 */
export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query);

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  res.json(paginatedResponse({ items, total, page, limit }));
});

/**
 * GET /api/users/:id
 */
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) throw ApiError.notFound("User not found");
  res.json({ user });
});

/**
 * PUT /api/users/:id — owner or admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  const isOwner = req.user._id.toString() === req.params.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw ApiError.forbidden();

  // Only admins may change roles.
  const { name, bio, avatar, role } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (avatar !== undefined) updates.avatar = avatar;
  if (role !== undefined && isAdmin) updates.role = role;

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw ApiError.notFound("User not found");

  res.json({ user: user.toJSON() });
});

/**
 * DELETE /api/users/:id — admin or self (soft-deactivate)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const isOwner = req.user._id.toString() === req.params.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw ApiError.forbidden();

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true },
  );
  if (!user) throw ApiError.notFound("User not found");

  res.json({ message: "User deactivated" });
});
