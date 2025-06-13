"use client";

import { useEffect, useState, useRef, FC } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import {
  Plus,
  Share2,
  Link,
  Radio,
  MessageCircleWarning,
  QrCode,
} from "lucide-react";
import axios from "axios";

interface ShareButtonProps {
  trackId?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ShareButton: FC<ShareButtonProps> = ({ trackId }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const fetchUserPlaylists = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await axios.get(`${API_URL}/playlist/user/${userId}`);
      setPlaylists(res.data);
      setShowPlaylistModal(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to load playlists");
    }
  };

  const handleAddTrack = async () => {
    if (!selectedPlaylistId) return;

    try {
      await axios.post(`${API_URL}/playlist/add-track`, {
        playlistId: selectedPlaylistId,
        trackId,
      });
      toast.success("Track added!");
      setShowPlaylistModal(false);
      setIsOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to add track");
    }
     await fetchUserPlaylists();
  };


  const handleActionClick = (action: string | undefined) => {
    if (action === "copy") {
      handleCopyLink();
    } else if (action === "addToPlaylist") {
      fetchUserPlaylists();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setIsOpen(false),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (menuRef.current && startY.current !== null) {
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        menuRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (menuRef.current && startY.current !== null) {
      const diff = e.changedTouches[0].clientY - startY.current;
      if (diff > 100) {
        setIsOpen(false);
      } else {
        menuRef.current.style.transition = "transform 0.3s ease";
        menuRef.current.style.transform = "translateY(0)";
        setTimeout(() => {
          if (menuRef.current) menuRef.current.style.transition = "";
        }, 300);
      }
    }
    startY.current = null;
  };

  const mobileActions = [
    { icon: <Share2 className="mr-3" size={18} />, label: "Share", onClick: "copy" },
    { icon: <Plus className="mr-3" size={18} />, label: "Add to Playlist", onClick: "addToPlaylist" },
    { icon: <Link className="mr-3" size={18} />, label: "Copy Link", onClick: "copy" },
    { icon: <Radio className="mr-3" size={18} />, label: "Go to radio based on artist" },
    { icon: <MessageCircleWarning className="mr-3" size={18} />, label: "Complain" },
    { icon: <Plus className="mr-3" size={18} />, label: "Subscribe" },
    { icon: <QrCode className="mr-3" size={18} />, label: "Show Code" },
  ];

  const ActionList = () => (
    <div className="space-y-3">
      {mobileActions.map((action, i) => (
        <button
          key={i}
          onClick={() => handleActionClick(action.onClick)}
          className="flex items-center w-full p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
        >
          {action.icon} {action.label}
        </button>
      ))}
    </div>
  );

  const PlaylistModal = () => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-white">Select Playlist</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {playlists.map((playlist) => (
            <label key={playlist.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="playlist"
                value={playlist.id}
                checked={selectedPlaylistId === playlist.id}
                onChange={() => setSelectedPlaylistId(playlist.id)}
              />
              <span className="text-white">{playlist.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={() => setShowPlaylistModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
            Cancel
          </button>
          <button onClick={handleAddTrack} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Add
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
      >
        <BsThreeDotsVertical size={20} />
      </button>

      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
          <div
            {...swipeHandlers}
            ref={menuRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="bg-black/80 w-full rounded-t-2xl p-6 text-white max-h-[80vh] overflow-y-auto animate-slide-up"
          >
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium text-center mb-4">Share</p>
            <ActionList />
          </div>
        </div>
      )}

      {isOpen && !isMobile && (
        <div className="absolute right-0 mt-2 w-64 bg-black/80 text-white rounded-lg shadow-lg p-2 animate-fade-in z-40">
          {ActionList()}
        </div>
      )}

      {showPlaylistModal && <PlaylistModal />}
    </>
  );
};

export default ShareButton;
