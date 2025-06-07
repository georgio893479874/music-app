"use client"

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { libraryItems, menuItems } from '@/constants';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { ListMusic } from 'lucide-react';

export default function Sidebar({ sidebarWidth, setSidebarWidth }: { sidebarWidth: number, setSidebarWidth: (w: number) => void }) {
    const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        setSidebarWidth(Math.max(180, Math.min(e.clientX, 500)));
      }
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setSidebarWidth]);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
  };

  return (
    <div>
      <div
        className="hidden lg:flex flex-col h-screen bg-[#212121] text-gray-200 fixed top-0 left-0 transition-all"
        style={{ width: sidebarWidth }}
      >
        <nav className="mt-16">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <div
                    className="flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2"
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pl-6 pr-6">
          <Accordion>
            <AccordionItem
              title={
                <div className="flex items-center">
                  <ListMusic className="mr-2"/>
                  Library
                </div>
              }
            >
              <ul>
                {libraryItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.path}>
                      <div
                        className="flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2"
                      >
                        <span className="mr-4">{item.icon}</span>
                        {item.name}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        </div>
        <div
          className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-50"
          onMouseDown={handleMouseDown}
          style={{ userSelect: "none" }}
        />
      </div>
      <div className="lg:hidden z-50 fixed bottom-0 left-0 right-0 text-gray-200 flex justify-around py-2 shadow-inner">
        {menuItems.slice(0, 4).map((item) => (
          <Link href={item.path} key={item.name}>
            <div
              className="flex flex-col items-center justify-center text-white"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}