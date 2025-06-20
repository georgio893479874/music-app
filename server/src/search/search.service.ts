import { Injectable } from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { PerformerService } from 'src/performer/performer.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { ImportService } from 'src/import/import.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly performerService: PerformerService,
    private readonly playlistService: PlaylistService,
    private readonly importService: ImportService,
  ) {}

  async search(query: string) {
    const [tracksFromDb, albums, performers, playlists, youtubeTracks] =
      await Promise.all([
        this.trackService.findAll(query),
        this.albumService.findAll(query),
        this.performerService.findAll(query),
        this.playlistService.findAll(query),
        this.importService.searchYoutubeTracks(query),
      ]);

    console.log('tracksFromDb', tracksFromDb);
    console.log('youtubeTracks', youtubeTracks);

    return {
      tracks: [...tracksFromDb, ...youtubeTracks],
      albums,
      performers,
      playlists,
    };
  }
}
