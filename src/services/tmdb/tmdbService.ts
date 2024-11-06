import axios from "axios";
import { TmdbMovieData } from "./TmdbTypes";
import { ENV_TMDB_API_KEY } from "../../config";
import { mapTmdbMovie } from "./tmdbMapper";

const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTmdbMovie(id: string): Promise<TmdbMovieData> {
  const response = await axios.get(
    `${BASE_URL}/movie/${id}?api_key=${ENV_TMDB_API_KEY}`
  );
  return mapTmdbMovie(response.data);
}