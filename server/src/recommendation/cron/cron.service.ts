import { Injectable } from '@nestjs/common';
import { RecommendationService } from '../recommendation.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronRecommendationService {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.recommendationService.generateAllRecommendations();
  }
}