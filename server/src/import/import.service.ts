import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as util from 'util';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

const execPromise = util.promisify(exec);
const ytSearch = require('yt-search');

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
        if (res.status === 200) {
          return url;
        }
      } catch (err) {
        console.error(err);
      }
    }
    return '/default-cover.jpg';
  }

  async searchYoutubeTracks(query: string) {
    try {
      const musicQuery = query + ' official audio';

      const res = await ytSearch(musicQuery);

      const filtered = (res.videos || []).filter((v) => {
        const title = v.title.toLowerCase();
        const author = v.author.name?.toLowerCase() || '';

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

        const includeWords = [
          'audio',
          'lyrics',
          'song',
          'track',
          'album',
          'official music video',
        ];
        if (author.includes('topic')) return true;
        if (includeWords.some((word) => title.includes(word))) return true;

        if (title.includes('official') || author.includes('official'))
          return true;

        return false;
      });

      const mapped = await Promise.all(
        filtered.map(async (item) => ({
          id: `yt_${item.videoId}`,
          title: item.title,
          artistName: item.author.name || '',
          audioFilePath: `https://www.youtube.com/watch?v=${item.videoId}`,
          coverImagePath: await this.getFirstAvailableCover(item.videoId),
          duration: item.seconds || 0,
          type: 'yt',
        })),
      );

      return mapped;
    } catch (e) {
      console.error('YouTube search error:', e);
      return [];
    }
  }

  async getYoutubeAudioStreamUrl(youtubeUrl: string): Promise<string | null> {
    try {
      const { stdout } = await execPromise(
        `yt-dlp -f bestaudio -g "${youtubeUrl}"`,
      );
      return stdout.trim();
    } catch (e) {
      return null;
    }
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

      return performers.map((item) => ({
        id: `yt_ch_${item.channelId}`,
        name: item.name,
        coverPhoto: item.avatar,
        type: 'yt_artist',
        subscribers: item.subCount,
        url: `https://www.youtube.com/channel/${item.channelId}`,
      }));
    } catch (e) {
      console.error('YouTube artist search error:', e);
      return [];
    }
  }
}
