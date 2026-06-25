/*
  Warnings:

  - Added the required column `coverUrl` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "coverUrl" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL;
