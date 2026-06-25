-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "source" TEXT;

-- CreateIndex
CREATE INDEX "Track_externalId_source_idx" ON "Track"("externalId", "source");
