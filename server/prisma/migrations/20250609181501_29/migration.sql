/*
  Warnings:

  - You are about to drop the column `time` on the `Lyric` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `Lyric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lyric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lyric" DROP COLUMN "time",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timestamp" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
