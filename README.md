# FirstStep

FirstStep is a web application designed to help students discover and participate in campus events and student organizations. The platform provides personalized event recommendations, progress tracking, and a searchable directory of student organizations to encourage community engagement and help students make meaningful connections on campus.

## Features

- **Event Discovery**: Browse and search campus events with smart recommendations based on event type and complexity level
- **RSVP & Progress Tracking**: Track attendance, save events, explore the campus map, and monitor your engagement
- **Student Organization Directory**: View detailed information about student clubs and organizations
- **Smart Recommendations**: Events are tagged with confidence indicators (Beginner-Friendly, Low-Pressure, etc.) to help new students feel confident attending
- **Authentication**: Email/password and Google OAuth integration
- **Campus Map Integration**: Interactive map showing event locations across campus
- **Responsive Design**: Mobile-friendly interface built with React and TypeScript

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context + React Query
- **UI Framework**: Tailwind CSS with Radix UI components
- **Form Handling**: React Hook Form with Zod validation
- **API Client**: Supabase JS SDK
- **Routing**: React Router v7

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database Client**: Supabase (PostgRSQL)
- **Authentication**: Supabase Auth
- **Browser Automation**: Browser Use SDK
- **Configuration Management**: Pydantic Settings

### Infrastructure
- **Database**: Supabase (managed PostgreSQL + Auth)
- **Browser Automation API**: Browser Use (https://cloud.browser-use.com)

## Project Structure

```
FirstStep/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py         # FastAPI app initialization
│   │   ├── api/            # Route handlers
│   │   ├── core/           # Configuration
│   │   ├── db/             # Database connections
│   │   ├── models/         # Data models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── scripts/            # Import/seed scripts
│   └── requirements.txt
│
├── frontend/               # React + TypeScript application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API helpers
│   │   ├── contexts/       # React Context providers
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
│
└── supabase/              # Database migrations
    └── migrations/        # SQL setup files
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- Supabase project (free tier works for development)
- Google OAuth credentials (optional, for Google sign-in)
- Browser Use API key (optional, for browser automation features)

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env`**:
   ```env
   PROJECT_NAME="FirstStep API"
   API_PREFIX="/api"
   ALLOWED_ORIGINS="http://localhost:5173"
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SECRET_KEY=your-supabase-service-role-key
   BROWSER_USE_API_KEY=your-browser-use-api-key  # Optional
   ```

   > **Note**: Get `BROWSER_USE_API_KEY` from https://cloud.browser-use.com/settings

4. **Start the development server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   Backend will run at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure `.env.local`**:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:5173/auth
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`

### Database Setup

1. **Create a Supabase project** at https://supabase.com

2. **Apply migrations in order** using the Supabase SQL Editor:
   - `supabase/migrations/202604122020_profiles.sql`
   - `supabase/migrations/202604122140_events.sql`
   - `supabase/migrations/202604122150_seed_events.sql`
   - `supabase/migrations/202604122220_progress_tables.sql`
   - `supabase/migrations/202604122300_rsvp_state_machine.sql`
   - `supabase/migrations/202604130230_clubs.sql`
   - `supabase/migrations/202604130235_seed_clubs.sql`

   These migrations create:
   - `profiles` table with auto-create trigger
   - `events`, `event_rsvps`, `saved_events`, `dismissed_events` tables
   - `user_progress` table for tracking user engagement
   - `apply_event_rsvp_status` RPC for state machine logic
   - `clubs` table and seed data

### Authentication Setup

#### Email/Password
No additional setup required. Uses Supabase's built-in email authentication.

#### Google OAuth

1. **Create OAuth credentials** in Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Create a new project
   - Enable Google+ API
   - Create an OAuth 2.0 credential (Web application)
   - Add authorized redirect URIs

2. **Configure in Supabase**:
   - Open your Supabase project → Authentication → Providers
   - Enable Google provider
   - Paste Google Client ID and Client Secret
   - Note the callback URL (you'll add it to Google Console)

3. **Configure auth redirects** in Supabase Auth settings:
   - `http://localhost:5173/auth` (development)
   - Your production frontend URL (e.g., `https://your-app.example.com/auth`)

## API Endpoints

### Events
- `GET /api/events` - List all events with recommendations
- `GET /api/events/{id}` - Get event details
- `POST /api/events/{id}/rsvp` - RSVP to an event

### Student Organizations
- `GET /api/student-orgs` - List all organizations
- `GET /api/student-orgs/{id}` - Get organization details

### Browser Automation (Optional)
- `POST /api/browser-use/run` - Execute a browser task

Example:
```bash
curl -X POST http://localhost:8000/api/browser-use/run \
  -H "Content-Type: application/json" \
  -d '{"task": "Navigate to example.com and retrieve the page title"}'
```

### Health Check
- `GET /health` - API health status

## Development

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend
```bash
cd backend

# Development with auto-reload
uvicorn app.main:app --reload

# View API documentation
# Open http://localhost:8000/docs (Swagger UI)
# Open http://localhost:8000/redoc (ReDoc)
```

## Event Data

Event seed data is stored in two locations for consistency:
- **Database**: `supabase/migrations/202604122150_seed_events.sql`
- **Frontend Mock Data**: `frontend/src/data/mockData.ts`

Both use stable UUIDs so event IDs match across the application, allowing route parameters and progress tracking to work correctly.

## License

This project is licensed under the terms specified in the LICENSE file.

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
