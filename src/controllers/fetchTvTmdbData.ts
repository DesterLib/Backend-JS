import axios from "axios";
import excludeKeys from "../utils/excludeKeys";
import fetchWithRetry from "../utils/fetchWithRetry";

// Function to fetch TMDB data for TV base data only
async function fetchTvTmdbDataBase(tmdbId: string): Promise<any> {
  return fetchWithRetry(async () => {
    const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`;
    const response = await axios.get(url);
    const filteredResponse = excludeKeys(response.data, [
      "created_by",
      "episode_run_time",
      "homepage",
      "in_production",
      "languages",
      "networks",
      "production_companies",
      "production_countries",
      "seasons",
      "spoken_languages",
      "type",
    ]);
    return filteredResponse;
  });
}

// Function to fetch TMDB data for TV detailed seasons data only
async function fetchTvTmdbDataSeason(
  tmdbId: string,
  seasonNumber: number
): Promise<any> {
  return fetchWithRetry(async () => {
    const url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-US`;
    const response = await axios.get(url);
    const filteredResponse = excludeKeys(response.data, ["episodes"]);
    return filteredResponse;
  });
}

// Function to fetch TMDB data for TV detailed episodes data only
async function fetchTvTmdbDataEpisode(
  tmdbId: string,
  seasonNumber: number,
  episodeNumber: number
): Promise<any> {
  return fetchWithRetry(async () => {
    const url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-US`;
    const response = await axios.get(url);
    const filteredResponse = excludeKeys(response.data, [
      "crew",
      "guest_stars",
    ]);
    return filteredResponse;
  });
}

export { fetchTvTmdbDataBase, fetchTvTmdbDataSeason, fetchTvTmdbDataEpisode };
