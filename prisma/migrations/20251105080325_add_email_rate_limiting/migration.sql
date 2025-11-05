-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailSentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastEmailSent" TIMESTAMP(3);
