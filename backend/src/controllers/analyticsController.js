import { Analytics } from "../models/Analytics.js";
import { Trip } from "../models/Trip.js";
import { User } from "../models/User.js";
import { AiLog } from "../models/AiLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/analytics/dashboard
 * Aggregated stats for admin/director dashboards.
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 86400000);

  const [
    totalUsers,
    totalTrips,
    recentDiscoveries,
    recentLogins,
    topLocations,
    dailyActivity,
  ] = await Promise.all([
    User.countDocuments({ active: true }),
    Trip.countDocuments(),
    Analytics.countDocuments({
      action: "discovery",
      timestamp: { $gte: thirtyDaysAgo },
    }),
    Analytics.countDocuments({
      action: "login",
      timestamp: { $gte: thirtyDaysAgo },
    }),
    Trip.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { location: "$_id", count: 1, _id: 0 } },
    ]),
    Analytics.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            action: "$action",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]),
  ]);

  res.json({
    totalUsers,
    totalTrips,
    recentDiscoveries,
    recentLogins,
    topLocations,
    dailyActivity,
  });
});

/**
 * GET /api/analytics/ai-logs — admin only
 */
export const getAiLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.success !== undefined) {
    filter.success = req.query.success === "true";
  }

  const [items, total] = await Promise.all([
    AiLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .lean(),
    AiLog.countDocuments(filter),
  ]);

  res.json({
    items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});
