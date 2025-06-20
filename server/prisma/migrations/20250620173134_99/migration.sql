/*
  Warnings:

  - A unique constraint covering the columns `[audioFilePath]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Track_audioFilePath_key" ON "Track"("audioFilePath");
