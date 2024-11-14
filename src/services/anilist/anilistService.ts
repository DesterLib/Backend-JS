import axios from "axios";
import { AnilistMovieData } from "./AnilistTypes";
import { mapTmdbMovie } from "./tmdbMapper";

const BASE_URL = 'https://graphql.anilist.co';

export async function fetchTmdbMovie(id: string): Promise<TmdbMovieData> {
  const response = await axios.get(
    `${BASE_URL}/movie/${id}?api_key=${ENV_TMDB_API_KEY}`
  );
  return mapTmdbMovie(response.data);
}
