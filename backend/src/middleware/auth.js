import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { User } from "../models/User.js";

/**
 * Require a valid access token. Attaches the live user document to req.user.
 * Token is read from the Authorization: Bearer <token> header.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw ApiError.unauthorized("Missing authentication token");

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.active) {
    throw ApiError.unauthorized("Account not found or deactivated");
  }

  req.user = user;
  next();
});

/**
 * Optional auth: attaches req.user if a valid token is present, but never
 * blocks the request. Used by endpoints that behave differently when signed in
 * (e.g. discovery saves a trip only for authenticated users).
 */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.active) req.user = user;
  } catch {
    // Ignore — treated as anonymous.
  }
  next();
});
