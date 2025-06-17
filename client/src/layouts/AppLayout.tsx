"use client";

import Header from "@/components/Header";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import Queue from "@/components/Queue";
import { usePathname } from "next/navigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState, useEffect } from "react";
import { usePlayerContext } from "@/contexts/PlayerContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ["/login", "/signup", "/"];
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [minSidebarSize, setMinSidebarSize] = useState(10);
  const { songs, selectedSong, setSelectedSong, isPlaying } = usePlayerContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const percent = (140 / window.innerWidth) * 100;
      setMinSidebarSize(percent);
    }
  }, []);

  const collapsed = sidebarWidth <= 140;

  if (!shouldShowSidebar) return <>{children}</>;

  return (
    <div className="h-screen min-h-0 flex flex-col">
      <PanelGroup direction="horizontal" className="flex-1 min-h-0">
        <Panel
          minSize={minSidebarSize}
          maxSize={25}
          defaultSize={14}
          onResize={(size) => setSidebarWidth((size * window.innerWidth) / 100)}
          className="transition-all duration-300"
        >
          <Sidebar width={sidebarWidth} collapsed={collapsed} />
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-700 cursor-col-resize" />
        <Panel className="flex-1 flex flex-col min-h-0" style={{ height: "calc(100vh - 80px)" }}>
          <Header />
          <main className="flex-1 overflow-y-auto bg-[#212121] rounded-2xl m-4 shadow-lg">
            {children}
          </main>
        </Panel>
        {isQueueVisible && (
          <>
            <PanelResizeHandle className="w-1 bg-gray-700 cursor-col-resize"/>
            <Panel
              defaultSize={14}
              minSize={8}
              maxSize={20}
              className="min-w-[200px] max-w-[400px]"
            >
              <Queue
                songs={songs}
                selectedSong={selectedSong}
                setSelectedSong={setSelectedSong}
                onClose={() => {}}
                isPlaying={isPlaying}
              />
            </Panel>
          </>
        )}
      </PanelGroup>
      <Player onQueueToggle={() => setIsQueueVisible((v) => !v)} />
    </div>
  );
}