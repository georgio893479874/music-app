import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
    const [tracks, performers] = await Promise.all([
      this.importService.searchYoutubeTracks(query),
      this.importService.searchYoutubeArtists(query),
    ]);

    return {
      tracks,
      performers,
    };
  }

  @Post('artist')
  async importArtist(@Body('youtubeChannelId') channelId: string) {
    return this.importService.importYoutubeArtist(channelId);
  }
}
