import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('source') source?: string,
  ) {
    if (!query) return { error: 'query is required' };
    if (!source || source === 'all') {
      const [ytTracks, scTracks, ytArtists] = await Promise.all([
        this.importService.searchYoutubeTracks(query),
        this.importService.searchSoundcloudTracks(query),
        this.importService.searchYoutubeArtists(query),
      ]);
      return {
        tracks: [...ytTracks, ...scTracks],
        performers: ytArtists,
      };
    }
    if (source === 'youtube') {
      const [ytTracks, ytArtists] = await Promise.all([
        this.importService.searchYoutubeTracks(query),
        this.importService.searchYoutubeArtists(query),
      ]);
      return {
        tracks: ytTracks,
        performers: ytArtists,
      };
    }
    if (source === 'soundcloud') {
      const scTracks = await this.importService.searchSoundcloudTracks(query);
      return { tracks: scTracks, performers: [] };
    }

    return { error: 'Not implemented for local search in import controller.' };
  }

  @Post('artist')
  async importArtist(@Body('youtubeChannelId') channelId: string) {
    return this.importService.importYoutubeArtist(channelId);
  }

  @Post('playlist')
  async importPlaylist(
    @Body()
    body: {
      name: string;
      userId: string;
      coverPhoto?: string;
      trackMetas: Array<{
        title: string;
        artistName: string;
        audioFilePath: string;
        coverImagePath?: string;
      }>;
    },
  ) {
    return this.importService.importPlaylist(body);
  }

  @Get('audio')
  async getAudio(@Query('url') url: string) {
    if (!url) return { streamUrl: null };
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const streamUrl = await this.importService.getYoutubeAudioStreamUrl(url);
      return { streamUrl };
    }
    if (url.includes('soundcloud.com')) {
      const streamUrl =
        await this.importService.getSoundcloudAudioStreamUrl(url);
      return { streamUrl };
    }
    return { streamUrl: null };
  }
}
