export type MediaType = "ANIME" | "MANGA" | "MOVIE" | "TVSHOW" | "MUSIC";
export type MediaStatus = "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED";
export type ServiceEndpoint = "movie" | "tvshow" | "person" | "season";
export type ServiceProvider = "tmdb" | "anilist";

export interface BaseMediaData {
  adult: boolean;
  id: number | string;
  title_original: string;
  title_english: string;
  description: string;
  media_type: MediaType;
  poster_url: string;
  genres: string[];
  status: MediaStatus;
  origin_country: string;
  original_language: string;
}

export interface MediaMovieData extends BaseMediaData {
  backdrop_url: string;
  tagline: string;
}

export interface MediaTvShowData extends BaseMediaData {
  title_romanji?: string;
  backdrop_url: string;
  number_of_seasons: number;
  number_of_episodes: number;
  tagline: string;
}

export interface MediaMangaData extends BaseMediaData {
  author: string;
  number_of_chapters: string;
}

export interface MediaMusicData extends BaseMediaData {
  author: string;
}
