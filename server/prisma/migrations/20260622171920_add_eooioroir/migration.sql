-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_albumId_fkey";

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "albumId" DROP NOT NULL,
ALTER COLUMN "audioFilePath" DROP NOT NULL,
ALTER COLUMN "coverUrl" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;
