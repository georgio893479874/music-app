import { Controller, Get, Query } from '@nestjs/common';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get('audio')
  async getAudio(@Query('url') url: string) {
    if (!url) return { error: 'url query is required' };
    const streamUrl = await this.importService.getYoutubeAudioStreamUrl(url);
    if (!streamUrl) return { error: 'Audio not available' };
    return { streamUrl };
  }

  @Get('search')
  async search(@Query('query') query: string) {
    if (!query) return { error: 'query is required' };

    // Пошук треків та артистів
    const [tracks, performers] = await Promise.all([
      this.importService.searchYoutubeTracks(query),
      this.importService.searchYoutubeArtists(query)
    ]);

    // Можеш додати альбоми, плейлисти, якщо потрібно

    return {
      tracks,
      performers
      // albums, playlists...
    };
  }
}