# Twelvefold Institute — Website Architecture

**Status:** Live in production at `twelvefold.institute`
**Last updated:** June 13, 2026
**Owner:** Emanuel Shidali (founder)
**Repo:** `github.com/emmyshid/twelvefold-institute`
**Deployment:** Vercel (auto-deploys on push to `main`)

---

## 1. Overview

A Next.js 15 web platform that serves as the institutional home, marketing surface, and operational backbone for Twelvefold Institute. It hosts:

- **Public marketing pages** (homepage, framework explainer, book, certification, institutions, about, method, initiation)
- **The practitioner-only PatternOS reading workspace** (Personal + Master modes)
- **The practitioner learning portal** (6-module certification curriculum)
- **Operational systems** (applications, payments, emails, admin dashboard)

### The three jobs of the website *(from the canonical Solution Architecture — see § 14)*

Every page on the site is in service of one or more of these. If a page doesn't clearly serve one, it doesn't belong:

1. **Establish authority** — make a skeptical, intelligent visitor take Pattern Literacy seriously in 30 seconds
2. **Route by intent** — send each visitor to the destination that matches who they are
3. **Convert to revenue** — across all five revenue streams, without commodifying the work

### Five audiences × five revenue streams

The planned audience-to-stream-to-destination map. This is the spine of the information architecture:

| Visitor archetype | What they want | Revenue stream | Destination |
|---|---|---|---|
| **The Curious Reader** | "Why does this keep happening to me?" | Books / Media | `/book` → `/#try-it` |
| **The Seeker** | A reading, ongoing practice | Community Membership | `/#try-it` → `/initiation` → `/rhythms` → (`/community` — pending) |
| **The Practitioner-in-training** | A credential, a method | Certification ($6,500) | `/certification` → `/portal` |
| **The Institution** | Org diagnostics, licensing | Institutional Licensing ($50K–$500K) | `/institutions` → consult flow |
| **The Researcher / Press** | Credibility, the thinking | Research & Thought Leadership | `/method` → `/research` |

### Three access tiers

Cross-cutting the five audiences, three access tiers govern what the platform actually lets each person do:

| Audience | Access | Primary surface |
|---|---|---|
| **Anonymous visitors** | Marketing + free try-it reading | `/`, `/pattern-literacy`, `/book`, `/initiation`, `/method` |
| **Signed-in members (no cert)** | All marketing + connect-with-practitioner | All public + `/account` |
| **Certified practitioners** | Full reading workspace + learning portal | `/read/app`, `/portal` |

---

## 2. Brand & Positioning

### Brand language system (3-layer)

| Layer | Phrase | Function | Where it appears |
|---|---|---|---|
| **Catchphrase** | *Read the Pattern. Align with the Order.* | Short, memorable hook | Homepage hero eyebrow, `/institutions` eyebrow, `/certification` eyebrow, `/initiation` header (every segment), OG image as primary visual, Twitter card title |
| **Slogan** | *Pattern Literacy for Life, Leadership, and Transformation.* | Formal positioning — names the three audiences | Homepage footer, `/read` footer, `/method` footer, `/about` hero subtitle, OG image subtitle, search engine meta description, **every email signature** |
| **Hero (existing)** | *Something invisible is running your life. You can learn to read it.* | Emotional pull, hooks curiosity | Homepage H1 (unchanged) |

### Disclaimer

Appears site-wide on risk-exposing surfaces:

> *Pattern Literacy is an educational and reflective framework. It is not therapy, medical care, diagnosis, financial advice, or a substitute for professional support.*

Live at: homepage try-it, homepage footer, `/read` footer, `/method` footer.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.19 (App Router) |
| Language | TypeScript (with JSX where appropriate — portal, initiation) |
| Hosting | Vercel (production) |
| Database | Supabase Postgres (pooler) |
| ORM | Drizzle |
| Auth | Clerk (production, custom domain `clerk.twelvefold.institute`) |
| Payments | Stripe |
| Email | Resend (verified domain `twelvefold.institute`) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Fonts | Crimson Text (serif), Space Mono (mono) — via Google Fonts |

### Design tokens (locked)

```
Background       #06060F
Text             #EDE9F5
Text dim         rgba(237,233,245,0.65)
Text muted       rgba(237,233,245,0.42)
Border           rgba(255,255,255,0.08)
Accent (purple)  #A78BFA
Accent deep      #7C3AED
Gold             #FBBF24
Card background  rgba(255,255,255,0.025)
Aurora blob 1    radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)
Aurora blob 2    radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)
```

---

## 4. Domains & Hosting

- **Primary**: `twelvefold.institute` (live)
- **Redirect**: `twelvefoldinstitute.com` → `twelvefold.institute`
- **Auth subdomain**: `clerk.twelvefold.institute` (Clerk Frontend API)
- **Account Portal**: `accounts.twelvefold.institute` (Clerk hosted sign-in for phone users)
- **All 5 Clerk CNAMEs**: verified
- **SSL**: managed by Vercel
- **Email sender**: `Twelvefold Institute <hello@twelvefold.institute>` (verified in Resend)

---

## 5. Application Routes

### Planned sitemap vs. built sitemap

The canonical Solution Architecture (see § 14) specified a hierarchical sitemap with deliberate parent/child routes. The current build mostly aligns but with three intentional restructures:

```
PLANNED                                BUILT
───────────────────────────────────────────────────────────────────
/                                      /                            ✅ aligned
/pattern-literacy                      /pattern-literacy            ✅ aligned
  /the-framework                       (merged into parent)         🔀 consolidated
  /the-traditions                      /method (§04–05) + carousel  🔀 reinterpreted
/read                                  /read                        ✅ aligned
  /read/app                            /read/app                    ✅ aligned
/book                                  /book                        ✅ aligned
/practice                              (dropped — flattened)        🔀 restructured
  /rhythms                             /rhythms (top-level)         ✅ aligned (restructured)
  /community                           (not built)                  ⏳ pending
/certification                         /certification               ✅ aligned
  /portal (nested under cert)          /portal (top-level)          🔀 restructured
/institutions                          /institutions                ✅ aligned
  /inquire                             (form inline on parent)      🔀 consolidated
/research                              /research + /research/[slug]  ✅ aligned
/about                                 /about                       ✅ aligned
/account                               /account                     ✅ aligned

                                       /method ← NEW                ✨ added beyond plan
                                       /initiation ← NEW            ✨ added beyond plan
                                       /admin ← NEW                 ✨ added beyond plan
                                       /sign-in, /sign-up ← NEW     ✨ added beyond plan
                                       /opengraph-image ← NEW       ✨ added beyond plan
                                       /api/* (15 endpoints) ← NEW  ✨ added beyond plan
```

**Three deliberate restructures:**

1. **`/the-framework` and `/the-traditions` → consolidated into `/pattern-literacy` + `/method`** — A dedicated `/method` page (Sources & Method) was added as a Tier 1 trust-building move, absorbing the planned "traditions" content with stronger epistemic accounting (inheritance, interpretation, contribution, agreement, difference, limits). The sub-routes weren't needed.

2. **`/certification/portal` → `/portal` (top-level)** — Promoted out of the nested path because the portal is the practitioner's day-to-day workspace, not a sub-experience of the marketing page. A practitioner bookmarks `/portal`, not `/certification/portal`. Same gating logic; cleaner mental model.

