import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoriteDto);
  }

  @Get()
  findAll() {
    return this.favoriteService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.favoriteService.update(+id, updateFavoriteDto);
  }

  @Delete()
  removeByUserAndTrack(
    @Query('userId') userId: string,
    @Query('trackId') trackId: string,
  ) {
    return this.favoriteService.removeByUserAndTrack(userId, trackId);
  }
}
