import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto & { audioFilePath: string }) {
    const track = await this.prisma.track.create({
      data: {
        title: createTrackDto.title,
        albumId: createTrackDto.albumId,
        audioFilePath: createTrackDto.audioFilePath,
        authorId: createTrackDto.authorId,
      },
    });
    return track;
  }

  async findAll(query: string) {
    return this.prisma.track.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.track.findUnique({
      where: { id },
      include: {
        album: {
          include: {
            artist: true,
          },
        },
        users: true,
        playlists: true,
        favorites: true,
        ListeningHistory: true,
      },
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
  }

  async remove(id: string) {
    return this.prisma.track.delete({
      where: { id },
    });
  }
}
