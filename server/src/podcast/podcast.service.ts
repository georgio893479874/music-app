import { Injectable } from '@nestjs/common';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Injectable()
export class PodcastService {
  create(createPodcastDto: CreatePodcastDto) {
    return 'This action adds a new podcast';
  }

  findAll() {
    return `This action returns all podcast`;
  }

  findOne(id: number) {
    return `This action returns a #${id} podcast`;
  }

  update(id: number, updatePodcastDto: UpdatePodcastDto) {
    return `This action updates a #${id} podcast`;
  }

  remove(id: number) {
    return `This action removes a #${id} podcast`;
  }
}
