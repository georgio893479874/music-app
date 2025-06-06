import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    const existing = await this.prisma.favorite.findFirst({
      where: {
        userId: createFavoriteDto.userId,
        trackId: createFavoriteDto.trackId,
      },
    });
    if (existing) {
      return existing;
    }
    return this.prisma.favorite.create({
      data: {
        userId: createFavoriteDto.userId,
        trackId: createFavoriteDto.trackId,
      },
    });
  }

  findAll() {
    return this.prisma.favorite.findMany({
      include: {
        user: true,
        track: {
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
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  async removeByUserAndTrack(userId: string, trackId: string) {
    return this.prisma.favorite.deleteMany({
      where: {
        userId,
        trackId,
      },
    });
  }
}
