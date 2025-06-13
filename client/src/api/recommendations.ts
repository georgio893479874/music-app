export const getRecommendations = async (type: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommendations?type=${type}`);
  return res.json();
};