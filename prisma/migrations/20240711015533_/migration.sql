/*
  Warnings:

  - You are about to drop the column `email` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `is_confirmed` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `participants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,trip_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "participants_email_trip_id_key";

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "email",
DROP COLUMN "is_confirmed",
DROP COLUMN "name",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invites_email_trip_id_key" ON "invites"("email", "trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "participants_user_id_trip_id_key" ON "participants"("user_id", "trip_id");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
