import { FaHome, FaCompactDisc, FaFolderOpen } from "react-icons/fa";
import { FaRadio } from "react-icons/fa6";
import { BsMusicNoteList } from "react-icons/bs";
import { PiMicrophoneThin, PiMusicNotesPlusThin } from "react-icons/pi";
import { ImHeart } from "react-icons/im";

export const artists = [
  {
    name: "Justin Bieber",
    image: "/justin-bieber.png",
    genre: "Pop",
    topSong: "Sorry",
  },
  {
    name: "Taylor Swift",
    image: "/taylor-swift.png",
    genre: "Country/Pop",
    topSong: "Love Story",
  },
  {
    name: "Lisa",
    image: "/lisa.png",
    genre: "K-Pop",
    topSong: "LALISA",
  },
  {
    name: "Ed Sheeran",
    image: "/ed-sheeran.png",
    genre: "Pop",
    topSong: "Shape of You",
  },
  {
    name: "Rihanna",
    image: "/rihanna.png",
    genre: "Pop/R&B",
    topSong: "Umbrella",
  },
];

export const menuItems = [
	{ name: "Home", icon: <FaHome size={24} />, path: "/dashboard" },
	{ name: "Discover", icon: <FaCompactDisc size={24} />, path: "/search" },
	{ name: "Radio", icon: <FaRadio size={24} />, path: "/radio" },
	{ name: "Albums", icon: <BsMusicNoteList size={24} />, path: "/albums" },
	{ name: "Podcast", icon: <PiMicrophoneThin size={24} />, path: "/podcast" },
];

export const libraryItems = [
	{ name: "Recently Added", icon: <PiMusicNotesPlusThin size={24} />, path: "/recent" },
	{ name: "Favorite Songs", icon: <ImHeart size={24} />, path: "/favorites" },
	{ name: "Local Files", icon: <FaFolderOpen size={24} />, path: "/local" },
];

export const playlists = [
  {
    title: "Chill Vibes",
    description: "Relax and unwind with this smooth collection of beats.",
    imageUrl: "/chill-vibes-icon.jpg",
  },
  {
    title: "Top Hits",
    description: "The biggest songs of the moment, all in one place.",
    imageUrl: "/top-hits-icon.jpg",
  },
  {
    title: "Party Anthems",
    description: "Get the party started with these high-energy tracks.",
    imageUrl: "/party-anthems-icon.jpg",
  },
  {
    title: "Workout Boost",
    description: "Pump up your workout with these motivating tracks.",
    imageUrl: "/workout-boost-icon.jpg",
  },
];

export const tracks = [
  {
    title: "Anti-Hero",
    duration: "03:21",
    imgSrc: "/midnight.jpg",
  },
  { 
		title: "Blank Space", 
		duration: "04:22", 
		imgSrc: "/1989.jpg" 
	},
  { 
		title: "Gorgeous", 
		duration: "03:56", 
		imgSrc: "/reputation.jpg" 
	},
  { 
		title: "Lover", 
		duration: "04:01", 
		imgSrc: "/lover.jpg" 
	},
  { 
		title: "Red", 
		duration: "03:45", 
		imgSrc: "/red.jpg" 
	},
  { 
		title: "Midnight", 
		duration: "04:12", 
		imgSrc: "/midnight.jpg" 
	},
];

export const genres = [
  { image: "/pop.webp" },
  { image: "/jazz.webp" },
  { image: "/electronic.webp" },
  { image: "/funk.webp" },
  { image: "/country.webp" },
  { image: "/rock.webp" },
  { image: "/classical.webp" },
  { image: "/RnB.webp" },
  { image: "/soul.webp" },
  { image: "/blues.webp" },
  { image: "/hip-hop.webp" },
];