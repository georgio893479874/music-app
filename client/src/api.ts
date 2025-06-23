import axios from "axios";
import { Album, Track } from "@/types";
import { API_URL } from "@/constants";

export async function fetchLyrics(trackId: string) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/lyric?trackId=${trackId}`
  );
  return response.data;
}

export const fetchAlbumById = async (albumId: string): Promise<Album> => {
  const response = await axios.get<Album>(`${API_URL}/album/${albumId}`);
  return response.data;
};

export const fetchSongsByAlbumId = async (
  albumId: string
): Promise<Track[]> => {
  const response = await axios.get<Album>(`${API_URL}/album/${albumId}`);
  return response.data?.tracks || [];
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    await axios.post(`${API_URL}/auth/signup`, {
      firstname: firstName,
      lastname: lastName,
      email,
      password,
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string; user: { id: string } }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
