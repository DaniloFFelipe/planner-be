-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT;
