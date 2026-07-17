"use client"
import { FaHome, FaCompactDisc, FaFolderOpen } from "react-icons/fa";
import { FaRadio } from "react-icons/fa6";
import { BsMusicNoteList } from "react-icons/bs";
import { PiMicrophoneThin, PiMusicNotesPlusThin } from "react-icons/pi";
import { ImHeart } from "react-icons/im";
import {
  Plus,
  Share2,
  Link,
  Radio,
  MessageCircleWarning,
  QrCode,
} from "lucide-react";
import { MenuItemType } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const artists = [
  {
    name: "Justin Bieber",
    image: "/justin-bieber.webp",
    genre: "Pop",
    topSong: "Sorry",
  },
  {
    name: "Taylor Swift",
    image: "/taylor-swift.webp",
    genre: "Country/Pop",
    topSong: "Love Story",
  },
  {
    name: "Lisa",
    image: "/lisa.webp",
    genre: "K-Pop",
    topSong: "LALISA",
  },
  {
    name: "Ed Sheeran",
    image: "/ed-sheeran.webp",
    genre: "Pop",
    topSong: "Shape of You",
  },
  {
    name: "Rihanna",
    image: "/rihanna.webp",
    genre: "Pop/R&B",
    topSong: "Umbrella",
  },
];

export const menuItems = [
  { name: "Home", icon: <FaHome size={24} />, path: "/dashboard" },
  { name: "Discover", icon: <FaCompactDisc size={24} />, path: "/search" },
  { name: "Radio", icon: <FaRadio size={24} />, path: "/radio" },
  { name: "Podcast", icon: <PiMicrophoneThin size={24} />, path: "/podcast" },
];

export const libraryItems = [
  {
    name: "Recently Added",
    icon: <PiMusicNotesPlusThin size={24} />,
    path: "/recent",
  },
  { name: "Albums", icon: <BsMusicNoteList size={24} />, path: "/albums" },
  { name: "Favorite Songs", icon: <ImHeart size={24} />, path: "/favorites" },
  { name: "Local Files", icon: <FaFolderOpen size={24} />, path: "/local" },
];

export const playlists = [
  {
    title: "Chill Vibes",
    description: "Relax and unwind with this smooth collection of beats.",
    imageUrl: "/chill-vibes-icon.webp",
  },
  {
    title: "Top Hits",
    description: "The biggest songs of the moment, all in one place.",
    imageUrl: "/top-hits-icon.webp",
  },
  {
    title: "Party Anthems",
    description: "Get the party started with these high-energy tracks.",
    imageUrl: "/party-anthems-icon.webp",
  },
  {
    title: "Workout Boost",
    description: "Pump up your workout with these motivating tracks.",
    imageUrl: "/workout-boost-icon.webp",
  },
];

export const tracks = [
  {
    title: "Anti-Hero",
    duration: "03:21",
    imgSrc: "/midnight.webp",
  },
  {
    title: "Blank Space",
    duration: "04:22",
    imgSrc: "/1989.webp",
  },
  {
    title: "Gorgeous",
    duration: "03:56",
    imgSrc: "/reputation.webp",
  },
  {
    title: "Lover",
    duration: "04:01",
    imgSrc: "/lover.webp",
  },
  {
    title: "Red",
    duration: "03:45",
    imgSrc: "/red.webp",
  },
  {
    title: "Midnight",
    duration: "04:12",
    imgSrc: "/midnight.webp",
  },
];

export const genres = [
  { image: "/pop.webp", id: 1 },
  { image: "/jazz.webp", id: 2 },
  { image: "/electronic.webp", id: 3 },
  { image: "/funk.webp", id: 4 },
  { image: "/country.webp", id: 5 },
  { image: "/rock.webp", id: 6 },
  { image: "/classical.webp", id: 7 },
  { image: "/RnB.webp", id: 8 },
  { image: "/soul.webp", id: 9 },
  { image: "/blues.webp", id: 10 },
  { image: "/latino.webp", id: 11 },
  { image: "/metal.webp", id: 12 },
  { image: "/k-pop.webp", id: 13 },
  { image: "/indie.webp", id: 14 },
  { image: "/african.webp", id: 15 },
  { image: "/hip-hop.webp", id: 16 },
  { image: "/ambient.webp", id: 17 },
  { image: "/karaoke.webp", id: 18 },
  { image: "/dance.webp", id: 19 },
  { image: "/punk.webp", id: 20 },
];

export const mobileActions = [
  {
    icon: <Share2 className="mr-3" size={18} />,
    label: "Share",
    onClick: "copy",
  },
  {
    icon: <Plus className="mr-3" size={18} />,
    label: "Add to Playlist",
    onClick: "addToPlaylist",
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

export const menuSections: MenuItemType[][] = [
  [
    { label: "About us", href: "/" },
    { label: "Legal", href: "/" },
    { label: "Copyright", href: "/" },
  ],
  [
    { label: "Mobile apps", href: "/" },
    { label: "For Creators", href: "/" },
    { label: "Blog", href: "/" },
    { label: "Jobs", href: "/" },
    { label: "Developers", href: "/" },
  ],
  [
    { label: "Support", href: "/" },
    { label: "Keyboard shortcuts", href: "/" },
  ],
  [
    { label: "Subscription", href: "/" },
    { label: "Settings", href: "/settings" },
    { label: "Sign out", href: "/login", action: "logout" },
  ],
];

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getUserId = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId");
  }
  return null;
};