import { BaseApi } from "../baseApi";
import { mapTmdbMovie } from "./tmdbMapper";

export class TmdbApi extends BaseApi {
  constructor(apiKey: string) {
    super("https://api.themoviedb.org/3");
    this.client.defaults.params = { api_key: apiKey };
  }

  async getMovieDetails(movieId: string) {
    const movie = await this.get(`/movie/${movieId}`);
    return mapTmdbMovie(movie);
  }

  async searchMovies(query: string) {
    return this.get("/search/movie", { query });
  }
}