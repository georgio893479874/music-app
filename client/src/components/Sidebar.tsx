"use client"

import Link from 'next/link';
import { libraryItems, menuItems } from '@/constants';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { ListMusic } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-[#212121] text-gray-200">
      <nav className="mt-16">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}>
                <div className="flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2">
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
                    <div className="flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2">
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
    </div>
  );
}