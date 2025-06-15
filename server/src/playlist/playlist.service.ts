import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTrackDto } from './dto/add-track.dto';
import { RemoveTrackDto } from './dto/remove-track.dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlaylistDto: CreatePlaylistDto) {
  return this.prisma.playlist.create({
    data: {
      name: createPlaylistDto.name,
      coverPhoto: createPlaylistDto.coverPhoto,
      user: {
        connect: {
          id: createPlaylistDto.userId,
        },
      },
    },
  });
}

  async addTrack(dto: AddTrackDto) {
    return this.prisma.playlist.update({
      where: { id: dto.playlistId },
      data: {
        tracks: {
          connect: { id: dto.trackId },
        },
      },
      include: { tracks: true },
    });
  }

  async removeTrack(dto: RemoveTrackDto) {
    return this.prisma.playlist.update({
      where: { id: dto.playlistId },
      data: {
        tracks: {
          disconnect: { id: dto.trackId },
        },
      },
      include: { tracks: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.playlist.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.playlist.findUnique({
      where: { id },
      include: { tracks: true },
    });
  }

  async getPlaylistsByUser(userId: string) {
    return this.prisma.playlist.findMany({
      where: { userId },
      include: { tracks: true },
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
