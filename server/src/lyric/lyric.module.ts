import { Module } from '@nestjs/common';
import { LyricService } from './lyric.service';
import { LyricController } from './lyric.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LyricController],
  providers: [LyricService],
  imports: [PrismaModule],
})
export class LyricModule {}
