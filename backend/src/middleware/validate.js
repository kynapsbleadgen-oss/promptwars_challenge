import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/**
 * Runs after an express-validator chain. Collects any errors into a single
 * 400 ApiError with per-field details.
 */
export function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((e) => ({
    field: e.path ?? e.param,
    message: e.msg,
  }));
  return next(ApiError.badRequest("Validation failed", details));
}
