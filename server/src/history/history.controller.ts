import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(id);
  }

  @Get('track/:trackId')
  async getHistoryByTrack(@Param('trackId') trackId: string) {
    return this.historyService.findByTrack(trackId);
  }

  @Get('track/:trackId/count')
  async getTrackListeningCount(@Param('trackId') trackId: string) {
    return this.historyService.countByTrack(trackId);
  }
}
