"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePlayerContext } from "@/contexts/PlayerContext";
import Head from "next/head";
import ShareButton from "@/components/ShareButton";
import { Album } from "@/types";
import Image from "next/image";
import { fetchAlbumById } from "@/api/album";
import { API_URL } from "@/constants";

export default function AlbumPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [listeningCounts, setListeningCounts] = useState<
    Record<string, number>
  >({});
  const { setSelectedSong } = usePlayerContext();

  async function fetchTrackListeningCount(trackId: string): Promise<number> {
    try {
      const res = await fetch(`${API_URL}/history/track/${trackId}/count`);
      if (!res.ok) return 0;
      const data = await res.json();
      return data?.count || 0;
    } catch {
      return 0;
    }
  }

  useEffect(() => {
    if (!albumId) return;
    const fetchAlbum = async () => {
      try {
        const albumData = await fetchAlbumById(albumId as string);
        setAlbum(albumData);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };
    fetchAlbum();
  }, [albumId]);

  useEffect(() => {
    if (!album?.tracks) return;
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      await Promise.all(
        album.tracks.map(async (track) => {
          counts[track.id] = await fetchTrackListeningCount(track.id);
        })
      );
      setListeningCounts(counts);
    };
    fetchCounts();
  }, [album?.tracks]);

  if (!album) {
    return <div className="text-center text-white mt-20">Loading...</div>;
  }

  function formatDuration(secs: number) {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }
  const totalSongs = album.tracks.length;
  const totalSeconds = album.tracks.reduce(
    (acc, t) => acc + (t.duration || 0),
    0
  );
  const totalDuration = `${
    Math.floor(totalSeconds / 3600)
      ? Math.floor(totalSeconds / 3600) + " h "
      : ""
  }${Math.floor((totalSeconds % 3600) / 60)} min`;

  return (
    <>
      <Head>
        <title>{`${album.title} - Альбом від ${album.artist.name} | Notent`}</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#c2b3d5] to-[#e5d6e3] flex flex-col rounded-3xl overflow-hidden">
        <div className="relative flex gap-8 items-end px-12 pt-12 pb-8 bg-gradient-to-t from-[#282828bd] to-[#b9b2e8a1]">
          <div className="relative">
            <Image
              src={album.coverUrl}
              alt={album.title}
              className="rounded-xl shadow-2xl object-cover border-4 border-white"
              width={220}
              height={220}
              priority
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase text-sm tracking-widest text-white/80 font-semibold">
              Альбом
            </span>
            <h1 className="text-6xl font-extrabold text-white drop-shadow-md mb-1">
              {album.title}
            </h1>
            <div className="flex items-center gap-2 text-white/80 font-medium text-lg">
              <Link
                href={`/artist/${album.artist.id}`}
                className="hover:underline font-semibold text-white"
              >
                {album.artist.name}
              </Link>
              <span>·</span>
              <span>{totalSongs} songs</span>
              <span>·</span>
              <span>{totalDuration}</span>
            </div>
          </div>
          <button
            className="ml-auto mr-12 bg-gradient-to-tr from-[#e985f7] to-[#8c67ef] rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            onClick={() => setSelectedSong(album.tracks[0])}
            aria-label="Play album"
          >
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="7,4 22,12 7,20" />
            </svg>
          </button>
        </div>
        <div className="bg-white/80 rounded-t-3xl flex-1 px-12 pb-10">
          <table className="w-full mt-6 text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-700 text-sm font-semibold">
                <th className="w-8 pl-2">#</th>
                <th className="w-12"></th>
                <th className="">Title</th>
                <th className="hidden md:table-cell">Album</th>
                <th className="hidden md:table-cell">Added date</th>
                <th className="hidden md:table-cell text-right">Time</th>
                <th className="hidden md:table-cell text-right">Listens</th>
                <th className=""></th>
              </tr>
            </thead>
            <tbody>
              {album.tracks.map((track, idx) => (
                <tr
                  key={track.id}
                  className="group bg-white/70 hover:bg-[#f3ecf7] rounded-lg cursor-pointer transition-colors shadow"
                  onClick={() => setSelectedSong(track)}
                >
                  <td className="pl-2 py-1 text-gray-700 font-bold text-lg">
                    {idx + 1}
                  </td>
                  <td className="py-1">
                    <Image
                      src={track.coverImagePath || album.coverUrl}
                      alt={track.title}
                      width={40}
                      height={40}
                      className="rounded shadow border border-gray-300 object-cover"
                    />
                  </td>
                  <td className="py-1">
                    <span
                      className={
                        idx === 0
                          ? "font-bold text-[#7a2ff7]"
                          : "font-semibold text-gray-900"
                      }
                    >
                      {track.title}
                    </span>
                  </td>
                  <td className="hidden md:table-cell py-1 text-gray-600">
                    {album.title}
                  </td>
                  <td className="hidden md:table-cell py-1 text-gray-600">
                    {new Date(album.releaseDate).toLocaleDateString()}
                  </td>
                  <td className="hidden md:table-cell py-1 text-right text-gray-700">
                    {formatDuration(0)}
                  </td>
                  <td className="hidden md:table-cell py-1 text-right text-gray-700">
                    {listeningCounts[track.id] ?? "-"}
                  </td>
                  <td className="py-1">
                    <ShareButton trackId={track.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
