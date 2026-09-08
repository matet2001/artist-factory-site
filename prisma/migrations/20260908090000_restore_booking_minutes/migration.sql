-- 20251205165300_remove_booking_minutes dropped these two columns, but
-- schema.prisma still declares them and every deployed database has them — they
-- were put back by hand, without a migration. Replaying the history onto a fresh
-- database therefore built a schema the application cannot run against, and
-- `prisma migrate dev` would have offered to drop them again.
--
-- IF NOT EXISTS makes this a no-op anywhere the columns were already restored,
-- which is every existing environment.
ALTER TABLE "public"."bookings" ADD COLUMN IF NOT EXISTS "startMinute" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "public"."bookings" ADD COLUMN IF NOT EXISTS "endMinute" INTEGER NOT NULL DEFAULT 0;
