# TeamUp

**A skill-based matchmaking platform that helps developers and designers find the right teammates for hackathons and side projects.**

`React 18` · `Vite 5` · `Supabase` · `PostgreSQL + RLS` · `Arabic / English with full RTL`

---

## Overview

Finding teammates is usually a matter of who you already know. TeamUp replaces that
with an explicit skill graph: every member declares the skills they have and the
proficiency level for each, and the search ranks people by how well they match the
skills a team actually needs.

The platform covers the full lifecycle — discover people, send a collaboration
request, chat once it's accepted, and organise accepted collaborators into groups
with their own shared chat.

The entire interface is bilingual (Arabic / English) with proper RTL layout, and the
app ships as either a standard static build or a **single self-contained HTML file**
that runs by double-click, with no server involved.

---

## Features

| Area | What it does |
|---|---|
| **Authentication** | Email/password via Supabase Auth, with a 4-step onboarding flow (account → profile → skills → projects). Progress is saved after **every** step, not at the end. |
| **Skill matching** | Pick the skills a team needs; members are returned ranked by match percentage. |
| **Skill catalogue** | 182 curated skills across 13 categories, with prefix-first search and the ability to contribute a new skill to the catalogue. |
| **Collaboration requests** | Send / accept / reject. Accepting automatically opens a private conversation between both parties. |
| **Realtime messaging** | One-to-one and group chat over Supabase Realtime. |
| **Groups** | Invite-based membership with a three-tier permission model (owner / member / member-with-manage-rights), enforced in the database — not just in the UI. |
| **Notifications** | In-app notification centre with unread badge and per-category preferences that are honoured server-side. |
| **Guest mode** | Browse without an account, limited to 3 searches; any further action opens the sign-up gate. |
| **Avatars** | Image upload to Supabase Storage, scoped per user by storage policy. |

