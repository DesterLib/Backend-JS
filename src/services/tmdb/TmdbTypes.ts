import { ServiceProvider } from "../types";

export interface TmdbBaseMTData {
  externalId: number;
  externalSource: ServiceProvider;
  adult: boolean;
  title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  tagline: string;
}

export interface TmdbMovieData extends TmdbBaseMTData {}

export interface TmdbTvShowData extends TmdbBaseMTData {
  seasons: TmdbTvShowSeasonData[];
}

export interface TmdbTvShowSeasonData {
  season_number: number;
  name: string;
  description: string;
}

export interface TmdbPersonData {
  name: string;
  biography: string;
  birthday: string;
  gender: string;
  profile_url: string;
}
