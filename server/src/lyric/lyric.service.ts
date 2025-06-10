import { Injectable } from '@nestjs/common';
import { CreateLyricDto } from './dto/create-lyric.dto';
import { UpdateLyricDto } from './dto/update-lyric.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LyricService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLyricDto: CreateLyricDto) {
    const trackExists = await this.prisma.track.findUnique({
      where: { id: createLyricDto.trackId },
    });

    if (!trackExists) {
      throw new Error(`Track with ID ${createLyricDto.trackId} does not exist`);
    }

    return this.prisma.lyric.create({
      data: createLyricDto,
    });
  }

  async findAllByTrack(trackId: string) {
    return this.prisma.lyric.findMany({
      where: { trackId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.lyric.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateLyricDto: UpdateLyricDto) {
    return this.prisma.lyric.update({
      where: { id },
      data: updateLyricDto,
    });
  }

  async remove(id: string) {
    return this.prisma.lyric.delete({
      where: { id },
    });
  }
}
