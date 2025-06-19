-- CreateEnum
CREATE TYPE "AlbumType" AS ENUM ('ALBUM', 'SINGLE', 'EP');

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "type" "AlbumType" NOT NULL DEFAULT 'ALBUM';

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "Avatar" TEXT;
