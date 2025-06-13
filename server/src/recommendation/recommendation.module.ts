import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentBasedStrategy } from './strategies/content-based.strategy';
import { CollaborativeStrategy } from './strategies/collaborative.strategy';
import { HybridStrategy } from './strategies/hybrid.strategy';
import { RecommendationCron } from './recommendation-cron';

@Module({
  controllers: [RecommendationController],
  providers: [
    RecommendationService,
    ContentBasedStrategy,
    CollaborativeStrategy,
    HybridStrategy,
    PrismaService,
    RecommendationCron,
  ],
})
export class RecommendationModule {}