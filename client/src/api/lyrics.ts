import axios from "axios";

export async function fetchLyrics(trackId: string) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/lyric?trackId=${trackId}`
  );
  return response.data;
}
