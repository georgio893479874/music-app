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
}