# St John AFM — Next.js + Supabase + Tailwind

A starter implementing the requested features:

- Google Auth (via Supabase OAuth)
- CRUD for Circuits, Churches, Events (role-gated)
- Events feed (latest first), detail page with "Save" and Directions
- Search churches by circuit/township; open circuit → list churches; church → list all events including past
- Realtime in-app notifications when new events are added (uses Supabase Realtime + Web Notifications API)
- RateMyDorm-inspired UI (dark cards, grid, big CTAs)
- Tailwind for styling

## 1) Create the Supabase project
1. Create a project at https://supabase.com/ and enable **Google** provider.
2. Add the SQL from `supabase/schema.sql` (SQL editor → run).
3. Create at least one `profiles` row by signing in once, then in the table editor set your `role` to `admin`.

## 2) Configure env
Copy `.env.example` → `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE=... (optional, not required for this UI)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=... (only needed if you later embed a map)
```

## 3) Install & run
```
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Notes
- **Directions**: we open Google Maps with `https://www.google.com/maps/dir/?api=1&destination=lat,lng`. Provide `lat/lng` when adding a church.
- **Push notifications**: This starter uses browser Notification permission + Supabase Realtime for in-app notices. For true Push across devices, wire OneSignal or native Web Push with a Service Worker (keep RLS and topics as-is).
- **Roles**: `profiles.role` in [`viewer`, `editor`, `admin`]. Only `editor`/`admin` can create/update/delete.
- **Saved events**: Per-user saved list is tracked in `events.is_saved_by` (array of UUIDs). Extend with a join table if you prefer.

## Roadmap ideas
- File storage for church images (Supabase Storage)
- Pagination & filters (“upcoming only”, date range)
- Public share pages and SEO metadata
