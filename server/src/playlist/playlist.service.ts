import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlaylistDto: CreatePlaylistDto) {
    return this.prisma.playlist.create({
      data: {
        name: createPlaylistDto.name,
        user: {
          connect: {
            id: createPlaylistDto.userId,
          },
        },
      },
    });
  }

  async findAll(query: string) {
    return this.prisma.playlist.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.playlist.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    return this.prisma.playlist.update({
      where: {
        id: id,
      },
      data: {
        name: updatePlaylistDto.name,
      },
    });
  }

  remove(id: string) {
    return this.prisma.playlist.delete({
      where: {
        id: id,
      },
    });
  }
}
