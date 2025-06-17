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
import { PerformerService } from './performer.service';
import { CreatePerformerDto } from './dto/create-performer.dto';
import { UpdatePerformerDto } from './dto/update-performer.dto';

@Controller('performer')
export class PerformerController {
  constructor(private readonly performerService: PerformerService) {}

  @Post('create')
  create(@Body() createPerformerDto: CreatePerformerDto) {
    return this.performerService.create(createPerformerDto);
  }

  @Get()
  async findAll(@Query('query') query: string) {
    return this.performerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePerformerDto: UpdatePerformerDto,
  ) {
    return this.performerService.update(id, updatePerformerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.performerService.remove(id);
  }

  @Post(':id/subscribe')
  subscribe(@Param('id') artistId: string, @Body('userId') userId: string) {
    return this.performerService.subscribeToArtist(userId, artistId);
  }

  @Post(':id/unsubscribe')
  unsubscribe(@Param('id') artistId: string, @Body('userId') userId: string) {
    return this.performerService.unsubscribeFromArtist(userId, artistId);
  }

  @Get(':id/is-subscribed')
  isSubscribed(@Param('id') artistId: string, @Query('userId') userId: string) {
    return this.performerService.isSubscribed(userId, artistId);
  }

  @Get(':id/monthly-listens')
  async getArtistMonthlyListens(@Param('id') id: string) {
    return this.performerService.getArtistMonthlyListens(id);
  }
}
