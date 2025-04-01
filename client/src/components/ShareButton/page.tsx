import { Menu, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  BsThreeDotsVertical,
  BsShare,
  BsLink45Deg,
  BsBroadcast,
} from "react-icons/bs";
import { IoClose } from "react-icons/io5";

const ShareButton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Title",
        url: window.location.href,
      });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("URL copied to clipboard!"))
        .catch(() => toast.error("Failed to copy URL!"));
    }
  };

  if (isMobile) {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center justify-center p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition">
          <BsThreeDotsVertical size={20} />
        </Menu.Button>
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 translate-y-5"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 translate-y-5"
        >
          <div className="absolute inset-x-0 bottom-0 bg-black/70 flex items-end">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-gray-900 rounded-t-2xl p-4 text-white"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-lg font-medium">Options</span>
                <Menu.Button>
                  <IoClose size={24} />
                </Menu.Button>
              </div>
              <div className="py-2 space-y-2">
                <button
                  className="flex items-center w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  <BsBroadcast className="mr-3" size={18} /> Create Station
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  <BsShare className="mr-3" size={18} /> Share
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="flex items-center w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  <BsLink45Deg className="mr-3" size={18} /> Copy Link
                </button>
              </div>
            </motion.div>
          </div>
        </Transition>
      </Menu>
    );
  }

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center justify-center p-2 bg-black/50 rounded-full text-white transition">
            <BsThreeDotsVertical size={20} />
          </Menu.Button>
        </div>
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute rounded-xl right-0 mt-2 w-52 origin-top-right bg-black/40 backdrop-blur-md shadow-lg ring-1 ring-white/10 focus:outline-none"
          >
            <div className="py-1 text-white text-sm rounded-xl">
              <Menu.Item>
                {({ active }) => (
                  <button className={`${active ? "bg-white/10" : ""} flex items-center px-4 py-3 w-full rounded-lg transition`}>
                    <BsBroadcast className="mr-3" size={18} /> Create Station
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={handleShare} className={`${active ? "bg-white/10" : ""} flex items-center px-4 py-3 w-full rounded-lg transition`}>
                    <BsShare className="mr-3" size={18} /> Share
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button className={`${active ? "bg-white/10" : ""} flex items-center px-4 py-3 w-full rounded-lg transition`}>
                    <BsLink45Deg className="mr-3" size={18} /> Copy Link
                  </button>
                )}
              </Menu.Item>
            </div>
          </motion.div>
        </Transition>
      </Menu>
    </div>
  );
};

export default ShareButton;
