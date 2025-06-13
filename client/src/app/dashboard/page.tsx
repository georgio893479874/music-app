"use client"

import { getRecommendations } from "@/api/recommendations";
import { RecommendationSection } from "@/components/RecommendationSection";
import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [madeForYou, setMadeForYou] = useState([]);
  const [discovery, setDiscovery] = useState([]);
  const [newMusic, setNewMusic] = useState([]);

  useEffect(() => {
    getRecommendations("made_for_you").then(setMadeForYou);
    getRecommendations("discovery").then(setDiscovery);
    getRecommendations("new_music").then(setNewMusic);
  }, []);

  return (
    <div>
      <RecommendationSection title="Made for You" recommendations={madeForYou} />
      <RecommendationSection title="Discovery Station" recommendations={discovery} />
      <RecommendationSection title="New Music Mix" recommendations={newMusic} />
    </div>
  );
};
