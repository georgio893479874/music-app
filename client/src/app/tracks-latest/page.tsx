"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/constants'
import { Artist } from '@/types'

type Album = {
  id: string
  title: string
  coverUrl?: string
  artist: Artist
}

type Track = {
  id: string
  title: string
  duration: number
  album: Album
  coverImagePath?: string
  author?: Artist
}

export default function TracksLatestPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTracks() {
      setLoading(true)
      const userId = localStorage.getItem('userId')
      const res = await axios.get<Track[]>(`${API_URL}/recommendation/user/${userId}?type=NEW_MUSIC`)
      setTracks(res.data)
      setLoading(false)
    }
    fetchTracks()
  }, [])

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Latest Releases</h1>
      {loading ? "Loading..." : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <tbody>
            {tracks.map((track, i) => (
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
      )}
    </div>
  )
}