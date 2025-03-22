import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports: [PrismaModule],
})
export class GenreModule {}
