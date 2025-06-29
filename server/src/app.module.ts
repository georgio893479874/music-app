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
import { FavoriteModule } from './favorite/favorite.module';
import { UserModule } from './user/user.module';
import { LyricModule } from './lyric/lyric.module';
import { UploadModule } from './upload/upload.module';
import { HistoryModule } from './history/history.module';
import { PodcastModule } from './podcast/podcast.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AlbumModule, 
    TrackModule, 
    PerformerModule, 
    PlaylistModule, 
    GenreModule, 
    RecommendationModule, 
    AuthModule, 
    PrismaModule, 
    SearchModule, 
    FavoriteModule, 
    UserModule, 
    LyricModule,
    UploadModule,
    HistoryModule,
    PodcastModule,
    ImportModule,
  ],
})
export class AppModule {}
