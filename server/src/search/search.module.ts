import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { PerformerService } from 'src/performer/performer.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { SearchController } from './search.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SearchController],
  imports: [PrismaModule],
  providers: [
    SearchService,
    TrackService,
    AlbumService,
    PerformerService,
    PlaylistService,
  ],
})
export class SearchModule {}
