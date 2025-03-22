import { Injectable } from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { PerformerService } from 'src/performer/performer.service';
import { PlaylistService } from 'src/playlist/playlist.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly performerService: PerformerService,
    private readonly playlistService: PlaylistService,
  ) {}

  async search(query: string) {
    const tracks = await this.trackService.findAll(query);
    const albums = await this.albumService.findAll(query);
    const performers = await this.performerService.findAll(query);
    const playlists = await this.playlistService.findAll(query);

    return {
      tracks,
      albums,
      performers,
      playlists,
    };
  }
}
