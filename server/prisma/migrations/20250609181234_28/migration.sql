-- CreateTable
CREATE TABLE "Lyric" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "Lyric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lyric" ADD CONSTRAINT "Lyric_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
