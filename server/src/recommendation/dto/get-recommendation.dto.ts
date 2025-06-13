export class GetRecommendationDto {
  userId: string;
  limit?: number;
  type: "made_for_you" | "discovery" | "new_music";
}