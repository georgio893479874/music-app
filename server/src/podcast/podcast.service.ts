import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Injectable()
export class PodcastService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePodcastDto) {
    return this.prisma.podcast.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.podcast.findMany({
      include: {
        episodes: true,
        host: true,
      },
    });
  }

  async findOne(id: string) {
    const podcast = await this.prisma.podcast.findUnique({
      where: { id },
      include: {
        episodes: true,
        host: true,
      },
    });

    if (!podcast) throw new NotFoundException(`Podcast #${id} not found`);
    return podcast;
  }

  async update(id: string, dto: UpdatePodcastDto) {
    await this.findOne(id);

    return this.prisma.podcast.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.podcast.delete({
      where: { id },
    });
  }
}
