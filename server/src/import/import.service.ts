import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);
const ytSearch = require('yt-search');

@Injectable()
export class ImportService {
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

      return filtered.map((item) => ({
        id: `yt_${item.videoId}`,
        title: item.title,
        artistName: item.author.name || '',
        audioFilePath: `https://www.youtube.com/watch?v=${item.videoId}`,
        coverUrls: [
          `https://i.ytimg.com/vi/${item.videoId}/maxresdefault.jpg`,
          `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
          `https://i.ytimg.com/vi/${item.videoId}/default.jpg`,
        ],
        duration: item.seconds || 0,
        type: 'yt',
      }));
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
}
