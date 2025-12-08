-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isOldUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastVerificationEmailSent" TIMESTAMP(3);
