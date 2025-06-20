import { Controller, Get, Query } from '@nestjs/common';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get('song')
  async getSong(@Query('title') title: string) {
    if (!title) return { error: 'title query is required' };
    const result = await this.importService.findSongWithAudio(title);
    if (!result) return { error: 'Song not found or audio unavailable' };
    return result;
  }
}