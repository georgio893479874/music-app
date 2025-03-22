/*
  Warnings:

  - Added the required column `coverImagePath` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audioFilePath` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImagePath` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "coverImagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "audioFilePath" TEXT NOT NULL,
ADD COLUMN     "coverImagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastname" DROP NOT NULL;
