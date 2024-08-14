export interface Episode {
  episode_number: number;
  file_path: string;
  tmdb_data?: any;
}

export interface Season {
  season_number: number;
  file_path: string;
  tmdb_data?: any;
  episodes: Episode[];
}

export interface TVShow {
  media_type: "tv";
  tmdb_data: string;
  seasons: Season[];
}
