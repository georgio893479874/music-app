import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLyricDto } from './dto/create-lyric.dto';
import { UpdateLyricDto } from './dto/update-lyric.dto';

@Injectable()
export class LyricService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLyricDto: CreateLyricDto) {
    return this.prisma.lyric.create({
      data: {
        text: createLyricDto.text,
        timestamp: createLyricDto.timestamp,
        trackId: createLyricDto.trackId,
      },
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
