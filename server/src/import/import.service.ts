import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}
  private mbClient = axios.create({
    baseURL: 'https://musicbrainz.org/ws/2',
    timeout: 8000,
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Notent-App/1.0 (contact: you@example.com)',
    },
    httpsAgent: new https.Agent({ keepAlive: true }),
  });

  private async mbGetWithRetries(path: string, params: any, retries = 2) {
    let lastErr: any = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await this.mbClient.get(path, { params: { ...params, fmt: 'json' } });
        return res.data;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
      }
    }
    throw lastErr;
  }
  async searchMusicBrainz(query: string) {
    try {
      const data = await this.mbGetWithRetries('/recording', { query, limit: 10 });

      const recordings = data.recordings || [];

      const results = await Promise.all(
        recordings.map(async (r: any) => {
          const title = r.title;
          const artist = r['artist-credit']?.[0]?.name || 'Unknown Artist';
          try {
            const dq = `${artist} ${title}`;
            const dres = await axios.get('https://api.deezer.com/search', { params: { q: dq, limit: 1 } });
            const first = dres.data?.data?.[0];
            if (first) {
              const details = await this.fetchDeezerTrackDetails(String(first.id));
              return Object.assign(
                {
                  id: r.id,
                  title,
                  artist,
                  duration: details?.duration || (r.length ? Math.floor(r.length / 1000) : null),
                  source: 'musicbrainz',
                  coverUrl: details?.coverUrl || null,
                  album: details?.album || (r.releases?.[0] ? { id: r.releases[0].id, title: r.releases[0].title } : null),
                },
                details?.audioFilePath ? { audioFilePath: details?.audioFilePath } : {},
              );
            }
          } catch (e) {
          }

          return Object.assign(
            {
              id: r.id,
              title,
              artist,
              duration: r.length ? Math.floor(r.length / 1000) : null,
              source: 'musicbrainz',
              coverUrl: null,
              album: r.releases?.[0] ? { id: r.releases[0].id, title: r.releases[0].title } : null,
            },
            {},
          );
        }),
      );

      return results;
    } catch (e) {
      console.error('MusicBrainz search error:', e);
      return [];
    }
  }

  private async fetchDeezerTrackDetails(id: string) {
    try {
      const { data } = await axios.get(`https://api.deezer.com/track/${id}`);
      return {
        id: String(data.id),
        title: data.title,
        artist: data.artist?.name,
        duration: data.duration,
        coverUrl: data.album?.cover_big || data.album?.cover_medium,
        audioFilePath: data.preview || null,
        isPreview: !!data.preview,
        album: data.album ? { id: String(data.album.id), title: data.album.title, coverUrl: data.album.cover_big } : null,
      };
    } catch (e) {
      return null;
    }
  }

  async searchDeezer(query: string) {
    try {
      const { data } = await axios.get(`https://api.deezer.com/search`, { params: { q: query, limit: 10 } });
      const results = data.data || [];
      const detailed = await Promise.all(results.map((r: any) => this.fetchDeezerTrackDetails(String(r.id))));

      return (detailed.filter(Boolean) as any[]).map((d) => ({
        id: d.id,
        title: d.title,
        artist: d.artist,
        duration: d.duration,
        coverUrl: d.coverUrl,
        source: 'deezer',
        audioFilePath: d.audioFilePath,
        isPreview: !!d.isPreview,
        album: d.album,
      }));
    } catch (e) {
      console.error('Deezer search error:', e);
      return [];
    }
  }

  async searchJamendo(query: string) {
    const clientId = process.env.JAMENDO_CLIENT_ID;
    if (!clientId) return [];
    try {
      const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=10&search=${encodeURIComponent(
        query,
      )}`;
      const { data } = await axios.get(url);
      const results = data.results || data.releases || [];
      return (results || []).map((r: any) => ({
        id: String(r.id),
        title: r.name || r.title,
        artist: r.artist_name || r.artist || (r.artists && r.artists[0]?.name) || 'Unknown',
        duration: r.duration || null,
        coverUrl: r.album_image || r.album_image_high || r.image || null,
        source: 'jamendo',
        audioFilePath: r.audio || r.audio_download || r.stream || null,
        isPreview: false,
        album: r.album_name ? { id: String(r.album_id || r.album), title: r.album_name, coverUrl: r.album_image } : null,
      }));
    } catch (e) {
      console.error('Jamendo search error:', e);
      return [];
    }
  }

  async searchArchiveOrg(query: string) {
    try {
      const q = `(${query}) AND mediatype:(audio)`;
      const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier,title,creator&rows=10&page=1&output=json`;
      const { data } = await axios.get(searchUrl);
      const docs = data.response?.docs || [];
      const results = await Promise.all(
        docs.map(async (d: any) => {
          try {
            const metaUrl = `https://archive.org/metadata/${d.identifier}`;
            const { data: m } = await axios.get(metaUrl);
            const files = m.files || [];
            const mp3 = files.find((f: any) => /mp3/i.test(f.format));
            const fileName = mp3?.name;
            const audioUrl = fileName ? `https://archive.org/download/${d.identifier}/${fileName}` : null;
            return {
              id: d.identifier,
              title: d.title,
              artist: d.creator || null,
              duration: null,
              coverUrl: m.metadata?.image || null,
              source: 'archiveorg',
              audioFilePath: audioUrl,
              isPreview: false,
              album: null,
            };
          } catch (e) {
            return null;
          }
        }),
      );
      return (results.filter(Boolean) as any[]);
    } catch (e) {
      console.error('Archive.org search error:', e);
      return [];
    }
  }

  async searchAll(query: string, source: string = 'all') {
    const s = (source || 'all').toString().toLowerCase();

    let mb: any[] = [];
    let deezer: any[] = [];
    let jamendo: any[] = [];
    let archive: any[] = [];

    const tasks: Promise<any>[] = [];

    if (s === 'all' || s === 'jamendo') {
      tasks.push(this.searchJamendo(query).then((r) => (jamendo = r || [])));
    }
    if (s === 'all' || s === 'archive' || s === 'archiveorg') {
      tasks.push(this.searchArchiveOrg(query).then((r) => (archive = r || [])));
    }
    if (s === 'all' || s === 'deezer') {
      tasks.push(this.searchDeezer(query).then((r) => (deezer = r || [])));
    }
    if (s === 'all' || s === 'musicbrainz' || s === 'mb') {
      tasks.push(this.searchMusicBrainz(query).then((r) => (mb = r || [])));
    }

    await Promise.all(tasks);

    const tracks = [...(jamendo || []), ...(archive || []), ...(deezer || []), ...(mb || [])];
    const performerMap = new Map<string, any>();
    const albumMap = new Map<string, any>();

    tracks.forEach((t: any) => {
      if (t.artist) {
        const pid = `external:artist:${encodeURIComponent(t.artist)}`;
        if (!performerMap.has(pid)) {
          performerMap.set(pid, { id: pid, name: t.artist, coverPhoto: t.coverUrl || '' });
        }
      }
      if (t.album) {
        const aid = String(t.album.id || `${t.source}:${t.id}`);
        if (!albumMap.has(aid)) {
          albumMap.set(aid, { id: aid, title: t.album.title || t.title, coverUrl: t.album?.coverUrl || t.coverUrl || '' });
        }
      }
    });

    return {
      tracks,
      albums: Array.from(albumMap.values()),
      performers: Array.from(performerMap.values()),
      playlists: [],
    };
  }

  private async fetchLyricsForTrack(title: string, artist: string) {
    const cleanTitle = (title || '').trim();
    const cleanArtist = (artist || '').trim();

    if (!cleanTitle || !cleanArtist) {
      return null;
    }

    const candidates = [
      `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`,
      `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanTitle)}/${encodeURIComponent(cleanArtist)}`,
    ];

    for (const url of candidates) {
      try {
        const { data } = await axios.get(url, { timeout: 6000 });
        const lyricText = typeof data === 'string' ? data : data?.lyrics || data?.lyric;

        if (typeof lyricText === 'string' && lyricText.trim().length > 10) {
          return lyricText.trim();
        }
      } catch (e) {}
    }

    return null;
  }

  private async importLyricsForTrack(trackId: string, title: string, artist: string) {
    if (!trackId) {
      return null;
    }

    const existingLyric = await this.prisma.lyric.findFirst({ where: { trackId } });
    if (existingLyric) {
      return existingLyric;
    }

    const lyrics = await this.fetchLyricsForTrack(title, artist);
    if (!lyrics) {
      return null;
    }

    return this.prisma.lyric.create({
      data: {
        text: lyrics,
        timestamp: 0,
        trackId,
      },
    });
  }

  async importTrack(track: {
    id: string;
    title: string;
    artist: string;
    duration?: number;
    coverUrl?: string;
    source: string;
    audioFilePath?: string | null;
    album?: { id?: string; title?: string; coverUrl?: string } | null;
  }) {
    if (!track.audioFilePath || track.audioFilePath.startsWith('external:')) {
      return null;
    }

    const existing = await this.prisma.track.findFirst({
      where: {
        externalId: track.id,
        source: track.source,
      },
    });

    if (existing) {
      await this.importLyricsForTrack(existing.id, track.title, track.artist);
      return existing;
    }

    const artist = await this.prisma.artist.upsert({
      where: { name: track.artist },
      update: {},
      create: {
        name: track.artist,
      },
    });

    let albumConnect = undefined;
    if (track.album && track.album.title) {
      const albumName = track.album.title;
      const existingAlbum = await this.prisma.album.findFirst({ where: { title: albumName, artistId: artist.id } });
      if (existingAlbum) {
        albumConnect = { connect: { id: existingAlbum.id } };
      } else {
        const created = await this.prisma.album.create({ data: { title: albumName, artistId: artist.id, releaseDate: new Date(), coverUrl: track.album.coverUrl || track.coverUrl || undefined } });
        albumConnect = { connect: { id: created.id } };
      }
    }

    const audioPath = track.audioFilePath;

    const createdTrack = await this.prisma.track.create({
      data: {
        title: track.title,
        duration: track.duration,
        coverUrl: track.coverUrl,
        audioFilePath: audioPath,
        externalId: track.id,
        source: track.source,
        author: { connect: { id: artist.id } },
        ...(albumConnect ? { album: albumConnect } : {}),
      },
    });

    await this.importLyricsForTrack(createdTrack.id, track.title, track.artist);

    return createdTrack;
  }

  async importFromSearch(query: string) {
    const { tracks } = await this.searchAll(query);

    const imported = await Promise.all(tracks.map((t) => this.importTrack(t)));
    return imported.filter(Boolean);
  }

  async importAllFromSearch(query: string, source: string = 'all') {
    const { tracks = [], albums = [], performers = [] } = await this.searchAll(query, source);

    for (const p of performers) {
      try {
        if (!p || !p.name) continue;
        await this.prisma.artist.upsert({
          where: { name: p.name },
          update: {},
          create: { name: p.name, coverPhoto: p.coverPhoto || undefined },
        });
      } catch (e) {
      }
    }

    for (const a of albums) {
      try {
        if (!a || !a.title) continue;
        const matchingTrack = tracks.find((t: any) => {
          if (!t.album) return false;
          if (t.album.id && a.id && String(t.album.id) === String(a.id)) return true;
          return (t.album.title && a.title && t.album.title === a.title);
        });

        let artistName = matchingTrack?.artist || (a as any).artistName || 'Unknown Artist';
        const artist = await this.ensureArtistByName(artistName, a.coverUrl || (a as any).coverUrl);
        if (!artist) continue;

        const existing = await this.prisma.album.findFirst({ where: { title: a.title, artistId: artist.id } });
        if (!existing) {
          await this.prisma.album.create({ data: { title: a.title, artistId: artist.id, releaseDate: new Date(), coverUrl: a.coverUrl || (a as any).coverUrl || undefined } });
        }
      } catch (e) {
      }
    }

    for (const t of tracks) {
      try {
        await this.importTrack(t);
      } catch (e) {
      }
    }

    return { artists: performers.length, albums: albums.length, tracks: tracks.length };
  }

  async ensureArtistByName(name: string, coverUrl?: string) {
    if (!name) return null;
    const existing = await this.prisma.artist.findUnique({ where: { name } });
    if (existing) return existing;

    const fromMb = await this.importArtistByName(name);
    if (fromMb) return fromMb;

    return this.prisma.artist.create({ data: { name, coverPhoto: coverUrl || undefined } });
  }

  async ensureAlbumForArtist(artistName: string, albumTitle: string, coverUrl?: string) {
    if (!albumTitle) return null;
    const artist = await this.ensureArtistByName(artistName || 'Unknown Artist');
    if (!artist) return null;

    const existing = await this.prisma.album.findFirst({ where: { title: albumTitle, artistId: artist.id } });
    if (existing) return existing;

    return this.prisma.album.create({ data: { title: albumTitle, artistId: artist.id, releaseDate: new Date(), coverUrl: coverUrl || undefined } });
  }

  async getExternalTrackInfo(id: string, source: string) {
    if (source === 'deezer') {
      const { data } = await axios.get(`https://api.deezer.com/track/${id}`);

      return {
        id: String(data.id),
        title: data.title,
        artist: data.artist?.name,
        duration: data.duration,
        coverUrl: data.album?.cover_big,
        source: 'deezer',
        audioFilePath: data.preview || null,
        album: data.album ? { id: String(data.album.id), title: data.album.title, coverUrl: data.album.cover_big } : null,
      };
    }

    if (source === 'musicbrainz') {
      try {
        const data = await this.mbGetWithRetries(`/recording/${id}`, {}, 2);
        const title = data.title;
        const artist = data['artist-credit']?.[0]?.name || 'Unknown';

        try {
          const dq = `${artist} ${title}`;
          const dres = await axios.get('https://api.deezer.com/search', { params: { q: dq, limit: 1 } });
          const first = dres.data?.data?.[0];
          if (first) {
            const details = await this.fetchDeezerTrackDetails(String(first.id));
            if (details) {
              return Object.assign({ id: data.id, title, artist, duration: details.duration || (data.length ? Math.floor(data.length / 1000) : null), source: 'musicbrainz' }, details.audioFilePath ? { audioFilePath: details.audioFilePath } : {}, details.album ? { album: details.album } : {});
            }
          }
        } catch (e) {
        }

        return {
          id: data.id,
          title: data.title,
          artist: data['artist-credit']?.[0]?.name || 'Unknown',
          duration: data.length ? Math.floor(data.length / 1000) : null,
          source: 'musicbrainz',
        };
      } catch (e) {
        console.error('MusicBrainz get recording error:', e);
        return null;
      }
    }

    if (source === 'jamendo') {
      const clientId = process.env.JAMENDO_CLIENT_ID;
      if (!clientId) return null;
      try {
        const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&id=${id}`;
        const { data } = await axios.get(url);
        const t = data.results && data.results[0];
        if (!t) return null;
        return {
          id: String(t.id),
          title: t.name || t.title,
          artist: t.artist_name || t.artist || null,
          duration: t.duration || null,
          coverUrl: t.album_image || t.album_image_high || null,
          source: 'jamendo',
          audioFilePath: t.audio || t.audio_download || t.stream || null,
          isPreview: false,
          album: t.album_name ? { id: String(t.album_id || t.album), title: t.album_name, coverUrl: t.album_image } : null,
        };
      } catch (e) {
        return null;
      }
    }

    if (source === 'archiveorg' || source === 'archive') {
      try {
        const metaUrl = `https://archive.org/metadata/${id}`;
        const { data: m } = await axios.get(metaUrl);
        const files = m.files || [];
        const mp3 = files.find((f: any) => /mp3/i.test(f.format));
        const fileName = mp3?.name;
        const audioUrl = fileName ? `https://archive.org/download/${id}/${fileName}` : null;
        return {
          id,
          title: m.metadata?.title || id,
          artist: m.metadata?.creator || null,
          duration: null,
          coverUrl: m.metadata?.image || null,
          source: 'archiveorg',
          audioFilePath: audioUrl,
          isPreview: false,
          album: null,
        };
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  async importArtistByName(name: string) {
  try {
    const data = await this.mbGetWithRetries('/artist', { query: name, limit: 1 }, 2);

    const artistData = data.artists?.[0];

    if (!artistData) {
      return null;
    }

    const existing = await this.prisma.artist.findUnique({
      where: { name: artistData.name },
    });

    if (existing) return existing;

    return this.prisma.artist.create({
      data: {
        name: artistData.name,
      },
    });
  } catch (e) {
    console.error('importArtistByName error:', e);
    return null;
  }
}
}