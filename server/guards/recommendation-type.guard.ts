export type RecommendationType = "made_for_you" | "discovery" | "new_music";

export function isRecommendationType(type: string): type is RecommendationType {
  return ["made_for_you", "discovery", "new_music"].includes(type);
}