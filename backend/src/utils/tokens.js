import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { REFRESH_COOKIE } from "../config/constants.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpire,
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpire,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

// Parse a duration like "7d"/"15m"/"3600" into milliseconds for cookie maxAge.
function durationToMs(str, fallbackMs) {
  if (typeof str !== "string") return fallbackMs;
  const m = str.match(/^(\d+)\s*([smhd])?$/);
  if (!m) return fallbackMs;
  const n = Number(m[1]);
  const unit = m[2] || "s";
  const mult = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit];
  return n * mult;
}

export function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? "none" : "lax",
    maxAge: durationToMs(env.jwtRefreshExpire, 7 * 86400000),
    path: "/api/auth",
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? "none" : "lax",
    path: "/api/auth",
  });
}
