"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Album,
  ListMusic,
  User,
  Clock,
  Heart,
  Folder,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  width,
  collapsed,
}: {
  width: number;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <div
      className="h-full bg-[#212121] flex flex-col py-4 transition-all duration-300 flex-shrink-0"
      style={{ width }}
    >
      <div className="flex items-center px-4 mb-6">
        {!collapsed && (
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 h-auto object-contain filter invert"
          />
        )}
      </div>
      <SidebarSection title="MENU" collapsed={collapsed}>
        <SidebarItem
          icon={<Compass className="w-5 h-5" />}
          label="Explore"
          href="/explore"
          active={isActive("/explore")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Album className="w-5 h-5" />}
          label="Albums"
          href="/albums"
          active={isActive("/albums")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<ListMusic className="w-5 h-5" />}
          label="Genres"
          href="/genres"
          active={isActive("/genres")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<User className="w-5 h-5" />}
          label="Artists"
          href="/artists"
          active={isActive("/artists")}
          collapsed={collapsed}
        />
      </SidebarSection>
      <SidebarSection title="LIBRARY" collapsed={collapsed}>
        <SidebarItem
          icon={<Clock className="w-5 h-5" />}
          label="Recent"
          href="/recent"
          active={isActive("/recent")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<ListMusic className="w-5 h-5" />}
          label="All Playlists"
          href="/playlists"
          active={isActive("/playlists")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Heart className="w-5 h-5" />}
          label="Favorites"
          href="/favorites"
          active={isActive("/favorites")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Folder className="w-5 h-5" />}
          label="Local"
          href="/local"
          active={isActive("/local")}
          collapsed={collapsed}
        />
      </SidebarSection>
      <SidebarSection title="SETTING" collapsed={collapsed}>
        <SidebarItem
          icon={<Settings className="w-5 h-5" />}
          label="Account"
          href="/account"
          active={isActive("/account")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<LogOut className="w-5 h-5" />}
          label="Logout"
          href="/logout"
          active={isActive("/logout")}
          collapsed={collapsed}
        />
      </SidebarSection>
    </div>
  );
}

function SidebarSection({
  title,
  children,
  collapsed,
}: {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
}) {
  if (collapsed) return <div className="mb-4">{children}</div>;

  return (
    <div className="mb-6">
      <div className="text-xs text-gray-500 font-semibold px-6 mb-2">
        {title}
      </div>
      <nav className="flex flex-col space-y-1">{children}</nav>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  active,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link href={href}>
      <div
        title={collapsed ? label : undefined}
        className={`flex items-center ${
          collapsed ? "justify-center" : "gap-3 px-6"
        } py-2 cursor-pointer rounded-lg transition text-sm
        ${
          active
            ? "bg-gray-800 text-cyan-400 font-semibold"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <div className="w-5 h-5">{icon}</div>
        {!collapsed && <span>{label}</span>}
      </div>
    </Link>
  );
}
