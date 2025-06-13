import React from "react";

type Recommendation = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  cover?: string;
};

interface Props {
  title: string;
  recommendations: Recommendation[];
}

export const RecommendationSection: React.FC<Props> = ({ title, recommendations }) => (
  <div className="rec-section">
    <h2>{title}</h2>
    <div className="rec-row">
      {Array.isArray(recommendations) && recommendations.map((rec) => (
        <div className="rec-card" key={rec.id}>
          <img src={rec.cover || "/default-cover.png"} alt={rec.title}/>
          <div className="rec-title">{rec.title}</div>
          <div className="rec-artist">{rec.artist}</div>
          <div className="rec-album">{rec.album}</div>
        </div>
      ))}
    </div>
  </div>
);