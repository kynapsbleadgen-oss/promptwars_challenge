import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

// 404 for any unmatched route under the API.
export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Central error handler. Normalizes Mongoose / JWT / custom errors into a
 * consistent JSON envelope: { error: { message, details? } }.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  // Mongoose validation error.
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Invalid ObjectId etc.
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  // Duplicate key (e.g. email already registered).
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || { field: "" })[0];
    message = `A record with that ${field} already exists`;
  }

  // JWT.
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Hide unexpected 500 messages/stacks in production.
  const isServerError = statusCode >= 500;
  if (isServerError && !env.isTest) {
    // eslint-disable-next-line no-console
    console.error("[error]", err);
  }
  if (isServerError && env.isProd) {
    message = "Internal server error";
    details = undefined;
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(details ? { details } : {}),
      ...(env.isProd || isServerError ? {} : { stack: err.stack }),
    },
  });
}
