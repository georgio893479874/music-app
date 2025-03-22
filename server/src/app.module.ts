import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';
import { PlaylistModule } from './playlist/playlist.module';
import { GenreModule } from './genre/genre.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    AlbumModule, 
    TrackModule, 
    PerformerModule, 
    PlaylistModule, 
    GenreModule, 
    RecommendationModule, 
    AuthModule, 
    PrismaModule, SearchModule,
  ],
})
export class AppModule {}
