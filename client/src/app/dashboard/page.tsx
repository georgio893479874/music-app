"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/constants';
import { Artist } from '@/types';


type Album = {
  id: string;
  title: string;
  coverUrl?: string;
  artist: Artist;
};

type Playlist = {
  id: string;
  name: string;
  coverPhoto?: string;
};

type Track = {
  id: string;
  title: string;
  duration: number;
  album: Album;
  coverImagePath?: string;
  author?: Artist;
};

export default function DashboardPage() {
  const [latestTracks, setLatestTracks] = useState<Track[]>([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState<Album[]>([]);
  const [popularPlaylists, setPopularPlaylists] = useState<Playlist[]>([]);
  const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const [
        latestTracksRes,
        albumsRes,
        playlistsRes,
        artistsRes,
      ] = await Promise.all([
        axios.get<Track[]>(`${API_URL}/recommendation/user/${userId}?type=NEW_MUSIC`),
        axios.get<Album[]>(`${API_URL}/recommendation/user/${userId}/recommended-albums`),
        axios.get<Playlist[]>(`${API_URL}/recommendation/user/${userId}/popular-playlists`),
        axios.get<Artist[]>(`${API_URL}/recommendation/user/${userId}/popular-artists`),
      ]);
      setLatestTracks(latestTracksRes.data);
      setRecommendedAlbums(albumsRes.data);
      setPopularPlaylists(playlistsRes.data);
      setPopularArtists(artistsRes.data);
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f9fbfc', minHeight: '100vh' }}>
      <div style={{
        background: 'linear-gradient(120deg, #43e0ec 0%, #6d9ffb 100%)',
        borderRadius: 28,
        margin: '32px auto 0',
        maxWidth: 1200,
        padding: '48px 40px 32px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        minHeight: 340,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 16, lineHeight: 1.1 }}>
            The hottest hits of the week
          </div>
          <div style={{ fontSize: 20, maxWidth: 420, marginBottom: 32, opacity: 0.88 }}>
            Fresh music vibes for great mood full your day with energy and passion!
          </div>
          <button style={{
            background: '#fff',
            color: '#2b8fe5',
            fontWeight: 700,
            fontSize: 18,
            border: 'none',
            borderRadius: 28,
            padding: '12px 36px',
            cursor: 'pointer',
            boxShadow: '0 2px 16px 0 rgba(50,150,250,0.08)',
            marginRight: 16,
          }}>PLAY NOW</button>
          <span style={{ marginRight: 12, fontSize: 22, cursor: 'pointer' }}>♡</span>
          <span style={{ fontSize: 22, cursor: 'pointer' }}>⇄</span>
        </div>
        <div style={{
          width: 260, height: 260, borderRadius: 18, overflow: 'hidden', marginLeft: 36,
          background: '#e9f3fb',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src="/placeholder" alt="main banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <section style={{ maxWidth: 1200, margin: '32px auto 0', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px 0 rgba(37,98,185,0.05)', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Latest releases</div>
          <a href="/tracks/latest" style={{ color: '#2b8fe5', fontWeight: 600, fontSize: 16 }}>View all</a>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <tbody>
              {loading ? (
                <tr><td>Loading...</td></tr>
              ) : latestTracks.map((track, i) => (
                <tr key={track.id} style={{ background: i % 2 === 0 ? '#f8fbff' : '#fff', borderRadius: 10, boxShadow: '0 1px 3px 0 rgba(43,143,229,0.04)' }}>
                  <td style={{ width: 44, textAlign: 'center' }}>
                    <button style={{
                      background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#2b8fe5'
                    }}>▶</button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={track.coverImagePath || track.album?.coverUrl} alt={track.title} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 14 }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{track.title}</div>
                        <div style={{ fontSize: 14, color: '#888' }}>{track.author?.name || track.album?.artist?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#888', fontSize: 14 }}>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', fontSize: 20, color: '#2b8fe5', cursor: 'pointer' }}>♡</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section style={{ maxWidth: 1200, margin: '32px auto 0', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingLeft: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Recommended albums</div>
          <a href="/albums/recommended" style={{ color: '#2b8fe5', fontWeight: 600, fontSize: 16 }}>View all</a>
        </div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {loading ? "Loading..." : recommendedAlbums.map(album =>
            <div key={album.id} style={{
              width: 160, borderRadius: 14, background: '#fff',
              boxShadow: '0 2px 12px 0 rgba(43,143,229,0.07)', padding: 14, textAlign: 'center'
            }}>
              <img src={album.coverUrl} alt={album.title} style={{ width: 132, height: 132, borderRadius: 10, objectFit: 'cover', marginBottom: 10 }} />
              <div style={{ fontWeight: 600 }}>{album.title}</div>
              <div style={{ color: '#888', fontSize: 14 }}>{album.artist.name}</div>
            </div>
          )}
        </div>
      </section>
      <section style={{ maxWidth: 1200, margin: '32px auto 0', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingLeft: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Popular playlists</div>
          <a href="/playlists/popular" style={{ color: '#2b8fe5', fontWeight: 600, fontSize: 16 }}>View all</a>
        </div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {loading ? "Loading..." : popularPlaylists.map(playlist =>
            <div key={playlist.id} style={{
              width: 160, borderRadius: 14, background: '#fff',
              boxShadow: '0 2px 12px 0 rgba(43,143,229,0.07)', padding: 14, textAlign: 'center'
            }}>
              <img src={playlist.coverPhoto} alt={playlist.name} style={{ width: 132, height: 132, borderRadius: 10, objectFit: 'cover', marginBottom: 10 }} />
              <div style={{ fontWeight: 600 }}>{playlist.name}</div>
            </div>
          )}
        </div>
      </section>
      <section style={{ maxWidth: 1200, margin: '32px auto 32px', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingLeft: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Popular artists</div>
          <a href="/artists/popular" style={{ color: '#2b8fe5', fontWeight: 600, fontSize: 16 }}>View all</a>
        </div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {loading ? "Loading..." : popularArtists.map(artist =>
            <div key={artist.id} style={{
              width: 120, borderRadius: 14, background: '#fff',
              boxShadow: '0 2px 12px 0 rgba(43,143,229,0.07)', padding: 14, textAlign: 'center'
            }}>
              <img src={artist.coverPhoto} alt={artist.name} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
              <div style={{ fontWeight: 600 }}>{artist.name}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}