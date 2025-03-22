import { Injectable } from '@nestjs/common';
import { CreatePerformerDto } from './dto/create-performer.dto';
import { UpdatePerformerDto } from './dto/update-performer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PerformerService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createPerformerDto: CreatePerformerDto) {
    return this.prisma.artist.create({
      data: createPerformerDto,
    });
  }

  async findAll(query: string) {
    return this.prisma.artist.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
      },
    });

    return artist;
  }

  async update(id: string, updatePerformerDto: UpdatePerformerDto) {
    const artist = await this.prisma.artist.update({
      where: { id },
      data: updatePerformerDto,
    });

    return artist;
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.delete({
      where: { id },
    });

    return artist;
  }
}











