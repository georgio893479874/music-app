import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PerformerService } from 'src/performer/performer.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly performerService: PerformerService
  ) {}

  @Get('email')
  async findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    data: {
      firstname?: string;
      lastname?: string;
      email?: string;
      avatar?: string;
      banner?: string;
    },
  ) {
    return this.userService.updateUser(id, data);
  }

  @Get(':userId/artist-subscriptions')
  async getArtistSubscriptions(@Param('userId') userId: string) {
    return this.performerService.getUserArtistSubscriptions(userId);
  }
}
