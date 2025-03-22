/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "coverUrl",
ADD COLUMN     "coverPhoto" TEXT;
