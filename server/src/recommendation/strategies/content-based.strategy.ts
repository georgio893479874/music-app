import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContentBasedStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async generate(userId: string, limit: number) {
    const history = await this.prisma.listeningHistory.findMany({
      where: { userId },
      include: {
        track: {
          include: {
            album: {
              include: {
                genre: true,
                artist: true,
              },
            },
          },
        },
      },
    });

    const favoriteGenres = new Map<string, number>();
    const favoriteArtists = new Map<string, number>();

    for (const entry of history) {
      const genreId = entry.track.album.genreId;
      const artistId = entry.track.album.artistId;
      if (genreId) favoriteGenres.set(genreId, (favoriteGenres.get(genreId) || 0) + 1);
      if (artistId) favoriteArtists.set(artistId, (favoriteArtists.get(artistId) || 0) + 1);
    }

    const genreIds = [...favoriteGenres.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id]) => id);

    const artistIds = [...favoriteArtists.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id]) => id);

    return this.prisma.track.findMany({
      where: {
        album: {
          genreId: { in: genreIds },
          artistId: { in: artistIds },
        },
        ListeningHistory: { none: { userId } },
      },
      include: {
        album: {
          include: {
            genre: true,
            artist: true,
          },
        },
      },
      take: limit,
    });
  }
}