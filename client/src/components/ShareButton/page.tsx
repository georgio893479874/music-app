import { useState, useEffect, useRef, FC, JSX } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import {
  Plus,
  Share2,
  Link,
  Radio,
  MessageCircleWarning,
  QrCode,
} from "lucide-react";

interface MobileAction {
  icon?: JSX.Element;
  label: string;
  onClick?: "copy";
}

const mobileActions: MobileAction[] = [
  {
    icon: <Share2 className="mr-3" size={18} />,
    label: "Share",
    onClick: "copy",
  },
  {
    icon: <Link className="mr-3" size={18} />,
    label: "Copy Link",
    onClick: "copy",
  },
  {
    icon: <Radio className="mr-3" size={18} />,
    label: "Go to radio based on artist",
  },
  {
    icon: <MessageCircleWarning className="mr-3" size={18} />,
    label: "Complain",
  },
  { icon: <Plus className="mr-3" size={18} />, label: "Subscribe" },
  { icon: <QrCode className="mr-3" size={18} />, label: "Show Code" },
];

const ShareButton: FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setIsOpen(false),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (menuRef.current && startY.current !== null) {
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        menuRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (menuRef.current && startY.current !== null) {
      const diff = e.changedTouches[0].clientY - startY.current;
      if (diff > 100) {
        setIsOpen(false);
      } else {
        menuRef.current.style.transition = "transform 0.3s ease";
        menuRef.current.style.transform = "translateY(0)";
        setTimeout(() => {
          if (menuRef.current) menuRef.current.style.transition = "";
        }, 300);
      }
    }
    startY.current = null;
  };

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
        >
          <BsThreeDotsVertical size={20} />
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-end z-50 transition-opacity duration-300">
            <div
              {...swipeHandlers}
              ref={menuRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="bg-black/80 w-full rounded-t-2xl p-6 text-white max-h-[80vh] overflow-y-auto animate-slide-up"
            >
              <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-medium text-center mb-4">Share</p>
              <div className="space-y-3">
                {mobileActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={
                      action.onClick === "copy" ? handleCopyLink : undefined
                    }
                    className="flex items-center w-full p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                  >
                    {action.icon || null} {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
      >
        <BsThreeDotsVertical size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-black/80 text-white rounded-lg shadow-lg p-2 animate-fade-in">
          {mobileActions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick === "copy" ? handleCopyLink : undefined}
              className="flex items-center w-full p-2 rounded hover:bg-gray-700"
            >
              {action.icon || null} {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareButton;
