# Artist Factory — Studio Booking Platform

Full-stack booking platform for a music production studio. Built with **Next.js 15**, **TypeScript**, **Prisma + PostgreSQL**, and **NextAuth**.

**Live:** [artistfactory.hu](https://artistfactory.hu)

## Features

- **Room booking** — browse rooms, pick date/time slots (half-hour granularity), email-verified confirmation
- **Auth** — register, email verification, forgot/reset password
- **Admin panel** — manage bookings and users, role-based access
- **Bilingual** — Hungarian and English (next-intl)

## Running Locally

```bash
npm install
```

Create a `.env` file — see `.env.example` for required keys (database URL, auth secret, email provider).

```bash
npx prisma migrate deploy   # apply DB migrations
npx prisma db seed          # seed rooms + admin user
npm run dev                 # http://localhost:3000
```

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Prisma · Neon PostgreSQL · NextAuth · Zod · Radix UI · next-intl · Vercel
