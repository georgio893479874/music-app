/*
  Warnings:

  - Made the column `coverPhoto` on table `Playlist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "coverPhoto" SET NOT NULL;
