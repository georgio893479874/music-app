"use client";

import Header from "@/components/Header";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import Queue from "@/components/Queue";
import { usePathname } from "next/navigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from "react";
import { usePlayerContext } from "@/contexts/PlayerContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ["/login", "/signup", "/", "/mini-player"];
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const { songs, selectedSong, setSelectedSong } = usePlayerContext();

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen min-h-0 flex flex-col mt-32">
      <Header />
      <PanelGroup direction="horizontal" className="flex-1 min-h-0">
        <Panel defaultSize={14} minSize={8} maxSize={20} className="min-w-[56px]">
          <Sidebar/>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-700 cursor-col-resize" />
        <Panel className="flex-1 flex flex-col min-h-0">
          <main className="flex-1 overflow-y-auto min-h-0 bg-[#212121] rounded-2xl m-4 shadow-lg">
            {children}
          </main>
        </Panel>
        {isQueueVisible && (
          <>
            <PanelResizeHandle className="w-1 bg-gray-700 cursor-col-resize" />
            <Panel defaultSize={14} minSize={8} maxSize={20} className="min-w-[200px] max-w-[400px]">
              <Queue
                songs={songs}
                selectedSong={selectedSong}
                setSelectedSong={setSelectedSong}
                onClose={() => setIsQueueVisible(false)}
              />
            </Panel>
          </>
        )}
      </PanelGroup>
      <Player onQueueToggle={() => setIsQueueVisible((v) => !v)}/>
    </div>
  );
}