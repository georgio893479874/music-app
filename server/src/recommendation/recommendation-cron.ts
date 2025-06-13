import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RecommendationService } from './recommendation.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecommendationCron {
  constructor(
    private readonly service: RecommendationService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron('0 4 * * *')
  async updateAllRecommendations() {
    const users = await this.prisma.user.findMany({ select: { id: true } });
    for (const user of users) {
      await this.service.getRecommendations({ userId: user.id, type: 'made_for_you', limit: 20 });
      await this.service.getRecommendations({ userId: user.id, type: 'discovery', limit: 20 });
      await this.service.getRecommendations({ userId: user.id, type: 'new_music', limit: 20 });
    }
  }
}