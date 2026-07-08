import { ImportService } from './import.service';
import axios from 'axios';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({ get: jest.fn() })),
    get: jest.fn(),
  },
}));

describe('ImportService', () => {
  it('imports lyrics for a newly imported track', async () => {
    const prisma = {
      track: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'track-id' }),
      },
      artist: {
        upsert: jest.fn().mockResolvedValue({ id: 'artist-id' }),
      },
      album: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'album-id' }),
      },
      lyric: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'lyric-id' }),
      },
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: { lyrics: 'Hello\nWorld' } });

    const service = new ImportService(prisma as any);

    await service.importTrack({
      id: 'external-id',
      title: 'Song',
      artist: 'Artist',
      duration: 180,
      coverUrl: 'https://example.com/cover.jpg',
      source: 'deezer',
      audioFilePath: 'https://example.com/song.mp3',
      album: { id: 'album-id', title: 'Album', coverUrl: 'https://example.com/album.jpg' },
    });

    expect(prisma.lyric.create).toHaveBeenCalledWith({
      data: {
        text: 'Hello\nWorld',
        timestamp: 0,
        trackId: 'track-id',
      },
    });
  });
});