3. **`/institutions/inquire` → form inline on `/institutions`** — A separate `/inquire` page would create unnecessary friction for a B2B audience already on the institutions page. The consult form lives directly below the offer; one page, one decision.

### Public marketing pages (no auth)

| Route | Purpose | Server/Client |
|---|---|---|
| `/` | Homepage — hero, How It Works, Recognition carousel, Convergence carousel, Shift comparison, Try-it (anonymous brief reading), product doors, footer | Client (React, full UI) |
| `/pattern-literacy` | Framework long-form explainer | Server |
| `/book` | *Why This Keeps Happening* marketing page + launch list signup | Server + client form |
| `/initiation` | 10-segment guided initiation experience (Web Speech TTS narration, persistent progress, completion email) | Client |
| `/certification` | Certification program marketing + application form | Server + client form |
| `/institutions` | Institutional offering + consultation request form | Server + client form |
| `/about` | The institute — independent positioning, founding story | Server |
| `/method` | **Sources & Method** — 6-section epistemic accounting (inheritance, interpretation, contribution, agreement, difference, limits) | Server |
| `/research` | **Research & essays** — the authority engine. List page + per-essay static detail pages (`/research/[slug]`). 4 seed essays, pre-rendered via `generateStaticParams`, each with own metadata | Server (SSG) |
| `/read` | **Connect-with-practitioner hub** — explainer + sample full reading mockup + two pathway cards | Server (redirects cert-paid to `/read/app`) |

### Authentication routes

| Route | Purpose | Notes |
|---|---|---|
| `/sign-in/[[...sign-in]]` | Sign in entry | Server-side UA detection: phone-class browsers (iPhone OR Android+Mobile) redirected to Clerk Account Portal with absolute return URL; tablet/desktop see themed embedded SignIn |
| `/sign-up/[[...sign-up]]` | Sign up entry | Same device-aware pattern |
| Account Portal | `accounts.twelvefold.institute/sign-in` | Clerk-hosted top-level auth flow for phones |

### Authenticated member routes

| Route | Purpose | Access |
|---|---|---|
| `/account` | User account / Clerk UserProfile | Any signed-in user |
| `/rhythms` | **Intelligent Rhythms app** — 11 Life Domain Rhythms + 10 Planetary Archetypes, tracked rhythms + saved reflections (localStorage persistence). Member benefit, not a practitioner credential. | Signed in (any account, **no payment**) |

### Practitioner-only routes (cert-paid)

| Route | Purpose | Gate |
|---|---|---|
| `/read/app` | **PatternOS reading workspace** — Personal mode + Master mode (clients CRM, session codes, per-client history, email-to-client). Honors `?mode=master` URL param. | Server gate: signed in + `payments.product='certification' AND status='succeeded'` (matched by `clerk_user_id` OR `email`) |
| `/portal` | **Practitioner learning portal** — 6-module curriculum, lesson view, exercise submissions, AI organizational diagnostic, practitioner tools, dashboard, sidebar nav with "Client Readings" entry. Mobile-responsive with hamburger drawer < 960px. | Same server gate as `/read/app` |

### Admin route

| Route | Purpose | Gate |
|---|---|---|
| `/admin` | Admin dashboard — review applications, consults, payments, manage status (triggers status-change emails) | Email in `ADMIN_EMAILS` env var |

---

## 6. Database Schema

Hosted on Supabase Postgres, accessed via Drizzle ORM. All migrations applied through `npm run db:push`.

| Table | Purpose | Key columns |
|---|---|---|
| **profiles** | Clerk user ↔ welcome email idempotency | `id` (UUID PK), `clerk_user_id` (unique), `email`, `display_name`, `role`, `welcomed_at`, `created_at` |
| **certification_applications** | Practitioner cert applications | `id`, `clerk_user_id`, `email`, `name`, `background`, `motivation`, `status` (`new`, `reviewing`, `admitted`, `declined`), `created_at`, `updated_at` |
| **consultation_requests** | Institutional consult inquiries | `id`, `name`, `email`, `organization`, `role`, `context`, `status` (`new`, `qualified`, `scheduled`, `closed`), `created_at`, `updated_at` |
| **payments** | Stripe transactions (source of truth for cert-paid status) | `id`, `clerk_user_id` (nullable), `email`, `product`, `amount`, `currency`, `status`, `stripe_session_id`, `stripe_payment_intent_id`, `created_at` |
| **readings** | Saved pattern readings | `id`, `clerk_user_id`, `client_id` (nullable, for Master mode), `situation`, `depth`, `raw` (jsonb — all 6 v10 layers), `created_at` |
| **clients** | Practitioner-owned client CRM | `id`, `practitioner_user_id`, `name`, `email`, `notes`, `created_at` |
| **book_subscribers** | Book launch list | `id`, `email` (unique), `created_at` |
| **initiation_completions** | Audit log of initiation experience completions | `id`, `email`, `clerk_user_id` (nullable), `completed_at` |

---

## 7. API Endpoints

All API routes live under `src/app/api/`. Runtime is Node.js unless noted.

### Public

| Endpoint | Method | Purpose | Auth | Rate limit |
|---|---|---|---|---|
| `/api/reading` | POST | Pattern reading. `depth=summary` is public (homepage try-it). `depth=full` is **certified-only** (defense in depth). | None for summary; cert-paid for full | Per-IP/user |
| `/api/book/subscribe` | POST | Add email to book launch list. Sends confirmation. | None | Per-IP |
| `/api/certification/apply` | POST | Submit certification application. Sends ack + admin notification. | None (form is public) | Per-IP |
| `/api/institutions/consult` | POST | Submit institutional consultation request. | None | Per-IP |
| `/api/initiation/complete` | POST | Mark initiation experience complete. | None (anonymous OK) | Per-IP |
| `/opengraph-image` | GET | Edge-runtime generated 1200×630 OG image (catchphrase + slogan + branded gradient). Auto-discovered via file convention. | None | n/a |

### Authenticated

| Endpoint | Method | Purpose | Auth |
|---|---|---|---|
| `/api/me/cert-status` | GET | Returns `{isCertified: bool}` based on payments table match by user-id OR email. | Signed in (anonymous returns `false` without 401) |
| `/api/readings` | GET, POST | List/save user readings | Signed in |
| `/api/readings/[id]/send` | POST | Email a saved reading to a client (uses Resend with v10 layered template) | Signed in (owner of reading) |
| `/api/clients` | GET, POST | Master-mode client list/create | Signed in (cert-paid implicit via UI gate) |
| `/api/clients/[id]` | GET, PATCH, DELETE | Individual client management | Signed in + ownership |
| `/api/org-diagnostic` | POST | Server-side proxy for the portal's organizational diagnostic engine. Holds Anthropic key safely, returns parsed JSON. | Signed in (any) — portal page enforces cert-paid before user gets here |

### Stripe

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/stripe/checkout` | POST | Create Stripe checkout session for certification payment |
| `/api/stripe/webhook` | POST | Receive Stripe events; on `checkout.session.completed`, write to `payments`, send `emailPaymentWelcome` |

### Admin

| Endpoint | Method | Purpose | Auth |
|---|---|---|---|
| `/api/admin/status` | PATCH | Update application/consult status. Triggers corresponding status-change email if status actually changes. | Email in `ADMIN_EMAILS` |

---

## 8. Authentication & Authorization

### Sign-in mechanism

**Device-aware routing** (resolves a chronic mobile sign-in regression):

```
Request → /sign-in
  ↓
