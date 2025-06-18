import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecommendationType } from '@prisma/client';
import { subDays, startOfDay } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRecommendationsForUser(userId: string, type?: string) {
    return this.prisma.recommendation.findMany({
      where: {
        userId,
        ...(type ? { type: type as RecommendationType } : {}),
        createdAt: {
          gte: startOfDay(new Date()),
        },
      },
      include: {
        track: {
          include: {
            album: { include: { artist: true, genre: true } },
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLatestTracksForUser(userId: string) {
    const userHistory = await this.prisma.listeningHistory.findMany({
      where: { userId },
      include: { track: { include: { album: true, author: true } } },
      orderBy: { listenedAt: 'desc' },
      take: 100,
    });
    const favoriteGenres = await this.getUserFavoriteGenres(
      userId,
      userHistory,
    );
    const favoriteArtists = await this.getUserFavoriteArtists(
      userId,
      userHistory,
    );

    const newAlbums = await this.prisma.album.findMany({
      where: {
        OR: [
          { genreId: { in: favoriteGenres } },
          { artistId: { in: favoriteArtists } },
        ],
        releaseDate: { gte: subDays(new Date(), 30) },
      },
      orderBy: { releaseDate: 'desc' },
      take: 8,
      include: { artist: true },
    });

    const newAlbumIds = newAlbums.map((a) => a.id);

    const latestTracks = await this.prisma.track.findMany({
      where: {
        OR: [
          { albumId: { in: newAlbumIds } },
          { album: { genreId: { in: favoriteGenres } } },
          { authorId: { in: favoriteArtists } },
        ],
      },
      include: { album: { include: { artist: true } }, author: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    const weekAgo = subDays(new Date(), 7);
    const popularTracksRaw = await this.prisma.listeningHistory.groupBy({
      by: ['trackId'],
      where: { listenedAt: { gte: weekAgo } },
      _count: { trackId: true },
      orderBy: { _count: { trackId: 'desc' } },
      take: 10,
    });
    const popularTrackIds = popularTracksRaw.map((x) => x.trackId);

    const popularTracks = await this.prisma.track.findMany({
      where: { id: { in: popularTrackIds } },
      include: { album: { include: { artist: true } }, author: true },
    });

    const trackMap = new Map<string, any>();
    [...latestTracks, ...popularTracks].forEach((t) => trackMap.set(t.id, t));
    return Array.from(trackMap.values()).slice(0, 8);
  }

  async getRecommendedAlbumsForUser(userId: string) {
    const userHistory = await this.prisma.listeningHistory.findMany({
      where: { userId },
      include: { track: { include: { album: true, author: true } } },
      orderBy: { listenedAt: 'desc' },
      take: 100,
    });
    const favoriteGenres = await this.getUserFavoriteGenres(
      userId,
      userHistory,
    );
    const favoriteArtists = await this.getUserFavoriteArtists(
      userId,
      userHistory,
    );

    const newAlbums = await this.prisma.album.findMany({
      where: {
        OR: [
          { genreId: { in: favoriteGenres } },
          { artistId: { in: favoriteArtists } },
        ],
        releaseDate: { gte: subDays(new Date(), 30) },
      },
      orderBy: { releaseDate: 'desc' },
      include: { artist: true },
      take: 8,
    });

    const weekAgo = subDays(new Date(), 7);
    const albumsWithListens = await this.prisma.album.findMany({
      where: {},
      include: {
        artist: true,
        tracks: {
          include: {
            ListeningHistory: {
              where: { listenedAt: { gte: weekAgo } },
            },
          },
        },
      },
      take: 16,
    });

    const popularAlbums = albumsWithListens
      .map((album) => ({
        ...album,
        listenCount: album.tracks.reduce(
          (acc, tr) => acc + tr.ListeningHistory.length,
          0,
        ),
      }))
      .sort((a, b) => b.listenCount - a.listenCount)
      .slice(0, 8);

    const albumMap = new Map<string, any>();
    [...newAlbums, ...popularAlbums].forEach((a) => albumMap.set(a.id, a));
    return Array.from(albumMap.values()).slice(0, 8);
  }

  async getPopularPlaylistsForUser(userId: string) {
    const playlists = await this.prisma.playlist.findMany({
      where: { access: 'PUBLIC' },
      include: {
        tracks: {
          include: {
            ListeningHistory: true,
          },
        },
        user: true,
      },
      take: 24,
    });

    const playlistsWithListens = playlists.map((playlist) => ({
      ...playlist,
      listenCount: playlist.tracks.reduce(
        (acc, tr) => acc + tr.ListeningHistory.length,
        0,
      ),
    }));
    playlistsWithListens.sort((a, b) => b.listenCount - a.listenCount);

    return playlistsWithListens.slice(0, 8);
  }

  async getPopularArtistsForUser(userId: string) {
    const monthAgo = subDays(new Date(), 30);
    const artists = await this.prisma.artist.findMany({
      include: {
        Track: {
          include: {
            ListeningHistory: {
              where: { listenedAt: { gte: monthAgo } },
            },
          },
        },
      },
      take: 24,
    });

    const artistsWithListens = artists.map((artist) => ({
      ...artist,
      listenCount: artist.Track.reduce(
        (acc, tr) => acc + tr.ListeningHistory.length,
        0,
      ),
    }));

    return artistsWithListens
      .sort((a, b) => b.listenCount - a.listenCount)
      .slice(0, 8);
  }

  async getMostPopularArtist() {
    const monthAgo = subDays(new Date(), 30);
    const artists = await this.prisma.artist.findMany({
      include: {
        Track: {
          include: {
            ListeningHistory: {
              where: { listenedAt: { gte: monthAgo } },
            },
          },
        },
      },
      take: 18,
    });

    let best = null;
    let max = 0;
    for (const artist of artists) {
      const count = artist.Track.reduce(
        (acc, tr) => acc + tr.ListeningHistory.length,
        0,
      );
      if (count > max) {
        max = count;
        best = artist;
      }
    }
    return best;
  }

  async getGlobalRecommendations(type?: string) {
    return this.prisma.recommendation.findMany({
      where: {
        ...(type ? { type: type as RecommendationType } : {}),
        createdAt: {
          gte: startOfDay(new Date()),
        },
      },
      include: {
        track: {
          include: {
            album: { include: { artist: true, genre: true } },
            author: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateAllRecommendations() {
    this.logger.log('Generating recommendations for all users...');
    const users = await this.prisma.user.findMany();
    for (const user of users) {
      await this.generateForUser(user.id);
    }
    this.logger.log('Daily recommendations updated');
  }

  async generateForUser(userId: string) {
    await this.prisma.recommendation.deleteMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay(new Date()),
        },
      },
    });

    const history = await this.prisma.listeningHistory.findMany({
      where: { userId },
      include: { track: { include: { album: true, author: true } } },
      orderBy: { listenedAt: 'desc' },
      take: 100,
    });

    const favoriteGenres = await this.getUserFavoriteGenres(userId, history);
    const favoriteArtists = await this.getUserFavoriteArtists(userId, history);
    const topTracks = await this.getUserTopTracks(userId, history);
    const discoveryTracks = await this.getDiscoveryTracks(
      userId,
      favoriteGenres,
      favoriteArtists,
      topTracks,
    );
    const madeForYouTracks = await this.getMadeForYouTracks(
      userId,
      favoriteGenres,
      favoriteArtists,
      topTracks,
    );
    const newMusicTracks = await this.getNewMusicTracks(
      favoriteGenres,
      favoriteArtists,
    );

    await Promise.all([
      ...discoveryTracks.map((track) =>
        this.prisma.recommendation.create({
          data: {
            userId,
            trackId: track.id,
            type: RecommendationType.DISCOVERY,
          },
        }),
      ),
      ...madeForYouTracks.map((track) =>
        this.prisma.recommendation.create({
          data: {
            userId,
            trackId: track.id,
            type: RecommendationType.MADE_FOR_YOU,
          },
        }),
      ),
      ...newMusicTracks.map((track) =>
        this.prisma.recommendation.create({
          data: {
            userId,
            trackId: track.id,
            type: RecommendationType.NEW_MUSIC,
          },
        }),
      ),
    ]);
  }

  private async getUserFavoriteGenres(userId: string, history: any[]) {
    const genreCount: Record<string, number> = {};
    for (const item of history) {
      const genreId = item.track.album.genreId;
      if (genreId) genreCount[genreId] = (genreCount[genreId] || 0) + 1;
    }
    const topGenreIds = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .map(([genreId]) => genreId)
      .slice(0, 3);
    return topGenreIds;
  }

  private async getUserFavoriteArtists(userId: string, history: any[]) {
    const artistCount: Record<string, number> = {};
    for (const item of history) {
      const artistId = item.track.authorId || item.track.album.artistId;
      if (artistId) artistCount[artistId] = (artistCount[artistId] || 0) + 1;
    }
    const topArtistIds = Object.entries(artistCount)
      .sort((a, b) => b[1] - a[1])
      .map(([artistId]) => artistId)
      .slice(0, 3);
    return topArtistIds;
  }

  private async getUserTopTracks(userId: string, history: any[]) {
    const trackCount: Record<string, number> = {};
    for (const item of history) {
      const trackId = item.trackId;
      if (trackId) trackCount[trackId] = (trackCount[trackId] || 0) + 1;
    }
    const topTrackIds = Object.entries(trackCount)
      .sort((a, b) => b[1] - a[1])
      .map(([trackId]) => trackId)
      .slice(0, 10);
    const tracks = await this.prisma.track.findMany({
      where: { id: { in: topTrackIds } },
      include: { album: true, author: true },
    });
    return tracks;
  }

  private async getDiscoveryTracks(
    userId: string,
    favoriteGenres: string[],
    favoriteArtists: string[],
    topTracks: any[],
  ) {
    const recentIds = topTracks.map((t) => t.id);
    const tracks = await this.prisma.track.findMany({
      where: {
        id: { notIn: recentIds },
        OR: [
          { album: { genreId: { in: favoriteGenres } } },
          { authorId: { in: favoriteArtists } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { album: true, author: true },
    });
    return tracks;
  }

  private async getMadeForYouTracks(
    userId: string,
    favoriteGenres: string[],
    favoriteArtists: string[],
    topTracks: any[],
  ) {
    const favorited = await this.prisma.favorite.findMany({
      where: { userId },
      select: { trackId: true },
    });
    const listenedIds = topTracks.map((t) => t.id);
    const favoriteIds = favorited.map((fav) => fav.trackId);
    const tracks = await this.prisma.track.findMany({
      where: {
        id: { notIn: [...listenedIds, ...favoriteIds] },
        OR: [
          { album: { genreId: { in: favoriteGenres } } },
          { authorId: { in: favoriteArtists } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { album: true, author: true },
    });
    return tracks;
  }

  private async getNewMusicTracks(
    favoriteGenres: string[],
    favoriteArtists: string[],
  ) {
    const newAlbums = await this.prisma.album.findMany({
      where: {
        OR: [
          { genreId: { in: favoriteGenres } },
          { artistId: { in: favoriteArtists } },
        ],
        releaseDate: { gte: subDays(new Date(), 30) },
      },
      orderBy: { releaseDate: 'desc' },
      take: 5,
    });
    const tracks = await this.prisma.track.findMany({
      where: { albumId: { in: newAlbums.map((a) => a.id) } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { album: true, author: true },
    });
    return tracks;
  }
}
