"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaPlay, FaArrowUp } from "react-icons/fa";
import { artists, playlists, tracks } from "@/constants";
import Image from "next/image";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => setIsVisible(window.scrollY > 300);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      <header className="bg-gray-950 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl">Notent</h1>
        <nav className="hidden md:flex gap-4">
          <a href="#features" className="text-white">Home</a>
          <a href="#about" className="text-white">Features</a>
          <a href="#download" className="text-white">Download</a>
          <a href="#pricing" className="text-white">Pricing</a>
        </nav>
        <button
          className="md:hidden text-white fixed right-4 top-4 z-50"
          onClick={toggleMenu}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <nav
           className={clsx("fixed top-0 left-0 w-full h-full bg-black flex flex-col items-center justify-center transform transition-transform duration-300 ease-in-out z-40", {
            "translate-y-0": isOpen,
            "-translate-y-full": !isOpen,
          })}
        >
          <a
            href="#features"
            className="text-white py-4 text-lg"
            onClick={toggleMenu}
          >
            Home
          </a>
          <a
            href="#about"
            className="text-white py-4 text-lg"
            onClick={toggleMenu}
          >
            Features
          </a>
          <a
            href="#download"
            className="text-white py-4 text-lg"
            onClick={toggleMenu}
          >
            Download
          </a>
          <a
            href="#pricing"
            className="text-white py-4 text-lg"
            onClick={toggleMenu}
          >
            Pricing
          </a>
          <div className="gap-6 flex">
            <button className="bg-pink-500 text-white px-4 py-2 rounded">
              <Link href="/login">Login</Link>
            </button>
            <button className="bg-pink-500 text-white px-4 py-2 rounded">
              <Link href="/signin">Sign Up</Link>
            </button>
          </div>
        </nav>
        <div className="hidden md:flex gap-4">
          <button className="text-white">
            <Link href="/login">Login</Link>
          </button>
          <button className="bg-pink-500 text-white px-4 py-2 rounded">
            <Link href="/signup">Sign Up</Link>
          </button>
        </div>
      </header>
      <section className="relative bg-gray-950 min-h-screen flex items-center justify-center text-white">
        <Image
          src="/hero-icon.webp"
          alt="hero"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          style={{ objectFit: "cover", opacity: 0.2, zIndex: 0 }}
          priority
        />
        <div className="relative z-10 text-center p-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            Music Without Limits
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6">
            Discover and share your music journey with Notent. Unleash your
            passion and connect with a community of music lovers.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <Link href="/signin">
              <button className="bg-pink-600 hover:bg-pink-700 transition py-3 px-8 rounded-full text-lg font-semibold">
                Get Started
              </button>
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-sm text-gray-400">
              Available on all platforms. Join now and start your musical
              adventure.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-950 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Curated Playlists For You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {playlists.map((playlist, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={playlist.imageUrl}
                  alt={`${playlist.title} Playlist`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-white">
                      {playlist.title}
                    </h3>
                    <p className="text-gray-400 mt-2">{playlist.description}</p>
                    <Link href="signup">
                      <button className="mt-4 bg-pink-600 text-white py-2 px-6 rounded-full hover:bg-pink-700 transition">
                        Listen Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-950 text-white p-8 text-center">
        <h3 className="text-3xl font-bold mb-6">Trending Artists</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {artists.map((artist, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-center"
            >
              <Image
                src={artist.image}
                alt={artist.name}
                width={128}
                height={128}
                className="rounded-full mb-4 mx-auto object-cover shadow-lg w-32 h-32"
                style={{ objectFit: "cover" }}
              />
              <h4 className="text-lg font-semibold">{artist.name}</h4>
              <p className="text-gray-300 text-sm">{artist.genre}</p>
              <p className="text-gray-400 text-sm">
                Top Song: {artist.topSong}
              </p>
            </div>
          ))}
        </div>
        <button className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition">
          See All Artists
        </button>
      </section>
      <section className="bg-gray-950 text-white p-6 md:p-8 lg:p-12 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Taylor Alison Swift
        </h3>
        <p className="text-base md:text-lg mb-6 mx-auto max-w-3xl">
          Taylor Alison Swift is an American singer-songwriter known for her
          narrative songwriting, which often centers around her personal
          experiences and relationships.
        </p>
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 md:gap-8">
          <div className="flex-shrink-0">
            <Image
              src="/taylor-swift-transparent.webp"
              alt="Taylor Swift"
              width={256}
              height={256}
              className="rounded-full w-full h-full mx-auto object-cover shadow-lg border-2 border-gray-800"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex-1 mt-6 md:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl md:text-2xl font-semibold">
                Latest Songs
              </h4>
              <a href="#" className="text-pink-500 hover:underline">
                View All
              </a>
            </div>
            <ul className="list-none p-0 space-y-3">
              {tracks.map((track, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg shadow-md gap-16"
                >
                  <div className="flex items-center">
                    <Image
                      src={track.imgSrc}
                      alt={track.title}
                      width={40}
                      height={40}
                      className="md:w-10 md:h-10 rounded-lg mr-3 border-2 border-gray-700 w-8 h-8"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <span className="block text-sm md:text-base font-medium">
                        {track.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">
                      {track.duration}
                    </span>
                    <Link href="/signup">
                      <button className="text-pink-500 hover:text-pink-400">
                        <FaPlay size={18} />
                      </button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <footer className="bg-gray-950 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2 lg:col-span-1">
              <h4 className="text-2xl font-semibold mb-4">Notent</h4>
              <p className="text-gray-400 mb-4 hidden md:flex">
                Say goodbye to interruptions and enjoy uninterrupted music
                streaming.
              </p>
              <Link href="/register">
                <button className="bg-pink-600 text-white p-2 px-6 rounded-full hover:bg-pink-700 transition">
                  Sign Up
                </button>
              </Link>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Get Started</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#download" className="hover:underline">
                    Download
                  </a>
                </li>
                <li>
                  <a href="#new-users" className="hover:underline">
                    New Users
                  </a>
                </li>
                <li>
                  <a href="#upgrade" className="hover:underline">
                    Upgrade
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#sign-in" className="hover:underline">
                    Sign In
                  </a>
                </li>
                <li>
                  <a href="#preferences" className="hover:underline">
                    Preferences
                  </a>
                </li>
                <li>
                  <a href="#support" className="hover:underline">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Price</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:underline">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#plans" className="hover:underline">
                    Plans
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:underline">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#music" className="hover:underline">
                    Music
                  </a>
                </li>
                <li>
                  <a href="#artists" className="hover:underline">
                    Artists
                  </a>
                </li>
                <li>
                  <a href="#albums" className="hover:underline">
                    Albums
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 Notent. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#terms" className="hover:underline">
                Terms & Conditions
              </a>
              <a href="#privacy" className="hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-12 h-12 bg-transparent text-white border-none rounded-full flex justify-center items-center cursor-pointer z-50 transition-colors duration-300 ease-in-out"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
