import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import * as util from 'util';
import axios from 'axios';
const ytSearch = require('yt-search');
const soundcloud = require('soundcloud-scraper');

const execPromise = util.promisify(exec);
const YT_COVER_BASE = 'https://i.ytimg.com/vi';

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}

  async getFirstAvailableCover(videoId: string): Promise<string> {
    const covers = [
      `${YT_COVER_BASE}/${videoId}/maxresdefault.jpg`,
      `${YT_COVER_BASE}/${videoId}/hqdefault.jpg`,
      `${YT_COVER_BASE}/${videoId}/default.jpg`,
    ];
    for (const url of covers) {
      try {
        const res = await axios.head(url, { timeout: 2000 });
        if (res.status === 200) return url;
      } catch {}
    }
    return '/default-cover.jpg';
  }

  async searchYoutubeArtists(query: string) {
    try {
      const res = await ytSearch({ query, type: 'channel' });
      const performers = (res.channels || []).filter(
        (ch: { name: string; subCount: number }) => {
          const name = ch.name?.toLowerCase() || '';
          return name.includes(query.toLowerCase()) || ch.subCount > 1000;
        },
      );
      return performers.map((item, idx) => ({
        id: item.channelId
          ? `yt_ch_${item.channelId}`
          : `yt_ch_${item.name.replace(/\W/g, '')}_${idx}`,
        name: item.name,
        coverPhoto:
          item.avatar || item.image || item.thumbnail || '/default-cover.jpg',
        type: 'yt_artist',
        subscribers: item.subCount,
        url: item.channelId
          ? `https://www.youtube.com/channel/${item.channelId}`
          : '',
      }));
    } catch (e) {
      console.error('YouTube artist search error:', e);
      return [];
    }
  }

  async getYoutubeAudioStreamUrl(youtubeUrl: string): Promise<string | null> {
    try {
      const { stdout } = await execPromise(
        `yt-dlp -f bestaudio -g "${youtubeUrl}"`,
      );
      return stdout.trim();
    } catch {
      return null;
    }
  }

  async getSoundcloudAudioStreamUrl(trackUrl: string): Promise<string | null> {
    try {
      const client = new soundcloud.Client();
      const track = await client.getSongInfo(trackUrl);
      return track.downloadable ? track.downloadURL : track.streamURL;
    } catch {
      return null;
    }
  }

  async importTrack(meta: {
    title: string;
    artistName: string;
    audioFilePath: string;
    coverImagePath?: string;
    albumTitle?: string;
    source?: string;
  }) {
    let artist = await this.prisma.artist.findFirst({
      where: { name: meta.artistName },
    });
    if (!artist) {
      artist = await this.prisma.artist.create({
        data: {
          id: uuidv4(),
          name: meta.artistName,
          coverPhoto: meta.coverImagePath || '/default-cover.jpg',
        },
      });
    }

    const finalAlbumTitle = meta.albumTitle || 'Single';
    let album = await this.prisma.album.findFirst({
      where: {
        artistId: artist.id,
        title: finalAlbumTitle,
      },
    });
    if (!album) {
      album = await this.prisma.album.create({
        data: {
          id: uuidv4(),
          title: finalAlbumTitle,
          artistId: artist.id,
          coverUrl: meta.coverImagePath || '/default-cover.jpg',
          releaseDate: new Date(),
          type: 'ALBUM',
        },
      });
    }

    let track = await this.prisma.track.findUnique({
      where: { audioFilePath: meta.audioFilePath },
    });

    if (!track) {
      track = await this.prisma.track.create({
        data: {
          id: uuidv4(),
          title: meta.title,
          audioFilePath: meta.audioFilePath,
          albumId: album.id,
          authorId: artist.id,
        },
      });
    }
    return track;
  }

  async searchYoutubeTracks(query: string) {
    try {
      const musicQuery = query + ' official audio';
      const res = await ytSearch(musicQuery);
      const filtered = (res.videos || []).filter((v) => {
        const title = v.title.toLowerCase();
        const excludeWords = [
          'live',
          'cover',
          'karaoke',
          'remix',
          'instrumental',
          'reaction',
          'tribute',
          'edit',
          'concert',
          'performance',
        ];
        if (excludeWords.some((word) => title.includes(word))) return false;
        if (v.seconds < 60 || v.seconds > 600) return false;
        return true;
      });

      const mapped = await Promise.all(
        filtered.map(async (item) => {
          const artistName = item.author.name || 'Unknown Artist';
          const albumTitle = item.albumTitle || 'Single';
          const track = await this.importTrack({
            title: item.title,
            artistName,
            audioFilePath: `https://www.youtube.com/watch?v=${item.videoId}`,
            albumTitle,
            coverImagePath: await this.getFirstAvailableCover(item.videoId),
            source: 'yt',
          });
          return {
            ...track,
            coverImagePath: await this.getFirstAvailableCover(item.videoId),
            type: 'yt',
            duration: item.seconds,
            artistName,
          };
        }),
      );
      return mapped;
    } catch (e) {
      console.error('YouTube search error:', e);
      return [];
    }
  }

  async searchSoundcloudTracks(query: string) {
    try {
      const client = new soundcloud.Client();
      const results = await client.search(query, 'track');
      const tracks = await Promise.all(
        results.slice(0, 10).map(async (item: any) => {
          const artistName =
            item.author?.name || item.user?.username || 'Unknown Artist';
          const albumTitle = item.albumTitle || 'Single';
          const track = await this.importTrack({
            title: item.title,
            artistName,
            audioFilePath: item.url,
            albumTitle,
            coverImagePath: item.thumbnail || '/default-cover.jpg',
            source: 'sc',
          });
          return {
            ...track,
            coverImagePath: item.thumbnail,
            type: 'sc',
            duration: item.duration / 1000,
            artistName,
          };
        }),
      );
      return tracks;
    } catch (e) {
      console.error('SoundCloud search error:', e);
      return [];
    }
  }

  async importYoutubeArtist(channelId: string) {
    let ytArtist = null;
    try {
      const res = await ytSearch({ query: channelId, type: 'channel' });
      ytArtist = (res.channels || [])[0] || null;
    } catch {
      ytArtist = null;
    }

    if (!ytArtist || !ytArtist.name) {
      return null;
    }
    let artist = await this.prisma.artist.findUnique({
      where: { name: ytArtist.name },
    });
    if (!artist) {
      artist = await this.prisma.artist.create({
        data: {
          id: uuidv4(),
          name: ytArtist.name,
          coverPhoto:
            ytArtist.avatar ||
            ytArtist.image ||
            ytArtist.thumbnail ||
            '/default-cover.jpg',
        },
      });
    }

    try {
      const playlistsRes = await ytSearch({
        query: ytArtist.name,
        type: 'playlist',
      });
      const artistPlaylists = (playlistsRes.playlists || []).filter(
        (pl) =>
          pl.author?.name === ytArtist.name &&
          (pl.title.toLowerCase().includes('album') ||
            pl.title.toLowerCase().includes('lp') ||
            pl.title.toLowerCase().includes('ep')),
      );

      for (const playlist of artistPlaylists) {
        let album = await this.prisma.album.findFirst({
          where: {
            artistId: artist.id,
            title: playlist.title,
          },
        });
        if (!album) {
          album = await this.prisma.album.create({
            data: {
              id: uuidv4(),
              title: playlist.title,
              artistId: artist.id,
              coverUrl: playlist.thumbnail || '/default-cover.jpg',
              type: 'ALBUM',
              releaseDate: new Date(),
              genreId: null,
            },
          });
        }

        const playlistDetails = await ytSearch({ listId: playlist.listId });
        for (const video of playlistDetails.videos || []) {
          const exists = await this.prisma.track.findFirst({
            where: {
              title: video.title,
              albumId: album.id,
            },
          });
          if (!exists) {
            await this.prisma.track.create({
              data: {
                id: uuidv4(),
                title: video.title,
                albumId: album.id,
                authorId: artist.id,
                audioFilePath: `https://www.youtube.com/watch?v=${video.videoId}`,
              },
            });
          }
        }
      }
    } catch (e) {}

    return await this.prisma.artist.findUnique({
      where: { id: artist.id },
      include: { albums: { include: { tracks: true } } },
    });
  }

  async importPlaylist(meta: {
    name: string;
    userId: string;
    coverPhoto?: string;
    trackMetas: Array<{
      title: string;
      artistName: string;
      audioFilePath: string;
      coverImagePath?: string;
      albumTitle?: string;
    }>;
  }) {
    let playlist = await this.prisma.playlist.findFirst({
      where: { name: meta.name, userId: meta.userId },
    });
    if (!playlist) {
      playlist = await this.prisma.playlist.create({
        data: {
          id: uuidv4(),
          name: meta.name,
          userId: meta.userId,
          coverPhoto: meta.coverPhoto || '/default-cover.jpg',
        },
      });
    }
    for (const trackMeta of meta.trackMetas) {
      const track = await this.importTrack({
        ...trackMeta,
        albumTitle: trackMeta.albumTitle || 'Single',
      });
      await this.prisma.playlist.update({
        where: { id: playlist.id },
        data: {
          tracks: { connect: { id: track.id } },
        },
      });
    }
    return await this.prisma.playlist.findUnique({
      where: { id: playlist.id },
      include: { tracks: true },
    });
  }
}
