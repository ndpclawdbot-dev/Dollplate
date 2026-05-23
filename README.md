# DollPlate — Family Meal Planning

AI-powered weekly dinner planning for your household. Built with Next.js 14, Supabase, and Claude.

---

## Required Replit Secrets

Set these in the **Secrets** tab (not a `.env` file) in your Replit project:

| Secret | Where to get it |
|--------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → your project → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → your project → Settings → API → `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → your project → Settings → API → `service_role` secret key |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `TWILIO_ACCOUNT_SID` | [console.twilio.com](https://console.twilio.com) → Account Info (Phase 5) |
| `TWILIO_AUTH_TOKEN` | Twilio console → Account Info (Phase 5) |
| `TWILIO_PHONE_NUMBER` | Twilio console → Phone Numbers → in E.164 format e.g. `+15550001234` (Phase 5) |
| `GOOGLE_CLIENT_ID` | [console.cloud.google.com](https://console.cloud.google.com) → APIs → Credentials → OAuth 2.0 Client ID (Phase 5) |
| `GOOGLE_CLIENT_SECRET` | Same Google Cloud credential (Phase 5) |
| `GOOGLE_REDIRECT_URI` | Your Replit URL + `/api/auth/google/callback` e.g. `https://dollplate.yourname.repl.co/api/auth/google/callback` (Phase 5) |
| `EDAMAM_APP_ID` | [developer.edamam.com](https://developer.edamam.com) → Applications → Nutrition Analysis (Phase 4) |
| `EDAMAM_APP_KEY` | Same Edamam application (Phase 4) |
| `REMINDER_TIMEZONE` | IANA timezone e.g. `America/New_York` (Phase 5, defaults to `America/New_York`) |

---

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase project
3. Paste the contents of `supabase/schema.sql` and run it — this creates all tables at once
4. Copy your project URL and anon key into Replit Secrets

---

## Running on Replit

1. Fork or import this repo into Replit
2. Add all required Secrets (see table above — at minimum the four Supabase + Anthropic keys)
3. The run command is `npm start` (already configured in `.replit`)
4. Enable **Always On** in your Replit project settings to keep the cron job running

> **Production build note:** Replit's deploy button runs `npm run build && npm start`. The build step requires your Supabase secrets to be set. In development (NODE_ENV unset), the server starts directly without a build step.

---

## Local Development

```bash
# Copy .env.example to .env.local and fill in your keys
cp .env.example .env.local

# Install dependencies
npm install

# Run dev server (uses custom server.js, not next dev directly)
npm run dev
```

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API routes + custom Node.js server (`server.js`)
- **Database:** Supabase (Postgres + Realtime)
- **Auth:** Supabase Auth (email/password)
- **AI:** Anthropic Claude (`claude-sonnet-4-20250514`)
- **SMS:** Twilio (Phase 5)
- **Calendar:** Google Calendar OAuth2 (Phase 5)
- **Nutrition:** Edamam API (Phase 4)
- **Scheduler:** node-cron inside `server.js` (not Vercel Cron or Edge Functions)

---

## Build Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | Complete | Project scaffold, Supabase auth, household + member profiles |
| 2 | Next | Weekly setup wizard + AI meal plan generation |
| 3 | Planned | Grocery list + realtime sync + meal tracking |
| 4 | Planned | Nutrition data + personalization engine + history page |
| 5 | Planned | Twilio SMS reminders + Google Calendar sync |
| 6 | Planned | Polish, error handling, mobile audit |
