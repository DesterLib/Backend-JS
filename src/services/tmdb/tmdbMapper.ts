import { TmdbMovieData, TmdbTvShowData } from "./TmdbTypes";

export function mapTmdbMovie(data: any): TmdbMovieData {
  return {
    externalId: data.id || 0,
    externalSource: "tmdb",
    adult: data.adult || false,
    title: data.name || "unavailable",
    description: data.overview || "unavailable",
    poster_url: data.poster_url || "",
    backdrop_url: data.backdrop_url || "",
    origin_country: data.origin_country || "unavailable",
    original_language: data.original_language || "unavailable",
    original_title: data.original_title || "unavailable",
    tagline: data.tagline || "unavailable",
  };
}

export function mapTmdbTvShow(data: any): TmdbTvShowData {
  return {
    externalId: data.id || 0,
    externalSource: "tmdb",
    adult: data.adult || false,
    title: data.name || "unavailable",
    description: data.overview || "unavailable",
    poster_url: data.poster_url || "",
    backdrop_url: data.backdrop_url || "",
    origin_country: data.origin_country || "unavailable",
    original_language: data.original_language || "unavailable",
    original_title: data.original_title || "unavailable",
    tagline: data.tagline || "unavailable",
    seasons: data.seasons,
  };
}
