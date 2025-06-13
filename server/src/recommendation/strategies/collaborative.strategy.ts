import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CollaborativeStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async generate(userId: string, limit: number) {
    const userHistory = await this.prisma.listeningHistory.findMany({
      where: { userId },
      select: { trackId: true },
    });

    const trackIds = userHistory.map((h) => h.trackId);

    const similarUsers = await this.prisma.listeningHistory.findMany({
      where: {
        trackId: { in: trackIds },
        NOT: { userId },
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    const similarUserIds = similarUsers.map((u) => u.userId);

    const recommendations = await this.prisma.listeningHistory.findMany({
      where: {
        userId: { in: similarUserIds },
        trackId: { notIn: trackIds },
      },
      select: { trackId: true },
      distinct: ['trackId'],
      take: limit,
    });

    return this.prisma.track.findMany({
      where: { id: { in: recommendations.map((r) => r.trackId) } },
    });
  }
}