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
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddTrackDto } from './dto/add-track.dto';
import { RemoveTrackDto } from './dto/remove-track.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post('create')
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @Post('add-track')
  addTrack(@Body() dto: AddTrackDto) {
    return this.playlistService.addTrack(dto);
  }

  @Post('remove-track')
  removeTrack(@Body() dto: RemoveTrackDto) {
    return this.playlistService.removeTrack(dto);
  }

  @Get('user/:userId')
  getPlaylistsByUser(@Param('userId') userId: string) {
    return this.playlistService.getPlaylistsByUser(userId);
  }

  @Get()
  async findAll(@Query('query') query: string) {
    return this.playlistService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(id);
  }

  @Post(':id/like')
  likePlaylist(
    @Param('id') playlistId: string,
    @Body('userId') userId: string,
  ) {
    return this.playlistService.likePlaylist(userId, playlistId);
  }

  @Delete(':id/like')
  unlikePlaylist(
    @Param('id') playlistId: string,
    @Query('userId') userId: string,
  ) {
    return this.playlistService.unlikePlaylist(userId, playlistId);
  }

  @Get(':id/likes/count')
  countPlaylistLikes(@Param('id') playlistId: string) {
    return this.playlistService.countPlaylistLikes(playlistId);
  }

  @Get(':id/likes/is-favorite')
  isPlaylistLiked(
    @Param('id') playlistId: string,
    @Query('userId') userId: string,
  ) {
    return this.playlistService.isPlaylistLiked(userId, playlistId);
  }
}
