<div align="center">

<img src="public/pictures/hero.jpg" alt="Artist Factory" width="100%" />

# Artist Factory

**Rehearsal & recording studio booking platform — Budapest**

[![Live Site](https://img.shields.io/badge/live-www.artistfactory.hu-1f6feb?style=for-the-badge)](https://www.artistfactory.hu/)

![Next.js](https://img.shields.io/badge/Next.js_15-000?style=flat-square&logo=next.js&logoColor=fff)
![React](https://img.shields.io/badge/React_19-087ea4?style=flat-square&logo=react&logoColor=fff)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=fff)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=fff)
![Prisma](https://img.shields.io/badge/Prisma_6-2d3748?style=flat-square&logo=prisma&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?style=flat-square&logo=postgresql&logoColor=fff)
![NextAuth](https://img.shields.io/badge/NextAuth-000?style=flat-square&logo=auth0&logoColor=fff)
![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=fff)

</div>

---

Customers browse rooms, reserve hourly slots on a live availability grid, and confirm by email. Staff run the whole schedule and user base from a built-in admin panel. Bilingual (Hungarian / English), server-rendered, deployed on Vercel.

## Features

|  | |
| --- | --- |
| 📅 **Booking grid** | One column per room, one row per hour (09:00–22:00). Select multiple slots, confirm together. |
| 🔒 **No double-booking** | Enforced by a database-level unique constraint, safe under concurrent requests. |
| ✉️ **Email flow** | Confirmation, verification, cancellation, and automatic admin notification — via Resend or SMTP. |
| 👤 **Accounts** | Credentials auth, bcrypt hashing, email verification, password reset, self-service profile. |
| 🛠️ **Admin panel** | Role-gated in middleware. Create, edit, annotate, and delete bookings; manage users; take phone bookings. |
| 🌍 **Bilingual** | Hungarian default + English, with 301 redirects preserving the legacy site's indexed URLs. |

## Quick Start

```bash
npm install
cp .env.example .env          # fill it in — see Environment below
npx prisma migrate deploy     # apply migrations
npx prisma db seed            # seed the 6 rooms (+ admin, if seed vars are set)
npm run dev                   # → http://localhost:3000
```

Requires **Node 20+** and a **PostgreSQL** database (production runs on Neon).

> [!NOTE]
> The seed creates an admin account only when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are set. No credentials are stored in source control.

<details>
<summary><b>Environment variables</b></summary>

<br>

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `DB_ENVIRONMENT` | ✅ | `development` or `production` — scripts in `scripts/` refuse to write to production without it |
| `CRON_SECRET` | ✅ | Bearer token Vercel Cron presents to `/api/cron/cleanup-planned` |
| `NEXTAUTH_SECRET` | ✅ | Signs NextAuth JWTs; also read in middleware |
| `NEXTAUTH_URL` | ✅ | Canonical origin of the deployment |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Base URL used in metadata and email links |
| `EMAIL_PROVIDER` | ✅ | `resend` or `smtp` (defaults to `smtp`) |
| `EMAIL_FROM` | ✅ | Sender address on outbound mail |
| `RESEND_API_KEY` | Resend | API key from the Resend dashboard |
| `EMAIL_SERVER_HOST` `_PORT` `_USER` `_PASSWORD` | SMTP | SMTP credentials (TLS) |
| `ADMIN_EMAIL` | ➖ | Recipient of booking + cancellation notifications |
| `BUG_REPORT_EMAIL` | ➖ | Recipient of in-app bug reports |
| `SEED_ADMIN_EMAIL` | ➖ | Creates an admin account when seeding |
| `SEED_ADMIN_PASSWORD` | ➖ | Password for that account — set it per environment, never commit it |

The provider is resolved per request, so switching `EMAIL_PROVIDER` needs only a redeploy. Keep every value in `.env` locally and in the Vercel project settings in production — never in the repository.

</details>

<details>
<summary><b>Project structure</b></summary>

<br>

```
src/
├── app/
│   ├── [locale]/(auth)/    login, register, password reset, verification
│   ├── [locale]/(main)/    home, studio, rooms, prices, contact, booking, profile, admin
│   └── api/                bookings · auth · admin · profile · bug-report
├── components/
│   ├── booking/            availability grid, cells, date selector, summary
│   ├── admin/              tables, dialogs, phone-booking form
│   ├── common/             header, footer, page sections
│   └── ui/                 Radix-based primitives
├── lib/                    prisma, email, booking utils, metadata, constants
├── i18n/                   next-intl routing config
└── middleware.ts           locale routing · legacy redirects · admin guard
messages/                   hu.json · en.json
prisma/                     schema · migrations · seed
scripts/                    migration + maintenance tooling
```

</details>

## How Booking Works

```
PLANNED ──confirm──> VERIFIED ──cancel──> CANCELLED
   │                     ▲
   └──email link──> UNVERIFIED ──verify──┘
```

| Step | Endpoint | Effect |
| --- | --- | --- |
| Plan | `POST /api/bookings/plan` | Holds each selected slot, reclaiming holds that have lapsed |
| Cart | `GET /api/bookings/planned` | Every live hold for the signed-in user, on **every** date |
| Confirm | `POST /api/bookings/confirm` | Promotes the user's held slots, emails customer + admin |
| Verify | `POST /api/bookings/verify` | Resolves an emailed token, backed by an expiring record |
| Cancel | `POST /api/bookings/cancel` | Releases the slot and notifies both sides |

Availability is derived from `@@unique([date, time, roomId])` on the `Booking` model — the single source of truth. Opening hours live in [`src/lib/booking-utils.ts`](src/lib/booking-utils.ts).

### Cart holds

A `PLANNED` row is created the moment a visitor clicks a cell, so it is a **hold, not a booking**:

- it stops holding the slot after `PLANNED_HOLD_MINUTES` (30) — `GET /api/bookings` filters lapsed holds out and `plan` reclaims them;
- it is deleted for good after `PLANNED_DELETE_AFTER_MINUTES` (24 h) by the daily `/api/cron/cleanup-planned` job;
- it renders hatched and dashed in both grids, never as a solid block, so it cannot be mistaken for a confirmed booking.

The cart itself comes from `GET /api/bookings/planned` rather than from the rendered date window. Deriving it from the grid meant slots picked on other weeks silently dropped out of the order — the visitor got a success dialog and a confirmation email for only part of what they picked, and the rest sat in the table as a permanent yellow cell.

Both constants live in [`src/lib/booking-utils.ts`](src/lib/booking-utils.ts).

## Development database

There is no shared staging database. Before doing anything that writes, give
yourself a throwaway copy — Neon branches are instant and cost nothing to create.

```bash
# 1. Back up production first (read-only, writes to backups/)
npm run db:backup

# 2. Create a branch in the Neon console:
#    Project → Branches → New branch → from `production` → name it `dev`
#    Copy its pooled connection string.

# 3. Point your local .env at the branch, and say so explicitly
DATABASE_URL="postgresql://…ep-dev-branch….neon.tech/neondb?sslmode=require"
DB_ENVIRONMENT=development

# 4. Bring it up to date
npx prisma migrate deploy
```

`DB_ENVIRONMENT` is not decoration: [`scripts/db-guard.ts`](scripts/db-guard.ts) reads it, prints the
target before anything runs, and **refuses to write when it says `production`** unless
you pass `--allow-production`. Every script also prints the endpoint it is about to
touch, so a mistake is visible before it happens rather than after.

Neon keeps its own point-in-time history, so a branch can also be restored from a
timestamp — but that is a recovery tool, not a substitute for a dump you hold yourself.

## Scripts

```bash
npm run dev / build / start    # Next.js — build runs prisma generate first
npm run type-check / lint      # tsc --noEmit · next lint

npm run db:backup              # dump every table to backups/ (read-only)
npm run db:verify -- <file>    # check a dump against the live database
npm run db:restore -- <file>   # import a dump (blocked on production by default)

npm run cleanup:planned        # list abandoned cart holds; --confirm to delete
npm run cleanup:bookings       # inspect bookings, delete by explicit --ids
```

`cleanup:planned` is a dry run unless you pass `--confirm`, and it prints every row
it would remove with its customer and creation time — so a genuine stuck booking can
be told apart from an abandoned cart before anything is deleted.

Remaining utilities in [`scripts/`](scripts/) are run with `npx tsx`: `cleanup-failed-tokens`.

> [!CAUTION]
> `db:backup` writes a dump containing personal data. `backups/` is git-ignored — keep it that way, and store dumps somewhere access-controlled.

## Deployment

Hosted on Vercel. [`vercel.json`](vercel.json) pins the install to `--legacy-peer-deps --include=optional`, declares the daily cart-hold cleanup cron, and `npm run build` runs `prisma generate` before `next build`. Set the env vars above in the Vercel project — `CRON_SECRET` included, or the cron endpoint returns 503 and abandoned holds are never cleared — and run `npx prisma migrate deploy` against production whenever a migration ships.

<sub><b>Icon credits</b> — Palm Tree by Bohdan Burmich, palm leaf by Erika Carter, tiki torch by Adriano Emerick, all via the <a href="https://thenounproject.com/">Noun Project</a> (CC BY 3.0).</sub>

---

<div align="center"><sub>© Artist Factory · All rights reserved</sub></div>
