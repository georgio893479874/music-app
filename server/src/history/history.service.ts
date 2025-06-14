import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHistoryDto: CreateHistoryDto) {
    const { userId, trackId } = createHistoryDto;
    return this.prisma.listeningHistory.create({
      data: {
        user: { connect: { id: userId } },
        track: { connect: { id: trackId } },
      },
    });
  }

  async findAll() {
    return this.prisma.listeningHistory.findMany({
      include: {
        user: true,
        track: true,
      },
      orderBy: {
        listenedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.listeningHistory.findUnique({
      where: { id },
      include: {
        user: true,
        track: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.listeningHistory.delete({
      where: { id },
    });
  }
}
