# Twelvefold Institute — Web Platform (Phase 1)

Next.js (App Router) on Vercel, single repo. Marketing pages plus the
integration layer that turns the existing apps into one product:
server-side AI proxy, Postgres + Drizzle, and Clerk auth.

Built per the decisions: **A1** (Next.js/Vercel), **B1** (real backend,
apps migrate off `localStorage`), **C2** (homepage + certification).

---

## What's here

```
src/
├── middleware.ts              Clerk auth — protects /read/app, /portal, /account
├── app/
│   ├── layout.tsx             ClerkProvider + fonts
│   ├── page.tsx               Home  → components/Homepage
│   ├── certification/page.tsx → components/CertificationPage
│   ├── read/page.tsx          Host for the full PatternOS app
│   └── api/
│       ├── reading/route.ts             ★ the AI proxy (key stays server-side)
│       └── certification/apply/route.ts  application intake
├── lib/
│   ├── anthropic.ts           server-only Claude client + hardened reading path
│   ├── rateLimit.ts           per-user/IP limiter
│   └── db/{index,schema}.ts   Drizzle client + Postgres schema
└── components/
    ├── Homepage.tsx           stub (replace with Homepage-v2)
    └── CertificationPage.tsx  stub (replace with CertificationPage)
```

---

## Setup

Requires Node 20+, a Postgres database, an Anthropic key, and a Clerk app.

```bash
npm install
cp .env.example .env        # fill in every value
npm run db:push             # create the tables in your database
npm run dev                 # http://localhost:3000
```

Get credentials from: Anthropic Console (API key), any Postgres host
(Vercel Postgres, Neon, Supabase), and clerk.com (publishable + secret keys).

---

## Porting your existing components

The full `Homepage-v2.jsx` and `CertificationPage.jsx` you already have
drop straight into `src/components/`, replacing the stubs. Two edits each:

1. **Add `"use client";`** as the first line — they use React hooks.
2. **Route AI/data calls through the API**, not third-party domains:

```js
// BEFORE (fine for a local demo, unsafe on the public web):
fetch("https://api.anthropic.com/v1/messages", { ...exposes the key... })

// AFTER:
fetch("/api/reading", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ situation }),
})
// → { summary: { pattern_name, phase, micro_state,
//                likely_curriculum, active_lesson, recommended_participation } }
```

The certification ApplyPanel posts to `/api/certification/apply` with
`{ name, email, motivation }`. Both stubs already show the exact pattern.

---

## Why the proxy matters (the one non-negotiable)

Locally, Vite hides the Anthropic key. On the open web, any key in client
code is visible in the browser and gets scraped and drained fast. So every
AI call goes through `/api/reading`, which holds the key server-side, checks
auth, rate-limits, and keeps the hardened path (status handling, one retry,
JSON salvage, real error surfacing). Client code never touches the key.

---

## The localStorage → Postgres migration (B1)

The apps keep state in the browser today; that can't persist across devices
or survive a cleared cache. Each key becomes a table keyed to the signed-in
user:

| localStorage key        | becomes                          | phase |
|-------------------------|----------------------------------|-------|
| `pos10-master-history`  | `readings` (clerk_user_id set)   | 1     |
| `pos10-role`            | `profiles.role`                  | 1     |
| `pos10-clients`         | `clients`                        | 2     |
| `pos10-client-${code}`  | `client_sessions`                | 2     |
| `plc-progress` / `plc-*`| `enrollments` + `progress`       | 2     |

Phase 1 ships `profiles`, `readings`, `cert_applications`, `memberships`.
The Stripe columns on `memberships` are already there so Phase 2 billing is
purely additive — no schema rewrite.

---

## Deploy (Vercel)

Push to GitHub, import in Vercel, add the same env vars in project settings,
and connect a Postgres instance. `npm run build` is the build command. Run
`npm run db:push` (or `db:migrate` with generated SQL) against the production
database once.

---

## Next (Phase 2)

`/portal` (certification app behind auth), Stripe for the book + membership +
the $6,500 program, the `/institutions` consult flow, and the practitioner
tables (`clients`, `client_sessions`, `enrollments`).
