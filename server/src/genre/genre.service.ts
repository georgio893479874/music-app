import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto) {
    return this.prisma.genre.create({
      data: {
        name: createGenreDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        albums: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.genre.findUnique({
      where: { id },
      include: {
        albums: true,
      },
    });
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
    });
  }

  async remove(id: string) {
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
