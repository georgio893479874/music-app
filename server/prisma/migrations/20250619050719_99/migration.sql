/*
  Warnings:

  - You are about to drop the column `Avatar` on the `Artist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "Avatar",
ADD COLUMN     "avatar" TEXT;
