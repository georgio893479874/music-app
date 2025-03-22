/*
  Warnings:

  - You are about to drop the column `coverPhoto` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "coverPhoto",
ADD COLUMN     "coverUrl" TEXT;
