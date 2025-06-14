import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PodcastController],
  providers: [PodcastService],
  imports: [PrismaModule],
})
export class PodcastModule {}
