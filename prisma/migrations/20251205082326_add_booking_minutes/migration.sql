-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "endMinute" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startMinute" INTEGER NOT NULL DEFAULT 0;
