import { Controller, Get, Post, Body, Query, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get('search')
  @Get('search/:query')
  async search(
    @Param('query') pathQuery?: string,
    @Query('query') query?: string,
    @Query('source') source: string = 'all',
  ) {
    const q = (pathQuery || query || '').toString().trim();

    if (!q) {
      return { error: 'query is required' };
    }

    return this.importService.searchAll(q, source);
  }

  @Post('track')
  async importTrack(
    @Body()
    body: {
      id: string;
      title: string;
      artist: string;
      duration?: number;
      coverUrl?: string;
      source: string; 
    },
  ) {
    return this.importService.importTrack(body);
  }

  @Get('track/:source/:id')
  async getExternalTrack(
    @Param('source') source: string,
    @Param('id') id: string,
  ) {
    return this.importService.getExternalTrackInfo(id, source);
  }

  @Get('proxy')
  async proxy(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new HttpException('url is required', HttpStatus.BAD_REQUEST);
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch (e) {
      throw new HttpException('invalid url', HttpStatus.BAD_REQUEST);
    }

    const allowed = ['archive.org', 'jamendo', 'deezer.com', 'cdn.jamendo.com', 'dzcdn.net'];
    const ok = allowed.some((a) => parsed.hostname.includes(a));
    if (!ok) {
      throw new HttpException('host not allowed', HttpStatus.FORBIDDEN);
    }

    try {
      const r = await (await import('axios')).default.get(url, { responseType: 'stream', timeout: 15000 });
      const contentType = r.headers['content-type'] || 'audio/mpeg';
      if (r.headers['content-length']) {
        res.setHeader('Content-Length', r.headers['content-length']);
      }
      res.setHeader('Content-Type', contentType);
      r.data.pipe(res);
    } catch (e) {
      throw new HttpException('failed to fetch remote audio', HttpStatus.BAD_GATEWAY);
    }
    return;
  }

  @Post('from-search')
  async importFromSearch(@Body('query') query: string) {
    if (!query) {
      return { error: 'query is required' };
    }

    return this.importService.importFromSearch(query);
  }

  @Post('artist')
  async importArtist(
    @Body('name') name: string,
  ) {
    if (!name) {
      return { error: 'artist name is required' };
    }
    return this.importService.importArtistByName(name);
  }

  @Post('ensure-artist')
  async ensureArtist(
    @Body() body: { name: string; coverUrl?: string },
  ) {
    const { name, coverUrl } = body || {};
    if (!name) return { error: 'artist name is required' };
    return this.importService.ensureArtistByName(name, coverUrl);
  }

  @Post('ensure-album')
  async ensureAlbum(
    @Body() body: { artistName: string; albumTitle: string; coverUrl?: string },
  ) {
    const { artistName, albumTitle, coverUrl } = body || {};
    if (!albumTitle) return { error: 'album title is required' };
    return this.importService.ensureAlbumForArtist(artistName, albumTitle, coverUrl);
  }
}