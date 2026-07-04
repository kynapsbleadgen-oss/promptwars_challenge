import { ApiError } from "../utils/ApiError.js";

/**
 * Role-gate a route. Must run after requireAuth.
 *   router.get('/', requireAuth, authorize('admin', 'director'), handler)
 */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (roles.length && !roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `This action requires one of: ${roles.join(", ")}`,
        ),
      );
    }
    return next();
  };
}