Server reads User-Agent
  ├─ Matches /iPhone|(?:Android.*Mobile)/i → 302 redirect to
  │  https://accounts.twelvefold.institute/sign-in
  │    ?redirect_url=https%3A%2F%2Ftwelvefold.institute%2F<original>
  │  (Account Portal — top-level navigation, no iframes, no cross-subdomain cookie reads)
  │
  └─ iPad/Desktop/tablet → renders themed embedded <SignIn /> (SignInClient.tsx)
```

The absolute redirect URL (`https://twelvefold.institute/...`) is critical — relative URLs (`/`) are interpreted as paths on `accounts.twelvefold.institute` and users never return to the main app.

Same pattern mirrors at `/sign-up`.

### Authorization model

Access tiers are enforced at the **server component level** (page.tsx), never in client code:

```
Tier 0: Public
  Pages: /, /pattern-literacy, /book, /initiation, /about, /certification (page), /institutions, /method, /read (gateway)
  APIs:  /api/reading?depth=summary, /api/book/subscribe, /api/certification/apply, /api/institutions/consult, /api/initiation/complete

Tier 1: Signed-in (any account)
  Pages: /account, /portal (sees "not enrolled" fallback), /read/app (redirects to /read)
  APIs:  /api/me/cert-status, /api/readings, /api/clients (returns empty)

Tier 2: Certified Practitioner (signed in + payments match)
  Pages: /read/app (full workspace), /portal (full curriculum)
  APIs:  /api/reading?depth=full, /api/org-diagnostic, /api/readings/[id]/send, /api/clients (full CRM)

Tier 3: Admin (email in ADMIN_EMAILS)
  Pages: /admin
  APIs:  /api/admin/status
```

### Cert-paid matching strategy

The `payments` table is the source of truth for practitioner status. Every gate uses the same query:

```sql
SELECT id FROM payments
WHERE product = 'certification'
  AND status = 'succeeded'
  AND (clerk_user_id = $userId OR email = LOWER($userEmail))
LIMIT 1
```

This dual-match handles users who paid before signup (email-based match) and users who paid while signed in (user-id match).

### Welcome email idempotency

On first authenticated visit, `src/lib/welcome.ts` runs (called from root `layout.tsx`). It uses `profiles.clerk_user_id` (unique constraint) + `onConflictDoNothing` so the welcome email fires exactly once per user, regardless of how many pages they visit.

---

## 9. Email System

All emails sent via Resend with the verified sender `Twelvefold Institute <hello@twelvefold.institute>`. Templates live in `src/lib/email.ts`. A shared `shell()` function wraps every template with consistent header (Twelvefold wordmark) + footer (slogan + URL).

**Footer update (system-wide):** Every email now closes with:
> *Pattern Literacy for Life, Leadership, and Transformation.*
> *twelvefold.institute*

### Templates

| # | Template | Trigger | Recipient |
|---|---|---|---|
| 1 | `emailCertApplicationAck` | New cert application | Applicant |
| 2 | `emailCertApplicationReceived` | Same | `ADMIN_NOTIFICATION_EMAIL` |
| 3 | `emailConsultRequestAck` | New consult request | Requester |
| 4 | `emailConsultRequestReceived` | Same | Admin |
| 5 | `emailPaymentWelcome` | Stripe `checkout.session.completed` | Buyer (with gold "Open the Practitioner Portal →" callout for cert payments) |
| 6 | `emailWelcomeNewUser` | First authenticated visit | New user (honest about practitioner-led model; points at homepage `#try-it`) |
| 7 | `emailBookSubscribeConfirmation` | Book launch list signup | Subscriber |
| 8 | `emailBookSubscribeReceived` | Same | Admin |
| 9 | `emailInitiationConfirmation` | Initiation completion | Completer |
| 10 | `emailReadingToClient` | Practitioner sends reading | Client (v10 6-layer rendered: Pattern Summary, Recognition, Teaching, Alignment, Participation, Six Traditions) |
| 11–13 | Cert status changes | Admin flips status (new→reviewing→admitted/declined) | Applicant — only fires if status actually changes |
| 14–16 | Consult status changes | Admin flips status (new→qualified/scheduled/closed) | Requester — only fires if status actually changes |

---

## 10. Third-Party Integrations

### Anthropic

- **Model**: `claude-sonnet-4-6` (configurable via `ANTHROPIC_MODEL` env)
- **Used for**: `/api/reading` (summary 2K tokens, full 6K tokens), `/api/org-diagnostic` (2K tokens)
- **Key held server-side only**. No client-side API calls. All AI calls flow through Next.js API routes.
- **Response parsing**: salvage parser slices from first `{` to last `}` and JSON.parses; survives wrapping markdown fences or stray prose.

### Stripe

- **Mode**: Sandbox (verified end-to-end with $6,500 cert checkout)
- **⚠️ Pre-launch action**: swap Sandbox keys for Live keys; update webhook signing secret. See § 12.
- **Webhook**: `/api/stripe/webhook` processes `checkout.session.completed`, writes payment row, sends payment welcome email
- **Products**: currently `certification` ($6,500). Architecture supports adding `book`, `community`, etc.

### Resend

- **Domain**: `twelvefold.institute` (DKIM + SPF verified)
- **Sender**: `Twelvefold Institute <hello@twelvefold.institute>`
- **From env**: `RESEND_FROM_EMAIL`
- **Admin notifications**: sent to `ADMIN_NOTIFICATION_EMAIL`

### Clerk

- **Mode**: Production (`pk_live_*`, `sk_live_*`)
- **Custom domain**: `clerk.twelvefold.institute`
- **Account Portal**: `accounts.twelvefold.institute` (used for phone sign-in)
- **All 5 CNAMEs**: verified
- **Configured paths**: Sign-in URL `/sign-in`, Sign-up URL `/sign-up`, After sign-in URL `/`, After sign-up URL `/`

### Supabase

- Postgres only (no Supabase auth — Clerk handles that)
- Connection via `DATABASE_URL` to the pooler endpoint
- Migrations via `npm run db:push` (Drizzle Kit)

---

## 11. Build & Deploy

### Local development

```bash
git clone github.com/emmyshid/twelvefold-institute
cd twelvefold-institute
npm install
cp .env.example .env  # fill in env vars (see § 12)
npm run db:push       # apply schema migrations
npm run dev           # localhost:3000
```

### Production deploy

Push to `main` → Vercel auto-deploys. Build runs `next build`. Routes are statically rendered where possible; dynamic where Clerk auth or DB queries require it.

### Build-time considerations

- **Dynamic routes**: All `auth()`-using pages opt into dynamic rendering automatically
- **OG image**: Compiles on Vercel edge runtime on first request, then cached
- **Welcome dispatcher**: `maybeWelcome()` in root layout uses `headers()` (opts into dynamic) — `next build` logs "Dynamic server usage" warnings on `/_not-found` which are expected and filtered

---

## 12. Environment Variables

All configured in Vercel project settings:

```bash
# ─── Anthropic ───
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6

# ─── Database ───
DATABASE_URL=postgresql://...supabase-pooler...

# ─── Clerk ───
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ─── Stripe (SANDBOX — swap to LIVE before launch) ───
STRIPE_SECRET_KEY=sk_test_...      # ⚠️ change to sk_live_*
STRIPE_WEBHOOK_SECRET=whsec_...     # ⚠️ change after swapping to Live; re-register webhook endpoint

# ─── Resend ───
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Twelvefold Institute <hello@twelvefold.institute>
ADMIN_NOTIFICATION_EMAIL=emmyshid@gmail.com

# ─── Admin ───
ADMIN_EMAILS=emmyshid@gmail.com    # comma-separated for multiple
```

