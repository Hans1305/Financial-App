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

- This app includes Next.js route handlers (`/api/...`) for future Open Banking scaffolding.
- GitHub Pages is static hosting, so `/api/...` won’t work there.

#### GitHub Pages (static demo)

This repository is configured to deploy a static demo to GitHub Pages via GitHub Actions.

- URL: `https://hans1305.github.io/Financial-App/`
- Enable it in GitHub: Repo → Settings → Pages → Source: GitHub Actions
