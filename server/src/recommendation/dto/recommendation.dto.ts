import { RecommendationType } from '@prisma/client';

export class RecommendationDto {
  id: number;
  userId: string;
  trackId: string;
  type: RecommendationType;
  createdAt: Date;
  track: any;
}