/*
  Warnings:

  - A unique constraint covering the columns `[email,trip_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "participants_email_trip_id_key" ON "participants"("email", "trip_id");
