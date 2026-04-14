# FirstStep

## Supabase Setup

## Backend env setup

Copy `backend/.env.example` to `backend/.env` and fill in:

```bash
PROJECT_NAME="FirstStep API"
API_PREFIX="/api"
ALLOWED_ORIGINS="http://localhost:5173"
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=your-supabase-service-role-key
BROWSER_USE_API_KEY=your-browser-use-api-key
```

Browser Use follows the current official docs and reads `BROWSER_USE_API_KEY`. Create that key at `https://cloud.browser-use.com/settings`.

### Required env vars

Copy `frontend/.env.example` to `frontend/.env.local` and fill in:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:5173/auth
VITE_API_URL=http://localhost:8000/api
```

### Migrations

Apply the Supabase SQL files in this order:

1. `supabase/migrations/202604122020_profiles.sql`
2. `supabase/migrations/202604122140_events.sql`
3. `supabase/migrations/202604122150_seed_events.sql`
4. `supabase/migrations/202604122220_progress_tables.sql`
5. `supabase/migrations/202604122300_rsvp_state_machine.sql`

These migrations create:

- `profiles`
- `events`
- `event_rsvps`
- `saved_events`
- `dismissed_events`
- `user_progress`
- the profile auto-create trigger on `auth.users`
- the `apply_event_rsvp_status` RPC used by the client RSVP flow

### Seeding events

The current event seed data lives in:

- `supabase/migrations/202604122150_seed_events.sql`
- `frontend/src/data/mockData.ts`

The frontend mock event IDs were updated to stable UUIDs so the seeded rows, route params, and progress tables all use the same IDs.

### Auth redirect setup

In Supabase Auth, add these redirect URLs:

- `http://localhost:5173/auth`
- your deployed frontend auth URL, for example `https://your-app.example.com/auth`

Google OAuth uses `signInWithOAuth` and sends users back through the existing `/auth` page, which then routes them to onboarding or dashboard based on the current flow.

### Google OAuth provider setup

1. In Google Cloud Console, create an OAuth client for your web app.
2. Add your Supabase callback URL from the Supabase Google provider page as an authorized redirect URI.
3. In Supabase, open `Authentication -> Providers -> Google`.
4. Enable Google and paste in the Google client ID and client secret.
5. Confirm your frontend redirect URLs are also listed in Supabase Auth settings.

### Local development

1. Run the SQL migrations in Supabase.
2. Create `backend/.env` from `backend/.env.example`.
3. Create `frontend/.env.local` from `frontend/.env.example`.
4. Install backend dependencies with `pip install -r backend/requirements.txt` if needed.
5. Install frontend dependencies with `npm install` inside `frontend/` if needed.
6. Start the backend from `backend/` with `uvicorn app.main:app --reload`.
7. Start the frontend with `npm run dev` inside `frontend/`.
8. Sign up with email/password or Google and complete onboarding.

### Browser Use API

Once `BROWSER_USE_API_KEY` is set, the backend exposes:

```bash
POST /api/browser-use/run
Content-Type: application/json

{
  "task": "Go to example.com and tell me the page title"
}
```

Build verification used during this implementation:

```bash
cd frontend
npm run build
```

### Auth implementation requirement block

```text
You are building the authentication layer for a web app.

Requirements:
Email/password auth
Google OAuth 
Session handling + protected routes

Include:
Auth provider setup (e.g., Supabase/Auth0/Firebase)
Basic signup / login / logout UI
Logic for redirecting unauthenticated users

Output:
Pages: Sign Up, Sign In, Dashboard (protected)
Code with placeholder secrets / env values
```

### Assumptions

- Supabase email confirmation may be enabled. If it is, email signup creates the account and prompts the user to confirm email before continuing onboarding.
- `events.id` uses UUIDs to match the recommended progress-table foreign keys.
- An `rsvp_count` column was added to `events` to preserve the current attendee-count UI without redesigning the cards or detail page.
- The current client still expects the existing FastAPI `VITE_API_URL`, so that env var remains documented even though the event and auth flow now use Supabase directly.

## ArcGIS Map Notes

The map flow now uses the ArcGIS Maps SDK for JavaScript and loads the UCSD campus WebMap by item id `d8cb938328994b4491305845130c5346`.

- Map component: `frontend/src/components/map/UCSDCampusMap.tsx`
- Map lifecycle hook: `frontend/src/hooks/useArcGISWebMap.ts`
- ArcGIS constants/types: `frontend/src/lib/arcgis.ts`
- Event location resolver: `frontend/src/lib/locationResolver.ts`

How it works:

- The map hook loads the WebMap at runtime and inspects the operational layers after `loadAll()`.
- During development, it logs the loaded ArcGIS layer titles so the app can adapt if UCSD changes the WebMap internals.
- Event location resolution follows a fallback chain:
  1. feature-layer match from loaded WebMap layers when available
  2. ArcGIS geocode/search against UCSD campus place text
  3. local UCSD alias dictionary for common student-facing places
  4. fallback to campus center when an exact match is not available

The current UCSD WebMap exposes a `List of Resources` feature layer with `Resource` and `Location` fields, so the app uses that layer opportunistically and relies on the alias dictionary plus ArcGIS search for common event venues such as Price Center, Geisel, RIMAC, Center Hall, and Sixth College.

To expand the alias dictionary later, update `LOCATION_ALIASES` in `frontend/src/lib/locationResolver.ts`.
