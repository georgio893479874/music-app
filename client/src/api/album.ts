import axios from "axios";
import { Album, Track } from "@/types";
import { API_URL } from "@/constants";

export const fetchAlbumById = async (albumId: string): Promise<Album> => {
  const response = await axios.get<Album>(`${API_URL}/album/${albumId}`);
  return response.data;
};

export const fetchSongsByAlbumId = async (albumId: string): Promise<Track[]> => {
  const response = await axios.get<Album>(`${API_URL}/album/${albumId}`);
  return response.data?.tracks || [];
};