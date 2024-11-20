import { Movie } from "../types";

export function mapTmdbMovie(movie: any): Movie {
  return {
    externalId: movie.id,
    externalSource: "TMDB",
    mediaType: "movie",
    title: movie.title || movie.original_title,
    overview: movie.overview,
    posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  };
}