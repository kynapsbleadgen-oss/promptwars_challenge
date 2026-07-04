import { User } from "../models/User.js";
import { Analytics } from "../models/Analytics.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from "../utils/tokens.js";
import { REFRESH_COOKIE, ANALYTICS_ACTIONS } from "../config/constants.js";

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) throw ApiError.conflict("A user with that email already exists");

  const user = await User.create({ name, email, password });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  setRefreshCookie(res, refreshToken);

  await Analytics.create({
    userId: user._id,
    action: ANALYTICS_ACTIONS.REGISTER,
    metadata: { role: user.role },
  });

  res.status(201).json({
    user: user.toJSON(),
    accessToken,
  });
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.toLowerCase().trim();

  let user = await User.findOne({ email: cleanEmail }).select("+password");

  // Server-side Demo Account Auto-Provisioning & Auto-Heal
  if (cleanEmail === "demo@wayfare.dev") {
    if (!user) {
      // Auto-create demo user if they don't exist
      user = await User.create({
        name: "Demo Traveller",
        email: cleanEmail,
        password: "demo1234",
        role: "user",
        bio: "A curious wanderer exploring cultural secrets.",
      });
      // Re-fetch with password select
      user = await User.findOne({ email: cleanEmail }).select("+password");
    } else if (password === "demo1234") {
      // Auto-heal password to demo1234 if it was modified
      const ok = await user.comparePassword(password);
      if (!ok) {
        user.password = "demo1234";
        await user.save();
        // Re-fetch to get updated hash
        user = await User.findOne({ email: cleanEmail }).select("+password");
      }
    }
  }

  if (!user || !user.active) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized("Invalid email or password");

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  setRefreshCookie(res, refreshToken);

  await Analytics.create({
    userId: user._id,
    action: ANALYTICS_ACTIONS.LOGIN,
    metadata: { role: user.role },
  });

  res.json({ user: user.toJSON(), accessToken });
});

/**
 * POST /api/auth/refresh
 */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized("No refresh token");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.active) {
    throw ApiError.unauthorized("Account not found or deactivated");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  setRefreshCookie(res, refreshToken);

  res.json({ accessToken });
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (_req, res) => {
  clearRefreshCookie(res);
  res.json({ message: "Logged out" });
});

/**
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toJSON() });
});
