'use client'

import { useState } from 'react';
import Link from 'next/link';
import { libraryItems, menuItems } from '@/constants';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Home');

  return (
    <>
      <div className="hidden lg:flex flex-col w-64 h-screen bg-[#272727] text-gray-200 fixed top-0 left-0">
        <div className="flex items-center justify-center h-20 bg-[#2b2b2b] gap-3">
          <span className="text-4xl font-bold text-gray-400">Notent</span>
        </div>
        <nav className="mt-10">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2 ${
                      activeItem === item.name ? 'bg-gray-800 text-white' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveItem(item.name)}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-400 uppercase pl-4">Library</h2>
          <ul className="mt-4">
            {libraryItems.map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2 ${
                      activeItem === item.name ? 'bg-gray-800 text-white' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveItem(item.name)}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg:hidden z-50 fixed bottom-0 left-0 right-0 bg-[#212121] text-gray-200 flex justify-around py-2 shadow-inner">
        {menuItems.slice(0, 4).map((item) => (
          <Link href={item.path} key={item.name}>
            <div
              className={`flex flex-col items-center justify-center ${
                activeItem === item.name ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
