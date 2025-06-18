import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [RecommendationController],
  providers: [RecommendationService, PrismaService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
