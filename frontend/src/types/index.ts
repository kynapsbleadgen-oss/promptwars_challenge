// ─── Auth & User ──────────────────────────────────────────────────────────────

export type Role = "admin" | "user" | "teacher" | "mentor" | "director";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  bio: string;
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export interface Destination {
  name: string;
  region: string;
  culturalSignificance: string;
  bestSeason: string;
  estimatedBudget: string;
  suggestedDuration: string;
  localEtiquette: string;
  transportationTip: string;
  imageQuery: string;
}

export interface HiddenGem {
  name: string;
  category: string;
  whySpecial: string;
  localStory: string;
  bestTimeToVisit: string;
  visitingTip: string;
  difficulty: string;
  imageQuery: string;
}

export type TripStatus = "draft" | "published";

export interface Trip {
  _id: string;
  userId: string;
  title: string;
  location: string;
  interests: string[];
  duration: string;
  budget: string;
  travelStyle: string;
  intro: string;
  destinations: Destination[];
  hiddenGems: HiddenGem[];
  status: TripStatus;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Discovery ────────────────────────────────────────────────────────────────

export interface DiscoveryInput {
  location: string;
  interests: string[];
  duration: string;
  budget: string;
  travelStyle?: string;
}

export interface DiscoveryResult {
  intro: string;
  destinations: Destination[];
  hiddenGems: HiddenGem[];
  tripId: string | null;
}

// ─── Itinerary ────────────────────────────────────────────────────────────────

export type ItineraryVisibility = "private" | "public" | "shared";

export interface Itinerary {
  _id: string;
  createdBy: Pick<User, "_id" | "name" | "email">;
  title: string;
  description: string;
  category: string;
  trips: Trip[] | string[];
  sharedWith: string[];
  visibility: ItineraryVisibility;
  createdAt: string;
  updatedAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalTrips: number;
  recentDiscoveries: number;
  recentLogins: number;
  topLocations: Array<{ location: string; count: number }>;
  dailyActivity: Array<{
    _id: { date: string; action: string };
    count: number;
  }>;
}

export interface AiLog {
  _id: string;
  userId?: Pick<User, "_id" | "name" | "email">;
  kind: string;
  model: string;
  prompt: string;
  response: string;
  tokens: number;
  latencyMs: number;
  success: boolean;
  error: string;
  createdAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// ─── API Errors ───────────────────────────────────────────────────────────────

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    message: string;
    details?: ApiErrorDetail[];
  };
}
