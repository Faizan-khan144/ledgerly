# Ledgerly

**Studio finance, without the noise.**

Ledgerly is a calm, full-stack invoicing workspace for independent designers, developers, and small studios. Track what you have earned, what is still waiting, and who needs a gentle nudge — all from one fast, keyboard-friendly dashboard.

Built with **Next.js 15 App Router**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **SQLite** — no external services, no setup rituals.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-14140f?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1-14140f?logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-14140f?logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-14140f?logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-node%3Asqlite-14140f?logo=sqlite&logoColor=003B57)](https://nodejs.org/api/sqlite.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-d8451b.svg)](./LICENSE)

---

## Why Ledgerly

Most invoicing tools feel like accounting software wearing a startup hoodie. Ledgerly is built for the way a studio actually works:

- Send an invoice, then get back to the work.
- See the shape of the month at a glance.
- Let overdue invoices announce themselves.
- Keep every client, project, and payment in one quiet place.

The interface is intentionally editorial: warm paper, ink, a single vermilion accent, tight typography, and motion that explains instead of showing off.

## Feature highlights

### Dashboard
- Collected, outstanding, overdue, and collection-rate metrics with animated counters.
- A six-month revenue rhythm chart.
- Overdue queue, top clients by lifetime revenue, and a human-readable activity trail.
- Overdue invoices are promoted automatically when their due date passes.

### Invoices
- Create, browse, filter, search, and paginate invoices.
- Line items with quantity, unit price, and tax calculated in integer cents.
- Mark as sent, paid, or overdue; duplicate an invoice as a fresh draft.
- Print-ready invoice detail with a copyable invoice number.
- CSV export for your accountant or a very satisfying backup.

### Clients
- Client profiles with lifetime billed and outstanding totals.
- Full invoice history per client.
- Create, edit, and safely delete clients (blocked while invoices exist).
- Start a new invoice already pre-filled with the client.

### Power-user touches
- **Command palette** — press `⌘K` / `Ctrl+K` to jump anywhere or run actions.
- Keyboard navigation, optimistic pending states, and animated route transitions.
- A sticky workspace topbar with breadcrumbs and quick actions.
- Responsive from phone to wide desktop.
- Password change flow with current-password verification.

### Security & data
- Salted `scrypt` password hashing.
- Signed, HTTP-only, `SameSite=Lax` session cookies.
- Every query is scoped to the signed-in user.
- SQLite foreign keys, WAL journaling, and transactions for multi-row writes.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15.5 (App Router, Server Actions) |
| UI | React 19, Tailwind CSS v4, Lucide icons |
| Language | TypeScript 5.9 (strict) |
| Database | SQLite via Node's built-in `node:sqlite` |
| Auth | HMAC-signed cookie sessions + scrypt |
| Fonts | Manrope, Space Grotesk, JetBrains Mono |
| Tests | Node's built-in test runner |

No ORM, no component library, no runtime database server. The dependency list is deliberately short.

## Quick start

### Requirements

- **Node.js 24.x** (see `.nvmrc`)
- npm 10+

### Run locally

```bash
git clone https://github.com/Faizan-khan144/ledgerly.git
cd ledgerly
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database and demo workspace are created automatically on first run at `.data/ledgerly.db`.

### Demo account

```text
Email:    faizan@ledgerly.app
Password: demo1234
```

You can also create a fresh workspace from the sign-up screen.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Run TypeScript with no emit |
| `npm test` | Run the money and password unit tests |

## Project structure

```text
ledgerly/
├─ actions/              # Server actions (auth, clients, invoices, settings)
├─ app/
│  ├─ (app)/             # Authenticated workspace routes
│  │  ├─ clients/
│  │  ├─ dashboard/
│  │  ├─ invoices/
│  │  └─ settings/
│  ├─ api/               # CSV export + health check
│  ├─ login/
│  ├─ signup/
│  ├─ globals.css        # Design tokens, app shell, landing, motion
│  ├─ layout.tsx
│  └─ page.tsx           # Marketing landing page
├─ components/           # UI, shell, composers, palette, motion
├─ lib/                  # Database, queries, auth, session, money, password
├─ tests/                # Unit tests
├─ next.config.ts
└─ package.json
```

## Data model

| Table | Purpose |
| --- | --- |
| `users` | Studio profile and password hash |
| `clients` | Contacts owned by a user |
| `invoices` | Header, status, dates, tax, integer-cent totals |
| `invoice_items` | Description, quantity, unit price per line |
| `activities` | Lightweight audit trail for the dashboard |

All money is stored as integer cents. Monetary input is parsed once and rounded once, so totals never drift.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Open or close the command palette |
| `↑` / `↓` | Move through commands |
| `Enter` | Run the selected command |
| `Esc` | Close the palette |

## Deployment

### Vercel

The app builds as a standard Next.js project and can be deployed to Vercel.

```bash
npx vercel
```

Set a strong `SESSION_SECRET` in the project's environment variables.

> **Important:** Ledgerly uses `node:sqlite`. On Vercel the database lives in `/tmp` and is **ephemeral** — data may reset between cold starts and is not shared across instances. That is fine for a demo, but for production swap the `lib/db.ts` adapter for a managed Postgres or hosted SQLite provider such as Turso/Neon. The rest of the data layer is plain SQL and maps over cleanly.

### Any Node host

```bash
npm ci
npm run build
npm start
```

Persist the `.data` directory (or point `DATABASE_PATH` at a persistent volume) and set `SESSION_SECRET`.

## Design notes

- Palette: paper `#f2f0e9`, ink `#14140f`, vermilion `#d8451b`, muted stone `#6b6960`.
- Type: Space Grotesk for display, Manrope for body, JetBrains Mono for micro-labels.
- Motion: entrance reveals, scroll progress, magnetic buttons, card tilt, cursor spotlight, route fades, and a command palette — all disabled under `prefers-reduced-motion`.
- No gradients-as-personality, no glassmorphism, no AI sparkle icons. Just structure, rhythm, and contrast.

## Testing

```bash
npm test
npm run typecheck
npm run build
```

The current suite covers money formatting/parsing/date math and password hashing/verification.

## License

MIT © 2026 [Faizan Khan](https://github.com/Faizan-khan144)

See [LICENSE](./LICENSE).
