import { getToken } from "@/constants";
import axios from "axios";

export const getRecommendations = async (type: string) => {
  const token = getToken();
  try {
    const res = await axios.get(`http://localhost:4521/recommendations?type=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error(`Failed to fetch recommendations (${type}):`, error);
    return [];
  }
};
