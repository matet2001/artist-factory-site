-- AlterTable: add booking-level name fields so each booking stores its own name,
-- independent of the shared User record (fixes cross-booking name corruption bug)
ALTER TABLE "public"."bookings" ADD COLUMN "name" TEXT;
ALTER TABLE "public"."bookings" ADD COLUMN "bandName" TEXT;

-- Backfill existing bookings from their linked user
UPDATE "public"."bookings" b
SET "name" = u."name",
    "bandName" = u."bandName"
FROM "public"."users" u
WHERE b."userId" = u.id;