---

## 13. Recent Major Changes (chronological)

### `/research` shipped — Phase 1 fully closed *(June 14, 2026)*

Built the authority engine net-new (no source file to port). Shipped as a list page (`/research`) plus per-essay static detail pages (`/research/[slug]`), seeded with four real essays drawn from the framework's core claims — *Patterns Are Curriculum Not Pathology*, *Why Six Traditions Converge*, *The Case Against Self-Improvement*, *Timing Is Not a Metaphor*. Essays live in a shared `essays.ts` data module with a typed block structure (no markdown parser); detail pages pre-render via `generateStaticParams` and carry their own metadata for SEO and social. Added to homepage footer nav. **This closes Phase 1 of the Solution Architecture** — the last open Phase 1 item ("Research shell") is live as real content, not a shell. Built Option A (hardcoded) with a clean graduation path to a database later: only `essays.ts` would change.


### `/rhythms` shipped — Phase 2 complete *(June 14, 2026)*

Ported the Intelligent Rhythms app (21-rhythm system: 11 Life Domain Rhythms + 10 Planetary Archetypes) to `/rhythms`. **Decision B gate**: signed-in members only, no payment — a deliberately lower bar than the cert-paid practitioner tools (`/read/app`, `/portal`), positioning Rhythms as a member benefit on the seeker's practice path. Added real localStorage persistence (tracked rhythms + a reflections log that previously saved nothing). Flattened the planned `/practice` parent route — Rhythms is top-level. Added to homepage footer nav. **This completes Phase 2 of the Solution Architecture** — every Revenue Room is now live, and the product ecosystem (PatternOS + Initiation + Portal + Rhythms) is whole.


### Mobile sign-in saga — RESOLVED

**Problem**: Samsung S24 / iPhone / Android phones couldn't complete sign-in via embedded Clerk `<SignIn />`. Symptom: "tap continue, nothing happens, no error."

**Root cause**: Mobile browsers (iOS Safari ITP, Samsung Internet Smart Anti-Tracking) silently partition cross-subdomain cookies between `twelvefold.institute` and `clerk.twelvefold.institute`. The embedded iframe-based flow can't read its own session.

**Solution**: Server-side UA detection at `/sign-in`. Phones redirected to Clerk's hosted Account Portal at `accounts.twelvefold.institute/sign-in` with absolute return URL. iPad/desktop keep themed embedded experience. Verified working on Samsung S24 Ultra.

### Restructure: full readings are practitioner-only

**Decision**: Individuals get the homepage try-it (free brief reading). Full readings (Personal + Master modes) are the certified practitioner's craft.

