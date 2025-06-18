import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('user/:userId')
  async getUserRecommendations(
    @Param('userId') userId: string,
    @Query('type') type?: string,
  ) {
    return this.recommendationService.getRecommendationsForUser(userId, type);
  }

  @Get('user/:userId/latest-tracks')
  getLatestTracks(@Param('userId') userId: string) {
    return this.recommendationService.getLatestTracksForUser(userId);
  }

  @Get('user/:userId/recommended-albums')
  getRecommendedAlbums(@Param('userId') userId: string) {
    return this.recommendationService.getRecommendedAlbumsForUser(userId);
  }

  @Get('user/:userId/popular-playlists')
  getPopularPlaylists(@Param('userId') userId: string) {
    return this.recommendationService.getPopularPlaylistsForUser(userId);
  }

  @Get('user/:userId/popular-artists')
  getPopularArtists(@Param('userId') userId: string) {
    return this.recommendationService.getPopularArtistsForUser(userId);
  }

  @Get('popular-artist')
  getMostPopularArtist() {
    return this.recommendationService.getMostPopularArtist();
  }

  @Get('global')
  async getGlobalRecommendations(
    @Query('type') type?: string,
  ) {
    return this.recommendationService.getGlobalRecommendations(type);
  }
}