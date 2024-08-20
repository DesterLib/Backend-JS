import { Router } from "express";
import mergeAllData from "../controllers/mergeAllData";
import jsonQuery from "json-query";
import excludeKeys from "../utils/excludeKeys";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await mergeAllData();

    const filteredDataResponse = data.slice(0, 6).map((item: any) => {
      const filteredMovie: any = excludeKeys(item, ["files", "seasons"]);

      return {
        ...filteredMovie,
        tmdb_data: excludeKeys(filteredMovie.tmdb_data, [
          "belongs_to_collection",
          "budget",
          "imdb_id",
          "origin_country",
          "original_language",
          "revenue",
          "video",
          "vote_count",
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
          "seasons",
        ]),
      };
    });

    const movies = jsonQuery("[*media_type=movie]", {
      data: data,
    }).value;

    const filteredMoviesResponse = movies.map((movie: any) => {
      const filteredMovie: any = excludeKeys(movie, ["files"]);

      return {
        ...filteredMovie,
        tmdb_data: excludeKeys(filteredMovie.tmdb_data, [
          "belongs_to_collection",
          "budget",
          "imdb_id",
          "origin_country",
          "original_language",
          "revenue",
          "video",
          "vote_count",
        ]),
      };
    });

    const tvShows = jsonQuery("[*media_type=tv]", {
      data: data,
    }).value;

    const filteredTvShowsResponse = tvShows.map((tvShow: any) => {
      const filteredTvShow: any = excludeKeys(tvShow, ["files", "seasons"]);

      return {
        ...filteredTvShow,
        tmdb_data: excludeKeys(filteredTvShow.tmdb_data, [
          "created_by",
          "episode_run_time",
          "homepage",
          "in_production",
          "languages",
          "networks",
          "production_companies",
          "production_countries",
          "spoken_languages",
          "type",
        ]),
      };
    });

    res.json({
      carousel: filteredDataResponse,
      movies: filteredMoviesResponse,
      tv_shows: filteredTvShowsResponse,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while merging data." });
  }
});

router.post("/", async (req, res) => {
  res.json({
    message: "Successfully generated content for Home Page",
  });
});

export default router;
