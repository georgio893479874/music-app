import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);

@Injectable()
export class ImportService {
  private readonly YOUTUBE_API_KEY = 'AIzaSyDttLUOo-QIW2nP2tAnDwYCJKCVk8heee0';

  async findSongWithAudio(title: string) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
      title
    )}&key=${this.YOUTUBE_API_KEY}`;
    const response = await axios.get(searchUrl);
    const item = response.data.items[0];
    if (!item) return null;

    const videoId = item.id.videoId;
    const videoTitle = item.snippet.title;
    const channel = item.snippet.channelTitle;
    const thumbnail = item.snippet.thumbnails.high.url;
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const audioUrl = await this.getYoutubeAudioStreamUrl(youtubeUrl);

    if (!audioUrl) return null;

    return {
      title: videoTitle,
      artist: channel,
      youtubeUrl,
      audioUrl,
      thumbnail,
    };
  }

  private async getYoutubeAudioStreamUrl(youtubeUrl: string): Promise<string | null> {
    try {
      const { stdout } = await execPromise(
        `yt-dlp -f bestaudio -g "${youtubeUrl}"`
      );
      return stdout.trim();
    } catch (e) {
      return null;
    }
  }
}