import Link from 'next/link';
import { libraryItems, menuItems } from '@/constants';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { ListMusic } from 'lucide-react';

export default function Sidebar() {
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
    </>
  );
}