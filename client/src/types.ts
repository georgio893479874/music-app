import { JSX } from "react";

export interface Track {
	id: string;
	title: string;
	audioFilePath: string;
	authorId?: string;
	coverImagePath: string;
	album?: Album;
	artistName?: string;
}

export interface Album {
  id: string;
  title: string;
  releaseDate: string;
  artistId: string;
  genreId: string;
  coverUrl: string;
  artist: Artist;
  genre: Genre;
  tracks: Track[];
	artistName: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverPhoto: string;
  tracks: Track[];
  artist: Artist;
}

export interface Artist {
  id: string;
  name: string;
  coverPhoto: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface AuthFormProps {
  title: string;
  buttonText: string;
  type: "signup" | "login";
  onSubmit: (values: AuthFormValues) => void;
}

export interface AuthFormValues {
  fullName: string;
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormValues {
  fullName: string;
  email: string;
  password: string;
}

export interface PlayerService {
	songs: Track[];
	currentSongIndex: number;
	setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>;
	repeatMode: "off" | "one" | "all";
}

export interface PlayerContextProps {
  selectedSong?: Track;
  setSelectedSong: React.Dispatch<React.SetStateAction<Track | undefined>>;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface MobileAction {
  icon?: JSX.Element;
  label: string;
  onClick?: "copy";
}

export interface ListOfSongsProps {
  coverPhoto: string;
  name: string;
  description?: string;
  tracks: Track[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  label?: string;
  showFavoriteButton?: boolean;
}