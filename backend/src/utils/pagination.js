import { PAGINATION } from "../config/constants.js";

/**
 * Parse and clamp pagination + sort query params.
 * Returns { page, limit, skip, sort } ready for Mongoose.
 */
export function parsePagination(query = {}) {
  let page = Number.parseInt(query.page, 10);
  let limit = Number.parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = PAGINATION.DEFAULT_PAGE;
  if (!Number.isFinite(limit) || limit < 1) limit = PAGINATION.DEFAULT_LIMIT;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const skip = (page - 1) * limit;

  // sort=field or sort=-field (descending). Defaults to newest first.
  let sort = { createdAt: -1 };
  if (typeof query.sort === "string" && query.sort.trim()) {
    const raw = query.sort.trim();
    const desc = raw.startsWith("-");
    const field = desc ? raw.slice(1) : raw;
    // Whitelist sortable fields to avoid arbitrary sorts.
    const allowed = new Set(["createdAt", "updatedAt", "title", "status"]);
    if (allowed.has(field)) sort = { [field]: desc ? -1 : 1 };
  }

  return { page, limit, skip, sort };
}

/**
 * Build a standard paginated envelope.
 */
export function paginatedResponse({ items, total, page, limit }) {
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