**Implementation**:
- `/read/app` now server-gated to cert-paid (auth + `payments.product='certification' AND status='succeeded'`)
- `/read` rewritten as "Connect with a Practitioner" hub with sample reading mockup
- `/api/reading?depth=full` gates to cert-paid (defense in depth — API can't be bypassed)
- Welcome email updated to honestly describe the model
- Homepage product door reframed: "Try a brief reading" → `#try-it` instead of "Open PatternOS" → `/read`

### `/portal` integration

**Problem**: Certification customers paid $6,500 but had no learning destination — the 1,210-line `CertificationApp-v1.jsx` existed only as a JSX file in the project folder.

**Solution**: Ported to `/portal` as a server-gated route. Includes:
- 6 modules with lesson content + exercise submissions
- AI organizational diagnostic (routed through secure `/api/org-diagnostic` proxy)
- Practitioner tools dashboard
- Sidebar nav with "Client Readings ↗" entry navigating to `/read/app?mode=master`
- Mobile-responsive (sidebar collapses to hamburger drawer < 960px)
- Payment welcome email now includes "Open the Practitioner Portal →" callout

### Tier 1 trust-building shipped

Four discrete additions, each closing a real gap:

1. **Disclaimer in three placements** — homepage try-it, homepage footer, `/read` footer, `/method` footer
2. **"How It Works" section** on homepage — 4-step explainer (Name → Phase → Micro-state → Action) with practitioner-aware closing line
3. **Sample full reading mockup** on `/read` — fully styled v10-layer reading using "The Boredom Test" (Taurus · Contraction · 2.3) so visitors see exactly what a practitioner-led reading delivers
4. **`/method` page** — 6-section Sources & Method epistemic accounting (Inheritance, Interpretation, Contribution, Agreement, Difference, Limits)

### Brand language threaded site-wide

Three coordinated phrases (catchphrase, slogan, existing poetic hero) now function as a system:

- Hero eyebrow → catchphrase
- Footer slogan + meta description → formal slogan
- `/about`, `/institutions`, `/certification` heroes → catchphrase as eyebrow
- `/initiation` header → catchphrase persistent across all 10 segments
- Every email signature → slogan
- OG/Twitter cards → dynamic 1200×630 image at `src/app/opengraph-image.tsx` (catchphrase + slogan + branded aurora)

### v10 reading schema rebuild

Reading output restructured into six discrete layers (Pattern Summary, Recognition, Teaching, Alignment, Participation, Six Traditions). The display, the persisted JSON in `readings.raw`, and the email template are all aligned.

### Status-change email automation

Admin flipping cert app or consult status now triggers the corresponding email (6 templates) with anti-double-send protection — only fires if status actually changes.

### Recognition + Convergence carousels on homepage

Two horizontal scroll-snap carousels between hero and Shift section:
- **Recognition** (8 cards) — voice quotes mapped to real Pattern Names. Tap a card → `prefill-reading` CustomEvent → textarea below auto-fills + scrolls.
- **Convergence** (6 cards) — six wisdom traditions with real source citations.

---

## 14. Solution Architecture — Planned vs. Built

The canonical reference for the website's strategic design is the **Twelvefold Institute — Website Solution Architecture** document (uploaded by founder, June 13, 2026). This section maps that planning document against current build state — what aligns, what was restructured, what's pending.

### The canonical decisions made

The Solution Architecture document closed with three decision points. All three have now been made:

| Decision | Options | Chosen | Status |
|---|---|---|---|
| **A. Platform direction** | A1 Next.js on Vercel, single repo / A2 separate marketing site | **A1** | ✅ Implemented |
| **B. Identity & data** | B1 Full auth + Postgres now / B2 defer database to Phase 2 | **B1** | ✅ Implemented (Clerk + Supabase Postgres + Drizzle) |
| **C. Launch scope** | C1 Phase 1 only / C2 Phase 1 + Certification sales page | **Exceeded C2** | ✅ Phase 1 + Phase 2 mostly delivered (cert sales + `/portal` + Stripe end-to-end + Master mode reading workspace) |

### The three-phase build plan — current status

The Solution Architecture proposed three phases. Current status:

#### Phase 1 — The Front Door (authority + the hook)
*Planned: Home, Pattern Literacy, Book, About, Research shell. PatternOS mounted as free reading with server-backed accounts and AI proxy. Stripe for book + single membership tier.*

| Item | Status |
|---|---|
| `/` Home with hero, shift table, proof of rigor, try-it, four doors, institute block | ✅ Live (significantly expanded — Recognition + Convergence carousels, How It Works, Sample reading, brand language layered) |
| `/pattern-literacy` skeptic's page | ✅ Live |
| `/book` marketing + launch list | ✅ Live |
| `/about` | ✅ Live |
| `/research` shell | ✅ Live — and exceeded. Not a shell: shipped as a full list + per-essay static detail pages with 4 real seed essays (Patterns Are Curriculum Not Pathology, Why Six Traditions Converge, The Case Against Self-Improvement, Timing Is Not a Metaphor) |
| PatternOS mounted as free reading | ✅ Live as the homepage `#try-it` (anonymous, summary depth); full readings now gated to certified practitioners per locked business decision |
| Server-backed accounts | ✅ Live (Clerk + Postgres) |
| AI proxy (server-side Anthropic key) | ✅ Live (`/api/reading`, `/api/org-diagnostic`) |
| Stripe for book | ⏳ Not built — book is currently launch-list signup, not commerce |
| Stripe for membership tier | ⏳ Not built — community membership product not yet defined |
| Stripe for certification | ✅ Live (Sandbox verified; Live key swap pending — see § 17) |

**Phase 1 verdict: COMPLETE. The last open item (`/research` shell) shipped as four real essays, not a shell. Exceeded in critical areas too — Recognition carousel, sample reading, and the /method credibility page were not in the planned Phase 1 scope but materially strengthen authority. The only Phase 1 commerce gaps (Stripe for book, Stripe for a membership tier) are deferred product decisions, not missing infrastructure.**

#### Phase 2 — The Revenue Rooms
*Planned: Certification sales page + `/portal` (gated app, application flow, Stripe). Institutions page + consult lead capture. Rhythms mounted under `/practice`.*

| Item | Status |
|---|---|
| `/certification` sales page | ✅ Live |
| Application flow with status tracking | ✅ Live (`certification_applications` table, admin status transitions, 6 status-change emails) |
| `/portal` gated practitioner learning platform | ✅ Live (cert-paid gate, mobile-responsive, secured AI proxy, "Client Readings ↗" sidebar entry) |
| Stripe for certification ($6,500) | ✅ Live (Sandbox; needs Live swap) |
| `/institutions` page | ✅ Live |
| Consult lead capture form | ✅ Live (`consultation_requests` table, admin status flow) |
| `/rhythms` mounted under `/practice` | ✅ Live — ported to top-level `/rhythms` (the `/practice` parent was flattened, mirroring the `/portal` restructure). Signed-in/member-gated, no payment. Real localStorage persistence for tracked rhythms + reflections |

**Phase 2 verdict: COMPLETE — all 7 items live. `/rhythms` shipped as a top-level route (the `/practice` parent was flattened, mirroring the `/portal` restructure decision). The practitioner-and-seeker product ecosystem is now whole: PatternOS reading (practitioner) + Initiation (seeker entry) + Portal (practitioner learning) + Rhythms (seeker practice).**

#### Phase 3 — The Living Institute
*Planned: AttunedCommunity fully integrated, Research library publishing cadence, case studies, practitioner directory.*

| Item | Status |
|---|---|
| `/community` — AttunedCommunity integration | ⏳ Not built — `AttunedCommunity-v21.jsx` exists; requires Stripe subscriptions infrastructure (see § 16) |
| `/research` library + essays | ✅ Live — `/research` list + per-essay static pages, 4 seed essays. Publishing cadence is now editorial (add objects to `essays.ts`), not engineering |
| Case studies (institutions) | ⏳ Not built — needs editorial content; infrastructure could live on `/institutions` or `/research` |
| Practitioner directory | ⏳ Not built — opens with first cohort graduation; auto-populated from `payments` table |

**Phase 3 verdict: not yet started. Appropriate — these are post-launch authority-building moves. None blocks the public launch.**

### The critical migration: localStorage → server

The Solution Architecture flagged this as "the single largest piece of engineering work and the thing that turns five demos into a product." Status:

| Migration | Status |
|---|---|
| PatternOS readings (`pos10-master-history`) → `readings` table | ✅ Done |
| Master-mode clients (`pos10-clients`) → `clients` table | ✅ Done |
| Per-client session data (`pos10-client-${code}`) | ⏳ Partial — client-tagged readings persist in `readings.client_id`, but the live-session 6-char code feature is not yet built |
| Certification progress (`plc-progress`) → DB | ⏳ Not migrated — `/portal` still uses localStorage. Future: `cert_progress` table (listed in § 16) |
| Rhythms progress (`tfi-rhythms-*`) → DB | ⏳ `/rhythms` is live but uses localStorage (tracked rhythms + reflections). Migrate to `rhythms_progress` table when cross-device sync is needed — same trade-off as `/portal` |
| Community state | ⏳ Will be needed when `/community` is integrated |

**Migration verdict: PatternOS reading data is fully on the server (the most critical path). Portal progress is still localStorage and will be migrated when cross-device sync becomes a real user complaint or when the cert-progress table is built for the analytics layer.**

### The AI proxy (non-negotiable security fix)

The Solution Architecture flagged: *"On a public site the API key can never reach the browser."*

| Surface | Status | Endpoint |
|---|---|---|
| Reading generation (anonymous + practitioner) | ✅ Proxied server-side | `/api/reading` |
| Organizational diagnostic (in `/portal`) | ✅ Proxied server-side | `/api/org-diagnostic` |
| All other Anthropic calls | ✅ No direct browser-to-Anthropic calls anywhere in the codebase | — |

**Verdict: complete. Hardened path preserved (HTTP status checks, JSON salvage from first `{` to last `}`, real error surfacing, `max_tokens` capped per use case). API key lives only in Vercel env.**

### Design system inheritance

The Solution Architecture mandated: *"You already have a complete, distinctive system. The website uses it verbatim so the marketing site and the apps feel like one continuous surface."*

| Token | Planned value | Built value | Status |
|---|---|---|---|
| Background | `#06060F` | `#06060F` | ✅ |
| Card | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.025)` (slightly more subtle) | ✅ (minor refinement) |
| Accent gradient | `#A78BFA → #7C3AED` | Same | ✅ |
| Gold | `#FBBF24` | Same | ✅ |
| Headings | Space Mono | Same | ✅ |
| Body | Crimson Text | Same | ✅ |
| Motion | Aurora drift, PhaseRing breathing | Aurora blobs implemented; PhaseRing live in PatternOS workspace | ✅ |

**Verdict: design system inherited verbatim across all surfaces — marketing pages, embedded apps, OG image, emails. The "one continuous surface" goal is achieved.**

### Strategic moves added beyond the Solution Architecture

The Solution Architecture didn't specify these — they emerged during the build as Tier 1 trust-building moves and have proven essential:

| Addition | What it solves | Strategic role |
|---|---|---|
| `/method` page (6-section epistemic accounting) | Skeptic + scholar + institutional credibility | Job 1 (Establish authority) |
| Recognition carousel on homepage (8 voice cards with Pattern Names) | Cold-visitor "yes, that's me" recognition → one-tap try-it prefill | Job 2 (Route by intent) + Job 3 (Convert to revenue) |
| Convergence carousel on homepage (6 traditions with real citations) | Quick proof of cross-traditional convergence | Job 1 (Establish authority) |
| Sample full reading mockup on `/read` | Closes "what am I paying a practitioner for?" gap | Job 3 (Convert) |
| Three-layer brand language system (hero + catchphrase + slogan) | Coordinated voice across home, social cards, emails, every page eyebrow | Job 1 (Establish authority) — at every surface |
| Site-wide disclaimer | Legal/ethical floor for reflective/diagnostic content | Underlies all three jobs |
| Practitioner-only full readings (locked decision) | Repositions reading from self-serve commodity to practitioner craft | Job 3 (Convert) — refunnels demand from app to cert program |

