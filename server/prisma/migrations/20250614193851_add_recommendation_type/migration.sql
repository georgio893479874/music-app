/*
  Warnings:

  - Added the required column `type` to the `Recommendation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('MADE_FOR_YOU', 'DISCOVERY', 'NEW_MUSIC');

-- AlterTable
ALTER TABLE "Recommendation" ADD COLUMN     "type" "RecommendationType" NOT NULL;
