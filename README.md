# Podcast Decoded

Podcast Decoded is a Vite + React application that surfaces AI-generated summaries of long-form podcast episodes. The goal for Sprint 1 was to replace mock content with a real Supabase-backed data layer, enable routing, and make the landing page fully dynamic.

## Getting Started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000/`.

### Environment Variables

Create `.env.local` with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

These values are supplied by your Supabase project.

### Supabase CLI

Migrations live in `supabase/migrations`. Push updates with:

```bash
./bin/supabase db push
```

The most recent migration enables anonymous read access to the `episodes` table so the browser can fetch content with the anon key.

## Current Functionality

- Fully routed experience (`/`, `/browse`, `/episode/:id`, `/category/:category`, `/request`).
- Supabase-powered API layer with typed helpers under `lib/api.ts`.
- Dynamic landing page sections (recent episodes, categories, stats) with loading and error states.
- Browse page with pagination, sorting, category filter, and search query string support.
- Episode detail page with full summary, notes, resources, and related episodes.

## Future Work

- Wire `/request` form to the `requests` table with proper RLS.
- Populate "Popular This Week" and "Trending Topics" from analytics instead of static mocks.
- Add admin tools for creating/editing episodes (Sprint 3).

Happy decoding!