These additions are not deviations from the Solution Architecture — they are it being executed faithfully and pushed further. The architecture's three jobs framework was the design rubric used to evaluate every one of them.

---

## 15. Original 14-Page Mockup — Implementation Plan

The site was originally designed as a 14-page mockup in `WebsiteMockup.jsx` (`/mnt/project/`). This section maps that plan against what's been built and identifies what remains.

### Mockup → live status

| # | Mockup page | Status | Current route(s) | Notes |
|---|---|---|---|---|
| 1 | **Home** | ✅ Live | `/` | Significantly expanded beyond mockup — adds Recognition carousel (8 cards), Convergence carousel (6 tradition cards), How It Works section (4 steps), try-it section with prefill, sample-reading mockup linking, 3-layer brand language, disclaimer in two placements |
| 2 | **Literacy** | ✅ Live | `/pattern-literacy` | Framework long-form explainer |
| 3 | **Framework** | 🔀 Merged | `/pattern-literacy` + `/method` | Mockup's Framework page consolidated into Pattern Literacy (the framework explainer) + the new `/method` page (epistemic accounting) |
| 4 | **Traditions** | 🔀 Merged | `/method` (§04–§05) + homepage Convergence carousel | No dedicated `/traditions` page. The six wisdom traditions are surfaced via the homepage Convergence carousel (with real citations) and the `/method` page's "Where the traditions agree" / "Where the traditions differ" sections |
| 5 | **Read** | ✅ Live (restructured) | `/read` + `/read/app` | Split into two routes: `/read` is the connect-with-practitioner hub (explainer + sample reading mockup + practitioner CTAs), `/read/app` is the cert-gated practitioner workspace |
| 6 | **Book** | ✅ Live | `/book` | Marketing page with hero, designed cover, intro excerpt, 4 reader profiles, 14-chapter TOC, author bio, launch list signup |
| 7 | **Practice** | 🔀 Reinterpreted | `/initiation` | The mockup's "Practice" page became the 10-segment Initiation experience (Web Speech TTS narration, persistent progress, 3-question diagnostic, completion email, conversion funnel) |
| 8 | **Rhythms** | ✅ Live | `/rhythms` | 21-rhythm system (11 Life Domain Rhythms + 10 Planetary Archetypes) ported from `RhythmsApp-v2-Planets.jsx`. Member-gated (signed-in, no payment). Real localStorage persistence. The `/practice` parent route was flattened — Rhythms is top-level |
| 9 | **Community** | ⏳ Pending | not built | `AttunedCommunity-v21.jsx` exists in project — paid membership UI ($200–$500/month per project brief), awaits integration. Future home: `/community` |
| 10 | **Certification** | ✅ Live (Tier 1) | `/certification` | Marketing page + application form with status tracking. Tier 2 trust-building enhancements pending (instructor bio, fuller curriculum, sample lesson, code of ethics, refund policy, cohort dates, graduate outcomes) |
| 11 | **Institutions** | ✅ Live (Tier 1) | `/institutions` | Marketing page + consult request form with status tracking. Tier 2 enhancements pending (sample diagnostic report, anonymized case study, procurement-friendly PDF) |
| 12 | **Research** | ✅ Live | `/research` | The "Research & Thought Leadership" surface. Built net-new (no source file): list page + per-essay static detail pages, 4 seed essays drawn from the framework's core claims. Essays live in `essays.ts` — graduate to a DB later without changing the page components |
| 13 | **About** | ✅ Live | `/about` | Independent by design + slogan as positioning subtitle |
| 14 | **Account** | ✅ Live | `/account` | Clerk UserProfile component |

### Routes built **beyond** the original mockup

Added during implementation as the product matured:

| Route | Purpose | Why added |
|---|---|---|
| `/portal` | Practitioner learning portal (cert-gated) | Cohort customers needed a learning destination after paying $6,500 — the original mockup had no portal concept |
| `/method` | Sources & Method (epistemic accounting) | Tier 1 trust-building. Critical credibility surface for skeptics, scholars, institutional buyers |
| `/initiation` | 10-segment guided experience | Reinterpretation of mockup's Practice page — became a stronger cold-visitor funnel |
| `/admin` | Admin dashboard | Operational necessity — review applications, consults, manage statuses |
| `/sign-in`, `/sign-up` | Device-aware auth | Resolves the mobile sign-in saga (server-side UA routing → Account Portal for phones) |
| `/api/*` (15 endpoints) | All backend operations | Not in mockup scope (mockup was a frontend-only design exploration) |
| `/opengraph-image` | Dynamic OG card | Brand language layering — every social share now carries the catchphrase + slogan |

### Summary

| Category | Count |
|---|---|
| Mockup pages live as-built | **10** (Home, Literacy, Read, Book, Certification, Institutions, About, Account, Rhythms, Research) |
| Mockup pages merged into another route | **2** (Framework → /pattern-literacy + /method; Traditions → /method + homepage Convergence carousel) |
| Mockup pages reinterpreted | **1** (Practice → /initiation) |
| Mockup pages pending | **1** (Community) |
| New routes added beyond mockup | **5+** plus the API layer |

### Pending mockup pages — build plan

#### `/rhythms` ✅ SHIPPED

**Status**: Live at `/rhythms` as of June 14, 2026.

