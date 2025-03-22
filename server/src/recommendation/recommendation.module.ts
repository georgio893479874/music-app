import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService],
  imports: [PrismaModule],
})
export class RecommendationModule {}
