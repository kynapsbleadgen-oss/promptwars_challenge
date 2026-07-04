# Wayfare — AI Cultural Travel Discovery

> **Escape the tourist trail.** Wayfare uses Google Gemini to synthesise centuries
> of local culture, heritage, and hidden history into personalised travel itineraries.

---

## Table of Contents

1. [Project overview](#project-overview)
2. [Tech stack](#tech-stack)
3. [Repository layout](#repository-layout)
4. [Prerequisites](#prerequisites)
5. [Environment variables](#environment-variables)
6. [Local development](#local-development)
7. [Seed data](#seed-data)
8. [Key concepts](#key-concepts)
9. [API reference](#api-reference)
10. [Roles & permissions](#roles--permissions)

---

## Project overview

Wayfare is a full-stack web application split into two packages:

| Package | Runtime | Purpose |
|---------|---------|---------|
| `backend/` | Node 20 · Express · MongoDB | REST API, JWT auth, AI proxy, analytics |
| `frontend/` | React 19 · TanStack Router/Query · Tailwind CSS v4 | SPA with SSR shell via TanStack Start |

Authentication uses **httpOnly refresh-token cookies** + short-lived **Bearer access tokens** stored only in memory. The Axios client in `frontend/src/api/client.ts` silently refreshes tokens on every 401 and queues concurrent requests.

---

## Tech stack

### Backend
- **Express 4** — REST API server
- **MongoDB / Mongoose 8** — document database
- **JSON Web Tokens** — access (15 min) + refresh (7 days) tokens
- **Google Gemini** (`gemini-2.0-flash`) — AI destination discovery
- **Helmet · CORS · express-rate-limit · HPP** — security hardening

### Frontend
- **React 19** with **TanStack Router** (file-based routing)
- **TanStack Query** — server-state caching & mutation management
- **Axios** — API client with automatic token refresh
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** (Radix primitives) — accessible component library
- **Sonner** — toast notifications
- **Lucide React** — icon set

---

## Repository layout

```
atlas-ai-main/
├── backend/
│   ├── src/
│   │   ├── config/         # env, db, constants
│   │   ├── controllers/    # route handlers (auth, trips, AI, users, analytics)
│   │   ├── middleware/     # auth, RBAC, validation, error handler, rate limiter
│   │   ├── models/         # Mongoose schemas (User, Trip, Itinerary, AiLog, Analytics)
│   │   ├── routes/         # Express routers
│   │   └── utils/          # ApiError, asyncHandler, pagination, tokens, Zod schemas
│   ├── seed.js             # Sample data seeder
│   └── .env.example        # Backend env template
│
└── frontend/
    └── src/
        ├── api/            # Typed Axios wrappers (authApi, tripApi, discoveryApi, …)
        ├── components/
        │   ├── auth/       # ProtectedRoute
        │   ├── home/       # Hero, DestinationCard, Results, Skeletons, …
        │   ├── layout/     # AppLayout, Header, Sidebar, Nav, Footer
        │   ├── shared/     # ErrorBoundary, Field, LoadingSkeleton, …
        │   └── ui/         # shadcn/ui primitives
        ├── contexts/       # AuthContext (useAuth) + ThemeContext (useTheme)
        ├── routes/         # File-based pages (__root, index, login, discover, …)
        ├── types/          # Shared TypeScript interfaces
        └── lib/            # utils, constants, image helpers
```

---

## Prerequisites

| Tool | Minimum version | Notes |
|------|----------------|-------|
| Node.js | 20 LTS | Use [nvm](https://github.com/nvm-sh/nvm) |
| npm | 10+ | Included with Node 20 |
| MongoDB | 7+ | Local install **or** free [Atlas](https://cloud.mongodb.com) cluster |
| Google Gemini API key | — | Free tier at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

## Environment variables

### Backend — `backend/.env`

Copy `backend/.env.example` → `backend/.env` and fill in the two **REQUIRED** secrets.
The server calls `process.exit(1)` at boot if either is missing.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | | `development` | `development` \| `production` \| `test` |
| `PORT` | | `5000` | HTTP port |
| `MONGODB_URI` | **yes** | — | MongoDB connection string |
| `JWT_SECRET` | **yes** | — | Access-token signing secret (use a long random string) |
| `JWT_EXPIRE` | | `15m` | Access-token TTL |
| `JWT_REFRESH_SECRET` | **yes** | — | Refresh-token signing secret (different from JWT_SECRET) |
| `JWT_REFRESH_EXPIRE` | | `7d` | Refresh-token TTL |
| `GOOGLE_GEMINI_API_KEY` | soft* | — | Gemini API key — AI endpoints return 503 without it |
| `GEMINI_MODEL` | | `gemini-2.0-flash` | Gemini model ID |
| `CORS_ORIGIN` | | `http://localhost:5173` | Frontend origin for credentialed requests |
| `RATE_LIMIT_WINDOW_MS` | | `900000` | Rate-limit window in ms (15 min) |
| `RATE_LIMIT_MAX` | | `100` | Max requests per window (general) |
| `AI_RATE_LIMIT_MAX` | | `20` | Max requests per window (AI endpoints) |
| `AUTH_RATE_LIMIT_MAX` | | `20` | Max requests per window (auth endpoints) |
| `COOKIE_SECURE` | | `false` | Set `true` only when serving over HTTPS |

> *Soft required: the server boots without it but logs a warning and AI routes return 503.

### Frontend — `frontend/.env`

Copy `frontend/.env.example` → `frontend/.env`.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL (no trailing slash) |

---

## Local development

```bash
# 1. Clone the repo
git clone <repo-url>
cd atlas-ai-main

# ── Backend ──────────────────────────────────────────────────
cd backend
cp .env.example .env          # fill in MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
                              # optionally add GOOGLE_GEMINI_API_KEY
npm install
npm run dev                   # starts on http://localhost:5000 with --watch

# ── Frontend (separate terminal) ─────────────────────────────
cd ../frontend
cp .env.example .env          # VITE_API_URL defaults to http://localhost:5000/api
npm install
npm run dev                   # starts on http://localhost:5173
```

Open **http://localhost:5173**. Register an account or seed demo data (see below).

---

## Seed data

The seeder creates demo users, trips, and itineraries so you can explore the app
without generating real AI responses:

```bash
cd backend
npm run seed
```

**Seed accounts** (password: `password123` for all):

| Email | Role |
|-------|------|
| `admin@wayfare.dev` | admin |
| `director@wayfare.dev` | director |
| `teacher@wayfare.dev` | teacher |
| `mentor@wayfare.dev` | mentor |
| `user@wayfare.dev` | user |

---

## Key concepts

### Token lifecycle
1. **Login / Register** → backend sets an httpOnly `refreshToken` cookie and returns an `accessToken` in the JSON body.
2. The frontend stores the access token **only in memory** (`api/client.ts`). It is never written to `localStorage` or a cookie.
3. On page reload, `AuthContext` calls `POST /api/auth/refresh` using the cookie to silently restore the session.
4. The Axios interceptor in `api/client.ts` automatically retries any 401 response after refreshing — concurrent requests are queued so only one refresh is issued.

### Contexts
| Context | Provider | Hook | Purpose |
|---------|----------|------|---------|
| `AuthContext` | `contexts/AuthContext.tsx` | `useAuth()` | Session state, login, logout, role checks |
| `ThemeContext` | `contexts/ThemeContext.tsx` | `useTheme()` | Light / dark mode, persisted to `localStorage` |

Both providers live in `routes/__root.tsx` and wrap the entire application.

### Route protection
Wrap any page component with `<ProtectedRoute>` to require authentication, or
pass `roles={["admin"]}` to restrict by role:

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function AdminPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      {/* …page content… */}
    </ProtectedRoute>
  );
}
```

Unauthenticated users are redirected to `/login`; authenticated users without the
required role are redirected to `/dashboard`.

---

## API reference

All routes are prefixed with `/api`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | — | Create account, returns `{ user, accessToken }` |
| `POST` | `/auth/login` | — | Login, returns `{ user, accessToken }` |
| `POST` | `/auth/logout` | cookie | Clear refresh-token cookie |
| `POST` | `/auth/refresh` | cookie | Issue new access token |
| `GET` | `/auth/me` | Bearer | Return current user |
| `GET` | `/trips` | Bearer | Paginated list of the caller's trips |
| `POST` | `/trips` | Bearer | Create a trip |
| `GET` | `/trips/:id` | Bearer | Single trip |
| `PUT` | `/trips/:id` | Bearer | Update trip |
| `DELETE` | `/trips/:id` | Bearer | Delete trip |
| `POST` | `/discover` | — | AI discovery (returns destinations + hidden gems) |
| `GET` | `/users` | admin | List all users |
| `PUT` | `/users/:id` | Bearer | Update user profile |
| `GET` | `/analytics/dashboard` | admin/director | Aggregate stats |
| `GET` | `/ai/logs` | admin | AI call logs |

---

## Roles & permissions

| Role | Access |
|------|--------|
| `user` | Own trips, profile, discovery |
| `teacher` | As user + own itineraries |
| `mentor` | As teacher |
| `director` | As mentor + team overview, reports |
| `admin` | Everything + user management, analytics, AI logs |

Role is enforced server-side via the `authorize` middleware and reflected
client-side in `Sidebar.tsx` (which shows/hides nav items by role).
