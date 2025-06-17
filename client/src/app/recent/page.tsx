'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { API_URL } from "@/constants";
import { HistoryEntry } from "@/types";

export default function RecentPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(
          `${API_URL}/history?userId=${userId}`
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-white p-8">Завантаження історії...</div>;
  }

  return (
    <div className="p-8 bg-[#1e1e1e] text-white h-[calc(100vh-160px)]">
      <h1 className="text-3xl font-bold mb-6">Історія прослуховування</h1>
      {history.length === 0 ? (
        <p className="text-gray-400">У вас ще немає історії прослуховування.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center bg-[#2c2c2c] rounded-lg p-4 shadow-md"
            >
              <Image
                src={entry.track.coverImagePath}
                alt={entry.track.title}
                width={64}
                height={64}
                className="rounded-md mr-4 object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{entry.track.title}</h2>
                <p className="text-sm text-gray-400">
                  Played: {new Date(entry.listenedAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

