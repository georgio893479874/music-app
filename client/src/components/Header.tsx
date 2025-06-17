"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mail, Bell } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

const navItems = [
  { name: "Music", path: "/music" },
  { name: "Podcast", path: "/podcast" },
  { name: "Live", path: "/live" },
  { name: "Radio", path: "/radio" },
];

const Header = () => {
  const [query, setQuery] = useState("");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(pathname);

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

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <header className="px-6 py-3 bg-[#212121] flex items-center justify-between">
      <nav className="flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={clsx(
              "transition hover:text-white",
              active === item.path
                ? "text-cyan-400 font-semibold"
                : "text-gray-400"
            )}
          >
            {item.name}
          </button>
        ))}
      </nav>
      <div
          className="relative flex group mx-2"
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
        >
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
          <input
            ref={inputRef}
            type="text"
            className="w-96 p-3 pl-10 pr-16 rounded-2xl bg-[#373636] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
      <div className="flex items-center gap-6">
        <div className="relative">
          <Mail
            className="text-gray-400 hover:text-white cursor-pointer transition"
            size={20}
          />
        </div>
        <div className="relative">
          <Bell
            className="text-gray-400 hover:text-white cursor-pointer transition"
            size={20}
          />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <ProfileAvatar />
      </div>
    </header>
  );
};

export default Header;