> Notifications are **in-app only**. Email and push are intentionally out of scope —
> email would require an Edge Function plus a mail provider, and push does not work
> from a `file://` origin.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| UI | React 18.3 | No component library. Styling is inline, converted at runtime by a small `__css()` helper — see [Conventions](#development-conventions). |
| Build | Vite 5.4 | `@vitejs/plugin-react` for the standard build; `vite-plugin-singlefile` for the one-file bundle. |
| Auth | Supabase Auth | Per-tab session isolation for testing two accounts side by side. |
| Database | Supabase PostgreSQL | 12 tables, Row-Level Security on all of them, `SECURITY DEFINER` functions for privileged operations. |
| Realtime | Supabase Realtime | Enabled on `messages`, `group_messages`, `requests`, `group_members`, `groups`, `notifications`. |
| Storage | Supabase Storage | Public-read `avatars` bucket, 3 MB limit, images only, write-scoped to `avatars/<user_id>/`. |
| Serverless | Supabase Edge Functions (Deno) | `delete-account` — permanent account deletion. |
| i18n | Local dictionary | `src/lib/strings.js` exposes `STR.ar` / `STR.en`. No i18n library. |

---

## Architecture

### The `V` pattern

`App.jsx` owns everything stateful: React state, all data fetching, and every
handler. It composes them into a single object called `V` that carries prepared
strings, computed colours, and callbacks. Components under `src/generated/` are
pure presentation — they only read from `V`:

```jsx
{V.people}        {V.L.navHome}        onClick={V.runSearch}
```

**To add a feature:** define the values on `V` in `App.jsx`, then bind them in
`generated/*.jsx`. Never put logic inside `generated/`.

### Project layout

```
src/
├─ App.jsx                    All application logic: state, queries, and the V object
├─ main.jsx                   React entry point
├─ index.css                  Global styles, animations, and interaction primitives
├─ components/
│  └─ PasswordField.jsx       Password input with reveal toggle
├─ screens/
│  ├─ Setup.jsx               Supabase connection screen (shown when no config exists)
│  └─ AuthGate.jsx            Sign-up prompt for guests
├─ lib/
│  ├─ supabase.js             Client, project switching, per-tab session isolation
│  ├─ db.js                   Every database query, in one place
│  ├─ strings.js              All UI copy in Arabic and English
│  ├─ style.js                __css("a:b;c:d") → React style object
│  └─ time.js                 Relative timestamps and correct Arabic pluralisation
└─ generated/                 Presentational components (see the V pattern above)

supabase/
├─ 01_schema.sql              Tables, RLS policies, GRANTs, functions, Realtime
├─ 02_skills.sql              Skill catalogue (182 skills, 13 categories)
├─ 03_demo_members_optional.sql
├─ 04_storage_and_avatars.sql
├─ 05_notifications.sql
└─ functions/delete-account/  Edge Function
```

### Data model

| Table | Purpose |
|---|---|
| `profiles` | User profile, bilingual fields, onboarding state |
| `skills` | Skill catalogue (name, category) |
| `user_skills` | Skill → user, with proficiency level |
| `projects` | Portfolio entries attached to a profile |
| `requests` | Collaboration requests with `pending / accepted / rejected` status |
| `conversations`, `messages` | Direct messaging |
| `groups`, `group_members`, `group_messages` | Groups, invitations, and group chat |
| `notification_prefs`, `notifications` | Per-user notification switches and the feed |

Privileged operations run through `SECURITY DEFINER` functions rather than direct
table access — `accept_request()`, `conversation_with()`, `set_group_permission()`,
and the `is_group_member()` / `is_conversation_member()` family used by the RLS
policies themselves. `notify()` is the single entry point for creating a
notification; it checks `notification_prefs` first and stays silent when the
relevant switch is off.

A partial index (`requests_one_per_pair`) enforces at most one request between any
two users **in either direction**, so accepting in one direction is enough for both.

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A Supabase project (free tier is sufficient)

### Install and run

```bash
npm install
```

```bash
cp .env.example .env
```

Fill in the two variables, then start the dev server:

```bash
npm run dev
```

### Environment variables

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Same page — the `anon` key |

> The `anon` key is designed to be exposed in the browser; the real access control
> is the RLS policies. **Never** put a `service_role` key in frontend code.

The Supabase project can also be switched from inside the app — **Settings → Change
Supabase project**. That value is stored in `localStorage` and takes precedence over
`.env`.

---

## Database Setup

In **Supabase → SQL Editor → New query**, run the files in order:

| File | Required | What it creates |
|---|:---:|---|
| `supabase/01_schema.sql` | ✅ | Tables, RLS policies, **GRANTs**, functions, Realtime publication |
| `supabase/02_skills.sql` | ✅ | Skill catalogue — 182 skills, 13 categories |
| `supabase/04_storage_and_avatars.sql` | ✅ | `avatars` bucket, `avatar_url` column, storage policies |
| `supabase/05_notifications.sql` | ✅ | Notifications table, `notify()`, notification triggers |
| `supabase/03_demo_members_optional.sql` | Optional | 9 demo members — **development only, do not run in production** |

Then deploy the Edge Function:

```bash
supabase functions deploy delete-account --no-verify-jwt
```

> `--no-verify-jwt` is deliberate: the function validates the JWT itself via
> `admin.auth.getUser(token)`, and it must be able to answer the CORS preflight
> `OPTIONS` request — the app is sometimes opened from `file://`, where the origin
> is `null`.

All SQL files are **idempotent** (`if not exists` / `on conflict`) and safe to
re-run.

---

## Build

```bash
npm run build
```

Standard static build in `dist/`.

```bash
npm run build:single
```

Bundles everything — JS, CSS, and assets — into a single HTML file in
`dist-single/`. It runs by double-click from `file://` with no server, which is how
the project is usually shared for review.

After the single-file build, inline the favicon (easy to forget — the bundler leaves
it as an external reference):

```python
import base64
p = 'dist-single/index.html'
s = open(p, encoding='utf-8').read()
d = 'data:image/svg+xml;base64,' + base64.b64encode(open('dist-single/logo.svg','rb').read()).decode()
open(p, 'w', encoding='utf-8').write(s.replace('href="/logo.svg"', 'href="' + d + '"'))
```

---

## Deployment

The app is a fully static bundle with no server-side runtime, so `dist/` can be
served from any static host — Vercel, Netlify, GitHub Pages, or Supabase Storage.

> [!IMPORTANT]
> **Vite inlines environment variables at build time, not at runtime.**
> `import.meta.env.VITE_SUPABASE_URL` is textually replaced with its value while
> the bundle is being built. Adding or changing a variable on the host therefore
> does nothing to an already-deployed site — a **new build** is required every
> time.

### Vercel (current setup)

The repository is connected to Vercel, so every push to `main` triggers an
automatic deployment. The auto-detected build settings are correct and need no
changes:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

**Environment variables** — Project → Settings → Environment Variables. Add both,
and tick **all three** scopes (Production, Preview, Development):

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | The `anon` key from Supabase → Project Settings → API |

Three things break this silently if you get them wrong:

1. **The `VITE_` prefix is mandatory.** Vite only exposes variables that start with
   it; anything else is dropped from the bundle without a warning.
2. **Tick all three scopes.** A variable set for Production only leaves every
   preview deployment unconfigured.
3. **Redeploy without the build cache.** After adding the variables, go to
   Deployments → latest → ⋯ → **Redeploy** and *uncheck* `Use existing Build
   Cache`. A plain `git push` works too.

If any of these is missed, the deployed site falls back to the
`src/screens/Setup.jsx` connection screen, because `isConfigured` in
`src/lib/supabase.js` evaluates to `false` with empty credentials.

No `vercel.json` is needed — the app has no client-side router, so there are no
routes to rewrite.

### Supabase auth URLs

`App.jsx` passes `redirectTo: window.location.origin` when requesting a password
reset. Supabase rejects any redirect target that is not on its allow-list, so the
deployed domain must be registered — otherwise reset and confirmation emails point
at the wrong place.

Supabase → **Authentication** → **URL Configuration**:

- **Site URL** — the production domain, e.g. `https://<your-app>.vercel.app`
- **Redirect URLs** — add both, so local development keeps working:
  - `https://<your-app>.vercel.app/**`
  - `http://localhost:5173/**`

### If the Setup screen still appears

Credentials saved from inside the app take priority over the build-time
environment variables (see `src/lib/supabase.js`). If the connection form was ever
filled in on that domain, the stored values are shadowing the correct ones. Open
the site in a private window to confirm — if it works there, clear the stored
values via **Settings → Change Supabase project**, which calls
`clearCredentials()`.

---

## Development Conventions

These are not style preferences — each one exists because breaking it has already
cost the team debugging time.

**1. Logic lives in `V`.** All state and queries belong in `App.jsx`; `generated/`
components read from `V` and render. No logic in `generated/`.

**2. Do not change the design.** The UI matches the original prototype exactly —
colours, spacing, radii, animations. When adding an element, copy the styles of a
similar existing one. Do not introduce a CSS framework and do not rewrite the
styles. The `__css()` helper is what preserves the pixel-level match; keep it.

**3. RLS alone is not enough — you also need `GRANT`.** A new table needs both a
policy **and** table privileges:

```sql
grant select, insert, update, delete on public.<table> to authenticated;
```

Without the grant, every read and write fails with `permission denied` — silently,
while the policy looks perfectly correct.

**4. `revoke ... from anon, authenticated` does nothing on its own.** PostgreSQL
grants `EXECUTE` on new functions to `PUBLIC` by default, and both roles inherit
from it. Internal functions must be revoked with:

```sql
revoke execute on function public.<fn>(...) from public, anon, authenticated;
```

But do **not** revoke functions the frontend calls directly, or the ones used inside
RLS policies — revoking those breaks the policies themselves.

**5. RLS policies must start with a direct column comparison.** A `STABLE` function
evaluates against the pre-statement snapshot, so it cannot see the row being
inserted. A read policy written purely as `using (some_stable_fn(id, auth.uid()))`
makes `INSERT … RETURNING` fail with a misleading
`new row violates row-level security policy`. Lead with `owner_id = auth.uid() or …`.

**6. All copy goes in `strings.js`.** Both `STR.ar` and `STR.en`. No string
literals inside components.

**7. `src/generated/` is hand-maintained.** These files were originally produced by
a converter, but have been edited by hand since. Do not regenerate them — that would
erase the manual work.

**8. Auto-formatting is disabled on purpose** in `.vscode/settings.json`. The
`generated/` files carry precise inline styles and reformatting breaks the layout.

---

## Contributing

```bash
git checkout -b feature/<feature-name>
```

```bash
git commit -m "short description of the change"
```

```bash
git push -u origin feature/<feature-name>
```

Then open a pull request against `main`.

- One branch per feature — never commit directly to `main`
- `feature/…` for features, `fix/…` for fixes
- Run `npm run build` before opening a PR to confirm the build passes
- Database changes go in a **new** SQL file under `supabase/` and must be mentioned
  in the PR description

---

## Troubleshooting

**`vite` fails right after `npm install`** — recent npm versions block install
scripts, so the `esbuild` binary never finishes downloading:

```bash
npm approve-scripts esbuild && npm rebuild esbuild
```

**`permission denied` from the database** — the table is missing a `GRANT`, not a
policy. See convention 3.

**The skill list is empty** — `supabase/02_skills.sql` has not been run.

**Sign-up asks for email confirmation** — turn it off during development:
Authentication → Sign In / Providers → Email → Confirm email = Off.

**Testing two accounts at once** — append `?tab=2` to the URL. That tab gets an
isolated session (its own `sessionStorage` key) and shows a purple badge.

**A member never appears in search results** — members with no skills are excluded
from matching entirely, by design.

---

## Contributors

| Name |
|---|
| **Lujain Aljaeid** — لجين الجعيد |
| **Rawan Alshammari** — روان الشمري |
| **Manar Alqasem** — منار القاسم |
