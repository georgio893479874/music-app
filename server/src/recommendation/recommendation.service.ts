import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentBasedStrategy } from './strategies/content-based.strategy';
import { CollaborativeStrategy } from './strategies/collaborative.strategy';
import { HybridStrategy } from './strategies/hybrid.strategy';
import { GetRecommendationDto } from './dto/get-recommendation.dto';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentBased: ContentBasedStrategy,
    private readonly collaborative: CollaborativeStrategy,
    private readonly hybrid: HybridStrategy,
  ) {}

  async getRecommendations(dto: GetRecommendationDto) {
    const { userId, limit = 20, type } = dto;

    let recommendations = [];
    if (type === "made_for_you") {
      recommendations = await this.hybrid.generate(userId, limit);
    } else if (type === "discovery") {
      recommendations = await this.collaborative.generate(userId, limit);
    } else if (type === "new_music") {
      recommendations = await this.contentBased.generate(userId, limit);
    }

    await this.prisma.recommendation.createMany({
      data: recommendations.map((t) => ({
        userId,
        trackId: t.id,
        type,
      })),
      skipDuplicates: true,
    });

    return recommendations;
  }
}