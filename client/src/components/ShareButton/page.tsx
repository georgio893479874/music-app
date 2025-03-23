import { Menu, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  BsThreeDotsVertical,
  BsShare,
  BsLink45Deg,
  BsBroadcast,
} from "react-icons/bs";

const ShareButton = () => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Title",
        url: window.location.href,
      });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast.success("URL copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy URL!");
        });
    }
  };

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center justify-center p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition">
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
                  <button
                    className={`${
                      active ? "bg-white/10" : ""
                    } flex items-center px-4 py-3 w-full rounded-lg transition`}
                  >
                    <BsBroadcast className="mr-3" size={18} />
                    Create Station
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleShare}
                    className={`${
                      active ? "bg-white/10" : ""
                    } flex items-center px-4 py-3 w-full rounded-lg transition`}
                  >
                    <BsShare className="mr-3" size={18} />
                    Share
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied!");
                    }}
                    className={`${
                      active ? "bg-white/10" : ""
                    } flex items-center px-4 py-3 w-full rounded-lg transition`}
                  >
                    <BsLink45Deg className="mr-3" size={18} />
                    Copy Link
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
