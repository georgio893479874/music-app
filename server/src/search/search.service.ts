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

  async search(query: string, source: string = 'all') {
    const [youtubeTracks, youtubeArtists] = await Promise.all([
      this.importService.searchYoutubeTracks(query),
      this.importService.searchYoutubeArtists(query),
    ]);

    const [tracksFromDb, albums, performers, playlists] = await Promise.all([
      this.trackService.findAll(query),
      this.albumService.findAll(query),
      this.performerService.findAll(query),
      this.playlistService.findAll(query),
    ]);

    if (source === 'all' || !source) {
      return {
        tracks: [...tracksFromDb, ...youtubeTracks],
        albums,
        performers: [...performers, ...youtubeArtists],
        playlists,
      };
    }

    if (source === 'local') {
      return {
        tracks: tracksFromDb,
        albums,
        performers,
        playlists,
      };
    }

    if (source === 'youtube') {
      return {
        tracks: youtubeTracks,
        albums: [],
        performers: youtubeArtists,
        playlists: [],
      };
    }

    return {
      tracks: [...tracksFromDb, ...youtubeTracks],
      albums,
      performers: [...performers, ...youtubeArtists],
      playlists,
    };
  }
}
