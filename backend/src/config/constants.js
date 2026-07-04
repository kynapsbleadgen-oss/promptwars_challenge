// Central place for enums and tunables shared across the backend.

export const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  TEACHER: "teacher",
  MENTOR: "mentor",
  DIRECTOR: "director",
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

// Roles that can see cross-user analytics / management surfaces.
export const ELEVATED_ROLES = Object.freeze([ROLES.ADMIN, ROLES.DIRECTOR]);

// Roles that can author and share itineraries with students.
export const EDUCATOR_ROLES = Object.freeze([ROLES.TEACHER, ROLES.MENTOR]);

export const TRIP_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
});

export const TRIP_STATUS_VALUES = Object.freeze(Object.values(TRIP_STATUS));

export const ITINERARY_VISIBILITY = Object.freeze({
  PRIVATE: "private",
  PUBLIC: "public",
  SHARED: "shared",
});

export const ITINERARY_VISIBILITY_VALUES = Object.freeze(
  Object.values(ITINERARY_VISIBILITY),
);

export const ANALYTICS_ACTIONS = Object.freeze({
  DISCOVERY: "discovery",
  SAVE: "save",
  SHARE: "share",
  VIEW: "view",
  LOGIN: "login",
  REGISTER: "register",
});

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
});

// Cookie name for the refresh token (httpOnly).
export const REFRESH_COOKIE = "atlas_refresh";
