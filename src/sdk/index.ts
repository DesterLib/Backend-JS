import { TmdbApi } from "./apis/tmdb/tmdb";
import { AnilistApi } from "./apis/anilist/anilist";
import { ENV_TMDB_API_KEY } from "../config";

class ExternalSdk {
  tmdb: TmdbApi;
  anilist: AnilistApi;

  constructor() {
    this.tmdb = new TmdbApi(ENV_TMDB_API_KEY);
    this.anilist = new AnilistApi();
  }
}

export default ExternalSdk;