**What shipped**:
- Ported `RhythmsApp-v2-Planets.jsx` (1,184 → 1,216 lines) to `src/app/rhythms/RhythmsClient.jsx` with `"use client"` directive
- Server gate at `src/app/rhythms/page.tsx` — **decision B**: signed-in members only, no payment gate (lower bar than the cert-paid practitioner tools)
- Rebranded "The Pattern Institute" → "Twelvefold Institute"
- Added real localStorage persistence (was in-memory only): tracked rhythms persist on change; reflections now actually save to a log (text + timestamp + rhythm + source, capped at 200) where previously `doSave` flashed "Saved" but stored nothing
- Added to homepage footer nav between Initiation and Pattern Literacy (the seeker's practice path)

**Storage keys**: `tfi-rhythms-tracked`, `tfi-rhythms-reflections`

**Restructure note**: The Solution Architecture planned `/rhythms` nested under a `/practice` parent. That parent was flattened — Rhythms is a top-level route, mirroring the `/portal` restructure decision. A `/practice` hub page was deemed unnecessary friction.

**Future**: migrate localStorage → `rhythms_progress` table when cross-device sync is wanted (same deferred trade-off as `/portal`).

#### `/community`

**Source**: `/mnt/project/AttunedCommunity-v21.jsx` — community membership UI.

**Build approach** (more involved than /rhythms because of payment):
1. Define the community membership Stripe product (e.g., `community-monthly` at $200, `community-annual` at $2K, etc.)
2. Add `community_subscriptions` table: `id`, `clerk_user_id`, `email`, `tier`, `status`, `stripe_subscription_id`, `current_period_end`, `created_at`
3. Extend Stripe webhook to handle `customer.subscription.*` events (currently only handles `checkout.session.completed`)
4. Create `src/app/community/page.tsx` with the same dual-tier gate pattern as `/portal`:
   - Not signed in → marketing page with Subscribe CTA
   - Signed in, not subscribed → marketing page with Subscribe CTA (using current account)
   - Signed in, active subscription → community interface
5. Port `AttunedCommunity-v21.jsx` to `src/app/community/CommunityClient.jsx`
6. Add cancellation flow (Stripe Customer Portal session)
7. Add community-related emails (welcome, renewal, cancellation, payment failure)

**Estimated effort**: 2-3 focused sessions. Substantially more involved than /portal because of subscription billing complexity.

**Prerequisites**: Stripe Live key swap (currently still in Sandbox — see § 18). Subscriptions can be developed against Sandbox but should switch to Live before any real members sign up.

#### `/research` ✅ SHIPPED

**Status**: Live at `/research` as of June 14, 2026.

**What shipped** (Option A — hardcoded content, no database):
- `src/app/research/essays.ts` — shared essay data module (the single source of truth). Typed `Essay` shape with body as structured blocks (`p` / `h2` / `quote`), so no markdown parser dependency
- `src/app/research/page.tsx` — list page (the authority engine hero + essay cards)
- `src/app/research/[slug]/page.tsx` — per-essay detail pages. `generateStaticParams` pre-renders every essay at build (fast + SEO); `generateMetadata` gives each its own title/description/OG
- 4 real seed essays drawn from the framework's core claims, in the founder's voice
- Added to homepage footer nav after Method

**Graduation path**: when this moves to a database (`research_articles` table + admin CRUD), only `essays.ts` is replaced — the page components consume the same `Essay` shape. Nothing built here is throwaway.

**To publish a new essay now**: add an object to the `ESSAYS` array in `essays.ts`, push. It auto-renders as a new static page with its own URL and metadata.


### Build sequence recommendation

If all three pending pages are eventually built, the natural sequence is:

1. ~~**`/rhythms`**~~ — ✅ SHIPPED June 14, 2026 (member-gated, completes the seeker practice path)
2. ~~**`/research`**~~ — ✅ SHIPPED June 14, 2026 (4 seed essays, list + static detail pages, the authority engine)
3. **`/community`** — the only mockup page left. Heaviest engineering: requires Stripe Live and subscription billing, plus a defined community tier strategy. Depends on the Stripe Sandbox → Live swap (§ 18)

None of these block the public launch. Stripe Live key swap (§ 18) is the only true launch blocker.

---

## 16. Pattern Name Library

48 named pattern states mapped to the 12 × 4 state matrix. Used by the reading engine for `pattern_name` field, by the recognition carousel for the homepage cards, and by the sample reading mockup on `/read`. Source: `/mnt/project/PatternOS-Pattern-Name-Library.md`.

Examples currently surfaced in the UI:
- **Ignition Moment** — Aries · Initiation · 1.1
- **Hidden Preparation** — Capricorn · Initiation · 10.1
- **The Boredom Test** — Taurus · Contraction · 2.3 *(used in the `/read` sample reading mockup)*
- **The Compromise Wall** — Libra · Contraction · 7.3
- **The Tiredness That Knows** — Pisces · Initiation · 12.1
- **Perfectionist's Trap** — Virgo · Contraction · 6.3
- **The Underworld Crossing** — Scorpio · Expansion · 8.2
- **Breaking the Form** — Aquarius · Expansion · 11.2

---

## 17. Planned & Upcoming Work

### Tier 2 trust-building (needs editorial content from founder)

- **`/certification` page additions**: instructor bio, full curriculum outline, sample lesson, code of ethics, refund/payment policy, cohort dates, graduate outcomes
- **`/institutions` page additions**: sample diagnostic report, anonymized case study, six-week diagnostic process diagram, procurement-friendly PDF
- **`/about` deepening**: founder full story, lineage acknowledgments, advisory board (if any)
- **`/team` or `/people` page**: instructor and contributor bios

### Pre-launch infrastructure

- **Stripe Sandbox → Live key swap**: change `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to Live values; re-register webhook endpoint in Stripe dashboard pointing at `https://twelvefold.institute/api/stripe/webhook`; test end-to-end with a $1 charge before announcing
- **OG image regeneration verification**: confirm `/opengraph-image` renders correctly on production edge runtime after deploy

### Product features (not blocking launch)

- **Practitioner directory** at `/practitioners` — public listing of certified practitioners with bios, contact methods, specialty notes. Opens with first cohort graduation. Auto-populated from `payments` (cert-paid users) + optional opt-in field.
- **Live session 6-char codes** — practitioner generates code, client joins at `/join/CODE` on their own device, both see synchronized reading workspace in real time. New table: `client_sessions`.
- **Per-phase recurrence digest** — for users with 5+ readings, generate a "you've been in Scorpio 3 times this year" insight surface. Pure analytics on existing `readings` table.
- **Dream Reading mode** — new input flow specifically for dreams with dream-tuned prompt. New `depth` value: `dream`.
- **Conditional `/portal` link in homepage nav** — visible only to enrolled users. Requires either an `/api/payments/me` endpoint + client-side check, or moving the homepage to a server component.

### Tier 3 editorial calendar (months, not weeks)

- **12 phase essays** — one long-form per phase, accessible at `/essays/<phase>`
- **Tradition deep-dives** — 6 articles, one per wisdom tradition, with practitioner-quality citations
- **Glossary** at `/glossary` — every term used in the framework with definitions and source attributions
- **Founder story / lineage** — full narrative of the framework's development
- **Research notes** — informal posts on framework refinements and observations from cohorts

### Email/automation refinements

- **Per-practitioner email signatures** — when a practitioner sends a reading via `/api/readings/[id]/send`, the email currently signs as "Twelvefold Institute." Should include the practitioner's name and credentials. Requires either a `practitioner_profiles` table or extending `profiles` with a `practitioner_display_name`.
- **Drip sequences** — onboarding sequence for the book launch list (3-email arc). Engagement sequence for unconverted application reviewers (e.g., "we haven't heard back").

### Open admin work

- **Admin metrics view** — current `/admin` lists records but doesn't show aggregates (signups this week, cert revenue this month, completion rate of initiation). Add a dashboard tab.
- **Manual welcome email re-trigger** — when accounts get linked or merged, admin should be able to re-fire the welcome flow.

---

## 18. Known Issues & Tech Debt

| Item | Severity | Status |
|---|---|---|
| Stripe is still in Sandbox mode | **Blocks production launch** | Pending key swap |
| No `/og-image.png` static fallback | Low | Dynamic OG image at `/opengraph-image.tsx` handles this — only an issue if Vercel edge runtime fails to compile |
| `_mem` fallback in `/portal` storage | Low | Real localStorage layered on top; falls through cleanly in SSR. Future: migrate to `cert_progress` DB table for cross-device sync |
| No practitioner-specific email signatures | Medium | Listed in upcoming work |
| Portal `/api/org-diagnostic` only requires auth, not cert-paid | Low (page-level gate provides primary defense) | Could add cert-payment double-check at endpoint for defense in depth |
| `welcome.ts` "Dynamic server usage" warning at `_not-found` during build | Cosmetic | Filtered, doesn't affect production |
| Conditional homepage nav for `/portal` not implemented | Cosmetic | Listed in upcoming work — enrolled users discover via email link |
| iPad still uses embedded sign-in (works) | Cosmetic | Could unify on Account Portal if simpler maintenance preferred |

---

## 19. Verification Checklist

Run after any significant deploy to confirm nothing regressed:

**Marketing flow**
- [ ] Homepage loads with new hero eyebrow "Read the pattern. Align with the order."
- [ ] How It Works section renders 4 cards
- [ ] Recognition carousel scrolls; tapping a card prefills `#try-it` textarea
- [ ] Convergence carousel scrolls
- [ ] Try-it submission produces a brief reading (depth=summary)
- [ ] Disclaimer visible below try-it and in footer
- [ ] Footer shows italic slogan + Method link
- [ ] `/method` renders all 6 sections; Method link in homepage footer works

**Reading access policy**
- [ ] Anonymous user → can use homepage try-it
- [ ] Anonymous user direct POST to `/api/reading?depth=full` → 401
- [ ] Signed-in non-cert user → `/read/app` redirects to `/read`
- [ ] Cert-paid user → `/read/app` opens workspace with Master/Personal toggle visible
- [ ] Cert-paid user → `/portal` opens learning curriculum
- [ ] Non-cert user → `/portal` shows "You're not enrolled yet" fallback

**Sign-in**
- [ ] Desktop browser → `/sign-in` renders themed embedded SignIn
- [ ] iPad → same
- [ ] Phone (iPhone/Android) → redirects to `accounts.twelvefold.institute`
- [ ] Phone sign-in → lands back on `twelvefold.institute` signed in

**Payments**
- [ ] Stripe test checkout completes
- [ ] `payments` row created
- [ ] Payment welcome email arrives with "Open the Practitioner Portal →" callout
- [ ] User can immediately access `/portal` and `/read/app`

**Emails**
- [ ] All emails close with "Pattern Literacy for Life, Leadership, and Transformation."
- [ ] Status-change emails fire only when status actually changes
- [ ] Reading-to-client email renders v10 layers

**Social cards**
- [ ] `/opengraph-image` renders 1200×630 with catchphrase + slogan
- [ ] Pasting `twelvefold.institute` into Slack/iMessage shows branded preview

**Brand language audit**
- [ ] `/about` shows slogan as italic subtitle under "Independent by design."
- [ ] `/institutions` eyebrow is catchphrase
- [ ] `/certification` eyebrow is catchphrase
- [ ] `/initiation` header shows catchphrase below segment counter on every screen

---

## 20. File Map

Quick reference for where things live.

```
src/
├── middleware.ts                          # Clerk middleware (auth route protection)
├── app/
│   ├── layout.tsx                         # Root layout, ClerkProvider, metadata, welcome dispatcher
│   ├── page.tsx                           # → renders <Homepage />
│   ├── opengraph-image.tsx                # Dynamic OG image (1200×630, edge runtime)
│   ├── globals.css                        # Font imports + base reset
│   │
│   ├── about/page.tsx                     # About — Independent by design + slogan
│   ├── book/                              # Book marketing + launch list form
│   │   ├── page.tsx
│   │   └── BookSubscribeForm.tsx
│   ├── certification/
│   │   ├── page.tsx                       # → renders <CertificationPage />
│   │   └── payment-success/page.tsx
│   ├── initiation/page.jsx                # 10-segment initiation experience (1,062 lines)
│   ├── rhythms/                           # Intelligent Rhythms app (member-gated)
│   │   ├── page.tsx                       # Server gate (signed-in, no payment)
│   │   └── RhythmsClient.jsx              # 21-rhythm app (1,216 lines)
│   ├── institutions/page.tsx              # Org consulting
│   ├── method/page.tsx                    # Sources & Method (615 lines, 6 sections)
│   ├── research/                          # Authority engine (essays)
│   │   ├── essays.ts                      # Seed essay data (single source of truth)
│   │   ├── page.tsx                       # Essay list page
│   │   └── [slug]/page.tsx                # Per-essay static detail pages
│   ├── pattern-literacy/page.tsx          # Framework explainer
│   ├── account/page.tsx                   # Clerk UserProfile
│   ├── admin/                             # Admin dashboard
│   │   ├── page.tsx
│   │   └── AdminClient.tsx
│   │
│   ├── read/                              # Reading routes
│   │   ├── page.tsx                       # Connect-with-practitioner hub
│   │   └── app/
│   │       ├── page.tsx                   # Server gate (cert-paid only)
│   │       └── ReadAppClient.tsx          # PatternOS workspace (2,184 lines)
│   ├── portal/                            # Practitioner learning portal
│   │   ├── page.tsx                       # Server gate
│   │   └── PortalClient.jsx               # CertificationApp (1,336 lines, mobile-responsive)
│   │
│   ├── sign-in/[[...sign-in]]/
│   │   ├── page.tsx                       # Server UA detection
│   │   └── SignInClient.tsx               # Themed embedded
│   ├── sign-up/[[...sign-up]]/
│   │   ├── page.tsx
│   │   └── SignUpClient.tsx
│   │
│   └── api/                               # All API routes (Node.js runtime)
│       ├── reading/route.ts
│       ├── readings/route.ts
│       ├── readings/[id]/send/route.ts
│       ├── clients/route.ts
│       ├── clients/[id]/route.ts
│       ├── certification/apply/route.ts
│       ├── institutions/consult/route.ts
│       ├── stripe/checkout/route.ts
│       ├── stripe/webhook/route.ts
│       ├── admin/status/route.ts
│       ├── me/cert-status/route.ts
│       ├── org-diagnostic/route.ts
│       ├── initiation/complete/route.ts
│       └── book/subscribe/route.ts
│
├── components/
│   ├── Homepage.tsx                       # Main homepage (604 lines)
│   └── CertificationPage.tsx              # Cert marketing page
│
└── lib/
    ├── anthropic.ts                       # Reading prompts + Anthropic SDK calls
    ├── stripe.ts                          # Stripe client
    ├── rateLimit.ts                       # In-memory rate limiter
    ├── admin.ts                           # Admin email check
    ├── email.ts                           # All email templates + shell() wrapper
    ├── welcome.ts                         # First-sight welcome dispatcher
    └── db/
        ├── index.ts                       # Drizzle client
        └── schema.ts                      # All tables
```

---

## 21. Glossary (internal)

| Term | Meaning |
|---|---|
| **Pattern Literacy** | The practice and brand. The framework as a whole. |
| **PatternOS** | The reading software. Now practitioner-only at `/read/app`. |
| **Twelvefold Institute** | The institutional brand. |
| **Try-it** | The free anonymous brief reading at homepage `#try-it`. |
| **Full reading** | Six-layer reading delivered by a certified practitioner. Includes Pattern Summary, Recognition, Teaching, Alignment, Participation, Six Traditions. |
| **Brief reading** | `depth=summary` reading. Pattern Summary only. Free, anonymous. |
| **Pattern Name** | A felt-experience human-readable name for a specific 12×4 state (e.g., "The Boredom Test"). |
| **Phase** | One of the 12 universal cycles (Aries through Pisces). |
| **Micro-state** | One of 4 states within a phase: Initiation, Expansion, Contraction, Integration. |
| **The 48** | Total named pattern states (12 phases × 4 micro-states). |
| **The 6** | The six wisdom traditions (Ifá, Kabbalah, I Ching, Scripture, Buddhism, Hermetic). |
| **Master mode** | PatternOS feature where a practitioner does readings for clients (not themselves). Includes client CRM and session codes. |
| **Personal mode** | PatternOS feature where a practitioner does readings for themselves. |
| **Portal** | The certification learning platform at `/portal`. |
| **The connect page** | `/read` — explainer + sample reading + connect-with-practitioner CTAs. |

---

*Architecture document maintained as the single source of truth. When the website changes, update this document so future contributors (and future you) have an honest, current map.*
