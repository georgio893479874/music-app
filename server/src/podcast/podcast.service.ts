import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Injectable()
export class PodcastService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePodcastDto) {
    return this.prisma.podcast.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.podcast.findMany({
      include: {
        episodes: true,
        host: true,
      },
    });
  }

  async findOne(id: string) {
    const podcast = await this.prisma.podcast.findUnique({
      where: { id },
      include: {
        episodes: true,
        host: true,
      },
    });

    if (!podcast) throw new NotFoundException(`Podcast #${id} not found`);
    return podcast;
  }

  async update(id: string, dto: UpdatePodcastDto) {
    await this.findOne(id);

    return this.prisma.podcast.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.podcast.delete({
      where: { id },
    });
  }

  async searchArchive(query: string) {
    const q = (query || '').trim();
    if (!q) {
      return [];
    }

    const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(`(${q}) AND mediatype:(audio)`)}` +
      '&fl[]=identifier,title,creator,description&rows=10&page=1&output=json';

    const { data } = await axios.get(searchUrl, { timeout: 10000 });
    const docs = data.response?.docs || [];

    return Promise.all(
      docs.map(async (doc: any) => {
        try {
          const metaUrl = `https://archive.org/metadata/${doc.identifier}`;
          const { data: meta } = await axios.get(metaUrl, { timeout: 10000 });
          const files = meta.files || [];
          const audioFile = files.find((file: any) => /mp3/i.test(file.format) || /audio/i.test(file.format));
          const audioFilePath = audioFile?.name
            ? `https://archive.org/download/${doc.identifier}/${audioFile.name}`
            : null;

          return {
            id: doc.identifier,
            title: doc.title || 'Untitled podcast',
            description: doc.description || meta.metadata?.description || '',
            host: doc.creator || meta.metadata?.creator || 'Unknown host',
            coverUrl: meta.metadata?.image || null,
            audioFilePath,
            source: 'archive.org',
          };
        } catch {
          return {
            id: doc.identifier,
            title: doc.title || 'Untitled podcast',
            description: doc.description || '',
            host: doc.creator || 'Unknown host',
            coverUrl: null,
            audioFilePath: null,
            source: 'archive.org',
          };
        }
      }),
    );
  }

  async importFromArchive(query: string) {
    const results = await this.searchArchive(query);
    const imported: any[] = [];

    for (const item of results) {
      try {
        const artist = await this.prisma.artist.upsert({
          where: { name: item.host || 'Unknown host' },
          update: {},
          create: { name: item.host || 'Unknown host' },
        });

        const podcast = await this.prisma.podcast.create({
          data: {
            title: item.title,
            description: item.description || `Imported from Web Archive`,
            hostId: artist.id,
            coverUrl: item.coverUrl || undefined,
          },
        });

        if (item.audioFilePath) {
          await this.prisma.podcastEpisode.create({
            data: {
              title: item.title,
              description: item.description || 'Imported from Web Archive',
              audioFilePath: item.audioFilePath,
              duration: 0,
              podcastId: podcast.id,
            },
          });
        }

        imported.push(podcast);
      } catch (error) {
        console.error('Failed to import podcast from archive', error);
      }
    }

    return imported;
  }
}
