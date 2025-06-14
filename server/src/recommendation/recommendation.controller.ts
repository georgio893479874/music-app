import { Controller, Get, Query, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { isRecommendationType } from 'guards/recommendation-type.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly service: RecommendationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserRecommendations(
    @Req() req,
    @Query('type') type: string,
    @Query('limit') limit?: number,
  ) {
    if (!isRecommendationType(type)) {
      throw new BadRequestException('Invalid recommendation type');
    }

    return this.service.getRecommendations({
      userId: req.user.id,
      type,
      limit,
    });
  }
}
