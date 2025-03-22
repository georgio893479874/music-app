import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('query') query: string) {
    if (!query) {
      return { tracks: [], albums: [], performers: [], playlists: [] };
    }
    return this.searchService.search(query);
  }
}
