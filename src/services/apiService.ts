import { fetchTmdbMovie } from "./tmdb/tmdbService";
import { ServiceEndpoint, ServiceProvider } from "./types";

interface ApiDataProps {
  apiProvider: ServiceProvider;
  endpoint: ServiceEndpoint;
  params: ApiDataParamsProps;
}

interface ApiDataParamsProps {
  id: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export async function fetchApiData({
  apiProvider,
  endpoint,
  params,
}: ApiDataProps) {
  switch (apiProvider) {
    case "tmdb":
      if (endpoint === "movie") return await fetchTmdbMovie(params.id);
      throw new Error(`TMDB endpoint "${endpoint}" is not supported.`);

    // TODO
    // case "anilist":

    //   if (endpoint === "movie") return await fetchAnilistAnime(id);
    //   throw new Error(`AniList endpoint "${endpoint}" is not supported.`);

    default:
      throw new Error(`API type "${apiProvider}" is not supported.`);
  }
}
