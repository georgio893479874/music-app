"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL, getUserId } from "@/constants";
import { Artist } from "@/types";
import Link from "next/link";

type MonthlyListens = number | null;

interface ArtistWithListens extends Artist {
  monthlyListens: MonthlyListens;
}

type SortType = "popular" | "name";

const ArtistTile: React.FC<{ artist: ArtistWithListens }> = ({ artist }) => (
  <Link href={`/artist/${artist.id}`} className="cursor-pointer">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 32px",
        width: 170,
        position: "relative",
      }}
    >
      <div
        style={{
          borderRadius: "50%",
          border: "4px solid #2542b8",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#23232C",
          marginBottom: 16,
        }}
      >
        <img
          src={artist.coverPhoto}
          alt={artist.name}
          style={{
            width: 132,
            height: 132,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>
      <span
        style={{
          fontWeight: 600,
          fontSize: 22,
          color: "#fff",
          textAlign: "center",
          maxWidth: 160,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginTop: 0,
          marginBottom: 0,
          fontFamily: "Inter, sans-serif",
          letterSpacing: 0.1,
        }}
      >
        {artist.name}
      </span>
    </div>
  </Link>
);

const Page = () => {
  const [subscriptions, setSubscriptions] = useState<Artist[]>([]);
  const [artists, setArtists] = useState<ArtistWithListens[]>([]);
  const [sortType, setSortType] = useState<SortType>("popular");
  const userId = getUserId();

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/user/${userId}/artist-subscriptions`)
      .then((res) => res.json())
      .then((data: { artist: Artist }[]) =>
        setSubscriptions(data.map((sub) => sub.artist))
      );
  }, [userId]);

  const fetchMonthlyListens = useCallback(async (artist: Artist) => {
    try {
      const { data } = await axios.get<{ monthlyListens: number }>(
        `${API_URL}/performer/${artist.id}/monthly-listens`
      );
      return data.monthlyListens;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!subscriptions.length) return;
    Promise.all(
      subscriptions.map(async (artist) => ({
        ...artist,
        monthlyListens: await fetchMonthlyListens(artist),
      }))
    ).then(setArtists);
  }, [subscriptions, fetchMonthlyListens]);

  const sortedArtists = [...artists].sort((a, b) => {
    if (sortType === "popular") {
      return (b.monthlyListens ?? 0) - (a.monthlyListens ?? 0);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div
      style={{
        background: "#191A22",
        minHeight: "100vh",
        padding: "42px 0",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1100,
          margin: "0 auto 24px",
          padding: "0 24px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 1.3,
            margin: 0,
            fontFamily: "Inter, sans-serif",
          }}
        >
          My Artists
        </h1>
        <div>
          <button
            style={{
              background: sortType === "popular" ? "#23232C" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 24px",
              fontWeight: 600,
              fontSize: 16,
              marginRight: 16,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onClick={() => setSortType("popular")}
          >
            By Popularity
          </button>
          <button
            style={{
              background: sortType === "name" ? "#23232C" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onClick={() => setSortType("name")}
          >
            By Name
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "0 0",
          justifyContent: "flex-start",
          maxWidth: 1100,
          margin: "0 auto",
          background: "#191A22",
          padding: "32px 0",
          borderRadius: 28,
          overflowX: "auto",
        }}
      >
        {sortedArtists.map((artist) => (
          <ArtistTile artist={artist} key={artist.id} />
        ))}
      </div>
    </div>
  );
};

export default Page;
