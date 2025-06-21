"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import Head from "next/head";
import { Album, Artist, Track } from "@/types";
import Image from "next/image";
import { API_URL, getUserId } from "@/constants";
import clsx from "clsx";

const ArtistPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackCounts, setTrackCounts] = useState<Record<string, number>>({});
  const [monthlyListens, setMonthlyListens] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: artistData }, { data: albumData }, { data: trackData }] =
          await Promise.all([
            axios.get(`${API_URL}/performer/${artistId}`),
            axios.get(`${API_URL}/album?artistId=${artistId}`),
            axios.get(`${API_URL}/track?artistId=${artistId}`),
          ]);
        setArtist(artistData);
        setAlbums(albumData);
        setTracks(trackData);

        const counts: Record<string, number> = {};
        await Promise.all(
          trackData.map(async (track: Track) => {
            const { data: count } = await axios.get(
              `${API_URL}/history/track/${track.id}/count`
            );
            counts[track.id] = count;
          })
        );
        setTrackCounts(counts);
      } catch (error) {
        console.error(error);
      }
    };
    if (artistId) fetchAll();
  }, [artistId]);

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/performer/${artistId}/monthly-listens`
        );
        setMonthlyListens(data);
      } catch {
        setMonthlyListens(null);
      }
    };
    if (artistId) fetchMonthly();
  }, [artistId]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/performer/${artistId}/is-subscribed`,
          { params: { userId: userId } }
        );
        setIsSubscribed(data);
      } catch {
        setIsSubscribed(false);
      }
    };
    if (artistId) checkSubscription();
  }, [artistId, userId]);

  const handleSubscribe = async () => {
    try {
      await axios.post(`${API_URL}/performer/${artistId}/subscribe`, {
        userId: userId,
      });
      setIsSubscribed(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.post(`${API_URL}/performer/${artistId}/unsubscribe`, {
        userId: userId,
      });
      setIsSubscribed(false);
    } catch (err) {
      console.error(err);
    }
  };

  const popularTracks = [...tracks]
    .sort((a, b) => (trackCounts[b.id] || 0) - (trackCounts[a.id] || 0))
    .slice(0, 5);

  const newestAlbum =
    albums.length > 0
      ? albums.reduce((a, b) =>
          new Date(a.releaseDate) > new Date(b.releaseDate) ? a : b
        )
      : null;

  const pinnedAlbum = albums.length > 1 ? albums[1] : albums[0];

  if (!artist)
    return <p className="text-center text-white text-xl">Loading...</p>;

  return (
    <>
      <Head>
        <title>{artist.name} | Notent</title>
      </Head>
      <div className="bg-gradient-to-b from-[#f4f4f4] to-[#ffffff] min-h-screen pb-24">
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
          <Image
            className="object-cover w-full h-full grayscale opacity-80"
            src={artist.coverPhoto}
            alt={artist.name}
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white/70"></div>
          <div className="absolute left-1/2 top-[68%] -translate-x-1/2 flex items-end gap-8 w-full px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                <Image
                  src={artist?.avatar || "/placeholder"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                    {artist.name}
                  </h1>
                  {monthlyListens !== null && (
                    <span className="ml-2 px-4 py-1 rounded-full bg-white text-gray-900 font-bold text-lg shadow border border-gray-200">
                      {monthlyListens.toLocaleString()} monthly listeners
                    </span>
                  )}
                  <button
                    className={clsx(
                      "ml-4 px-6 py-2 rounded-full font-bold transition",
                      isSubscribed
                        ? "bg-green-500 text-white hover:bg-green-700"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    )}
                    onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                  >
                    {isSubscribed ? "Following" : "Follow"}
                  </button>
                  <ShareButton />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-3">Popular</h2>
            <ol className="space-y-2">
              {popularTracks.map((track, idx) => (
                <li
                  key={track.id}
                  className="flex items-center group hover:bg-gray-100 rounded-lg px-2 py-1 transition"
                >
                  <span className="text-lg w-6 text-gray-500">{idx + 1}</span>
                  <button className="mr-3 bg-white rounded-full p-1 shadow hover:bg-gray-200 transition">
                    <FaPlay size={14} />
                  </button>
                  <span className="flex-1 text-md font-medium truncate">
                    {track.title}
                  </span>
                  <span className="ml-2 text-gray-400 font-mono text-sm">
                    {trackCounts[track.id]
                      ? `${(trackCounts[track.id] / 1000).toFixed(1)}K`
                      : "0"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Newest release</h2>
            {newestAlbum && (
              <Link href={`/album/${newestAlbum.id}`} className="block group">
                <div className="relative w-full h-40 rounded-xl overflow-hidden shadow mb-3">
                  <Image
                    src={newestAlbum.coverUrl}
                    alt={newestAlbum.title}
                    fill
                    sizes="320px"
                    className="object-cover group-hover:scale-105 transition"
                  />
                  <button className="absolute bottom-3 right-3 bg-white/80 rounded-full p-2">
                    <FaPlay size={20} className="text-gray-900" />
                  </button>
                </div>
                <div className="text-gray-600 text-xs mb-1">
                  {new Date(newestAlbum.releaseDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </div>
                <div className="text-lg font-semibold text-gray-900 group-hover:underline">
                  {newestAlbum.title}
                </div>
              </Link>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Pinned by artist</h2>
            {pinnedAlbum && (
              <Link href={`/album/${pinnedAlbum.id}`} className="block group">
                <div className="relative w-full h-40 rounded-xl overflow-hidden shadow mb-3">
                  <Image
                    src={pinnedAlbum.coverUrl}
                    alt={pinnedAlbum.title}
                    fill
                    sizes="320px"
                    className="object-cover group-hover:scale-105 transition"
                  />
                  <button className="absolute bottom-3 right-3 bg-white/80 rounded-full p-2">
                    <FaPlay size={20} className="text-gray-900" />
                  </button>
                </div>
                <div className="text-lg font-semibold text-gray-900 group-hover:underline">
                  {pinnedAlbum.title}
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12">
          <h2 className="text-3xl font-bold mb-6">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {albums.map((album) => (
              <Link href={`/album/${album.id}`} key={album.id} passHref>
                <div className="relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-lg h-48 w-full object-cover">
                    <Image
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      src={album.coverUrl}
                      alt={album.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-semibold group-hover:underline">
                      {album.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(album.releaseDate).getFullYear()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtistPage;
