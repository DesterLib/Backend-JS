import { fetchTmdbMovie } from "./tmdb/tmdbService";

type ApiType = "tmdb" | "anilist";
type Endpoint = "movie" | "tvshow" | "person" | "season";

interface ApiDataProps {
  apiType: ApiType;
  endpoint: Endpoint;
  params: ApiDataParamsProps;
}

interface ApiDataParamsProps {
  id: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export async function fetchApiData({
  apiType,
  endpoint,
  params,
}: ApiDataProps) {
  switch (apiType) {
    case "tmdb":
      if (endpoint === "movie") return await fetchTmdbMovie(params.id);
      throw new Error(`TMDB endpoint "${endpoint}" is not supported.`);

    // case "anilist":
    //   if (endpoint === "movie") return await fetchAnilistAnime(id);
    //   throw new Error(`AniList endpoint "${endpoint}" is not supported.`);

    default:
      throw new Error(`API type "${apiType}" is not supported.`);
  }
}
