"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import ProfileAvatar from "./ProfileAvatar";
import { Bell, Mail } from "lucide-react";

const Header = () => {
  const [query, setQuery] = useState("");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/search") {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("query") || "");
    } else {
      setQuery("");
    }
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (pathname !== "/search") {
      router.push(`/search?query=${encodeURIComponent(e.target.value)}`);
    } else {
      const url = `/search?query=${encodeURIComponent(e.target.value)}`;
      router.replace(url);
    }
  };

  const handleClear = () => {
    setQuery("");
    router.replace("/search");
    inputRef.current?.focus();
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-2 fixed top-0 left-0 z-50 bg-[#212121]">
      <div className="flex items-center gap-2 w-full max-w-4xl mx-auto">
        <button
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#373636] bg-opacity-60 hover:bg-opacity-80 transition"
          onClick={() => window.history.back()}
          aria-label="Back"
        >
          <IoChevronBack size={24} className="text-white"/>
        </button>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#373636] bg-opacity-60 hover:bg-opacity-80 transition"
          onClick={() => window.history.forward()}
          aria-label="Next"
        >
          <IoChevronForward size={24} className="text-white"/>
        </button>
        <div
          className="relative flex-1 group mx-2"
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
        >
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
          <input
            ref={inputRef}
            type="text"
            className="w-full p-3 pl-10 pr-16 rounded-2xl bg-[#373636] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Search songs, albums, or artists..."
            value={query}
            onChange={handleInput}
            onFocus={() => setShowHint(true)}
            onBlur={() => setShowHint(false)}
          />
          <span
            className={`absolute right-12 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-[#333] text-xs text-gray-200 border border-gray-600 transition-opacity duration-200 ${
              showHint ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Ctrl+K
          </span>
          {pathname === "/search" && query && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#232323] transition"
              onClick={handleClear}
              aria-label="Очистити"
              tabIndex={-1}
              type="button"
            >
              <IoClose size={22} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Mail className="fixed right-32 text-white"/>
          <Bell className="fixed right-20 text-white"/>
          <ProfileAvatar/>
        </div>
      </div>
    </header>
  );
};

export default Header;