-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "coverUrl" TEXT,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastEpisode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audioFilePath" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "podcastId" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverImagePath" TEXT,

    CONSTRAINT "PodcastEpisode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastEpisode" ADD CONSTRAINT "PodcastEpisode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
