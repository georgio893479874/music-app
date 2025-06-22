-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_genreId_fkey";

-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "genreId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
