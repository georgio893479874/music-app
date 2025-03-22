import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    return this.prisma.album.create({
        data: {
          title: createAlbumDto.title,
          releaseDate: createAlbumDto.releaseDate,
          artistId: createAlbumDto.artistId,
          genreId: createAlbumDto.genreId,
          coverUrl: createAlbumDto.coverUrl,
        },
    });
  }

  async findAll(query: string) {
    return this.prisma.album.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
      include: {
        artist: true,
        genre: true,
        tracks: true,
      },
    });

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
    });
  }

  async remove(id: string) {
    return this.prisma.album.delete({
      where: { id },
    });
  }
}
