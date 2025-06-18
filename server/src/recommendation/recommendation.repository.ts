import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecommendationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndDay(userId: string, day: Date) {
    return this.prisma.recommendation.findMany({
      where: {
        userId,
        createdAt: {
          gte: day,
        },
      },
      include: {
        track: {
          include: {
            album: { include: { artist: true, genre: true } },
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}