import axios from "axios";
import excludeKeys from "../utils/excludeKeys";

// Function to fetch TMDB data for Movie base data only
async function fetchMovieTmdbData(tmdbId: string): Promise<any> {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`;
  const response = await axios.get(url);
  const filteredResponse = excludeKeys(response.data, [
    "created_by",
    "homepage",
    "in_production",
    "languages",
    "networks",
    "production_companies",
    "production_countries",
    "spoken_languages",
    "type",
  ]);
  return filteredResponse;
}

export { fetchMovieTmdbData };
