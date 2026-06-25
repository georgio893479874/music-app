import { Injectable, Logger } from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { PerformerService } from 'src/performer/performer.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { ImportService } from 'src/import/import.service';
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly performerService: PerformerService,
    private readonly playlistService: PlaylistService,
    private readonly importService: ImportService,
  ) {}

  async search(query: string, source: string = 'all') {
  const external = await this.importService.searchAll(query, source);

  if (external && (external.tracks?.length || external.albums?.length || external.performers?.length)) {
    this.importService
      .importAllFromSearch(query, source)
      .then((res) => this.logger.log(`Background import completed for query: ${query} (artists:${res.artists} albums:${res.albums} tracks:${res.tracks})`))
      .catch((err) => this.logger.warn(`Background import failed for query "${query}": ${err?.message || err}`));
  }

  const [tracksFromDb, albums, performers, playlists] =
    await Promise.all([
      this.trackService.findAll(query),
      this.albumService.findAll(query),
      this.performerService.findAll(query),
      this.playlistService.findAll(query),
    ]);

  if (source === 'local') {
    return {
      tracks: tracksFromDb,
      albums,
      performers,
      playlists,
    };
  }

  if (source === 'external') {
    return {
      tracks: external.tracks,
      albums: external.albums || [],
      performers: external.performers || [],
      playlists: [],
    };
  }

  return {
    tracks: [...tracksFromDb, ...(external.tracks || [])],
    albums: [...albums, ...(external.albums || [])],
    performers: [
      ...performers,
      ...(external.performers || []),
    ],
    playlists,
  };
}
}
