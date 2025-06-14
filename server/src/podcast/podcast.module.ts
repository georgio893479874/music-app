import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';

@Module({
  controllers: [PodcastController],
  providers: [PodcastService],
})
export class PodcastModule {}
