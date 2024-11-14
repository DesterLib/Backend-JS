import { MediaTvShowData } from "../types";

export function mapAnilistAnime(data: any): MediaTvShowData {
  return {
    id: data.id,
    adult: false,
    title_english: data.title.english || "unavailable",
    title_original: data.title.romaji || "unavailable",
    description: data.description || "unavailable",
    poster_url: data.coverImage?.large || "",
    backdrop_url: data.bannerImage || "",
    origin_country: "unavailable",
    original_language: data.countryOfOrigin || "unavailable",
    tagline: "unavailable",
    media_type: "ANIME",
    status: data.status || "unavailable",
    genres: data.genres || [],
    number_of_episodes: data.episodes || 0,
    number_of_seasons: 0,
  };
}