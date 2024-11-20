export type MediaType = "movie" | "tvShow" | "manga" | "music";

export interface Movie {
  externalId: number;
  externalSource: 'tmdb' | 'anilist';
  mediaType: MediaType;
  title: string;
  overview: string;
  posterUrl: string;
}

export interface TvShow {
  externalId: number;
  externalSource: string;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterUrl: string;
}
