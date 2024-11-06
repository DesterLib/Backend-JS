export interface Episode {
  episode_number: number;
  file_path: string;
}

export interface Season {
  season_number: number;
  file_path: string;
  episodes: Episode[];
}

export interface TVShow {
  media_type: "tv";
  seasons: Season[];
  id: string;
  name: string;
}

export interface Movie {
  media_type: "movie";
  files: any;
  id: string;
  name: string;
}
