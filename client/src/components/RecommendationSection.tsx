import { Props } from "@/types";
import Image from "next/image";
import React from "react";

export const RecommendationSection: React.FC<Props> = ({ title, recommendations }) => (
  <div className="rec-section">
    <h2>{title}</h2>
    <div className="rec-row">
      {Array.isArray(recommendations) && recommendations.map((rec) => (
        <div className="rec-card" key={rec.id}>
          <Image src={rec.coverUrl || "/default-cover.png"} alt={rec.title} width={40} height={40} />
          <div className="rec-title">{rec.title}</div>
          <div className="rec-artist">{rec.album?.artist?.name || 'Unknown Artist'}</div>
          <div className="rec-album">{rec.album?.title || 'Unknown Album'}</div>
        </div>
      ))}
    </div>
  </div>
);
