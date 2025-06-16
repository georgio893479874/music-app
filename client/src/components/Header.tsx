"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Bell } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import clsx from "clsx";

const navItems = [
  { name: "Music", path: "/music" },
  { name: "Podcast", path: "/podcast" },
  { name: "Live", path: "/live" },
  { name: "Radio", path: "/radio" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <header className="px-6 py-3 bg-[#212121] border-b border-gray-800 flex items-center justify-between">
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
