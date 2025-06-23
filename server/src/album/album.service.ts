import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

async create(createAlbumDto: CreateAlbumDto) {
  const data: any = {
    title: createAlbumDto.title,
    releaseDate: createAlbumDto.releaseDate,
    artist: { connect: { id: createAlbumDto.artistId } },
    coverUrl: createAlbumDto.coverUrl,
  };

  if (createAlbumDto.genreId) {
    data.genre = { connect: { id: createAlbumDto.genreId } };
  }

  return this.prisma.album.create({ data });
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
        tracks: {
          include: {
            album: {
              include: {
                artist: true,
              },
            },
          },
        },
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
