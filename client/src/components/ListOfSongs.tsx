import { Heart } from "lucide-react";
import { ListOfSongsProps } from "@/types";
import Link from "next/link";

export default function ListOfSongs({
  coverPhoto,
  name,
  description,
  tracks,
  isFavorite = false,
  onToggleFavorite,
  label = "Playlist",
  showFavoriteButton = true,
  onSongClick,
}: ListOfSongsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 flex flex-col pt-4 rounded-3xl mt-16">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 px-8 pt-16 pb-8">
        <img
          src={coverPhoto}
          alt={name}
          className="rounded-xl shadow-lg border border-gray-700 w-60 h-60 object-cover"
        />
        <div className="flex flex-col gap-4">
          <span className="uppercase text-xs tracking-widest text-gray-400 font-semibold">
            {label}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{name}</h1>
          {description && (
            <p className="text-gray-300 max-w-xl">{description}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            {showFavoriteButton && onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition ${
                  isFavorite ? "text-red-500" : "text-gray-300"
                }`}
                aria-label="Add to favorites"
              >
                <Heart fill={isFavorite ? "currentColor" : "none"}/>
              </button>
            )}
            <span className="text-gray-400 text-sm">
              {tracks?.length} tracks
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 px-8 pb-16">
        <table className="w-full text-left rounded-lg overflow-hidden bg-neutral-900 shadow-lg">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="py-3 px-4 font-normal">#</th>
              <th className="py-3 px-4 font-normal">Title</th>
              <th className="py-3 px-4 font-normal">Artist</th>
              <th className="py-3 px-4 font-normal">Album</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => (
              <tr
                key={track.id}
                className="border-b border-gray-800 hover:bg-neutral-800 transition"
                onClick={() => onSongClick && onSongClick(track)}
              >
                <td className="py-2 px-4 text-gray-400">{index + 1}</td>
                <td className="py-2 px-4 text-white">{track.title}</td>
                <Link href={`/artist/${track.album?.artist.id}`}>
                  <td className="py-2 px-4 text-gray-300">
                    {track.album?.artist?.name || "-"}
                  </td>
                </Link>
                <td className="py-2 px-4 text-gray-300">
                  {track.album?.title || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
