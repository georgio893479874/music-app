import axios from 'axios';

export async function fetchLyrics(trackId: string) {
  const response = await axios.get(`/api/lyric?trackId=${trackId}`);
  return response.data;
}
