## Financial Budget App

Personal finance, budgeting, and expense-tracking dashboard built with Next.js and Supabase.

### Local Preview

```bash
npm install
npm run dev -- --port 3000
```

Open `http://localhost:3000/`.

### Supabase Setup (Phase 2+)

- Copy `.env.local.example` to `.env.local`
- Fill in:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### GitHub + Deploy

- This app uses Next.js route handlers (`/api/...`) for future Open Banking scaffolding, which requires a server runtime.
- Recommended hosting: Vercel (connect your GitHub repo in the Vercel dashboard).

If you must host on GitHub Pages, the app must be converted to a static export (API routes won’t work there).
