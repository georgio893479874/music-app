import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post()
  create(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.create(createPodcastDto);
  }

  @Get()
  findAll() {
    return this.podcastService.findAll();
  }

  @Get('search')
  searchArchive(@Query('query') query: string) {
    const q = (query || '').trim();
    if (!q) {
      return [];
    }

    return this.podcastService.searchArchive(q);
  }

  @Post('import-from-archive')
  importFromArchive(@Body('query') query: string) {
    const q = (query || '').trim();
    if (!q) {
      return { error: 'query is required' };
    }

    return this.podcastService.importFromArchive(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePodcastDto: UpdatePodcastDto,
  ) {
    return this.podcastService.update(id, updatePodcastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastService.remove(id);
  }
}
