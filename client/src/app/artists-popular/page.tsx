"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/constants'
import { Artist } from '@/types'

export default function ArtistsPopularPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArtists() {
      setLoading(true)
      const userId = localStorage.getItem('userId')
      const res = await axios.get<Artist[]>(`${API_URL}/recommendation/user/${userId}/popular-artists`)
      setArtists(res.data)
      setLoading(false)
    }
    fetchArtists()
  }, [])

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Popular Artists</h1>
      {loading ? "Loading..." : (
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {artists.map(artist =>
            <div key={artist.id} style={{
              width: 120, borderRadius: 14, background: '#fff',
              boxShadow: '0 2px 12px 0 rgba(43,143,229,0.07)', padding: 14, textAlign: 'center'
            }}>
              <img src={artist.coverPhoto} alt={artist.name} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
              <div style={{ fontWeight: 600 }}>{artist.name}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}