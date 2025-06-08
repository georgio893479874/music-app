"use client";
import Header from "@/components/Header";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ["/login", "/signup", "/"];

  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen min-h-0">
      <Sidebar/>
      <div className="flex-1 flex flex-col min-h-0">
        <Header/>
        <main className="flex-1 overflow-y-auto min-h-0 bg-[#212121]">
          {children}
        </main>
      </div>
      <Player/>
    </div>
  );
}