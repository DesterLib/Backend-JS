import { Router } from "express";
import mergeAllData from "../controllers/mergeAllData";
import jsonQuery from "json-query";
import excludeKeys from "../utils/excludeKeys";

const router = Router();

const filterTmdbData = (tmdbData: any, mediaType: "movie" | "tv") => {
  const commonExclusions = [
    "belongs_to_collection",
    "budget",
    "imdb_id",
    "origin_country",
    "original_language",
    "revenue",
    "video",
    "vote_count",
  ];

  const tvExclusions = [
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
  ];

  const exclusions =
    mediaType === "tv"
      ? [...commonExclusions, ...tvExclusions]
      : commonExclusions;

  return excludeKeys(tmdbData, exclusions);
};

const filterMedia = (item: any, mediaType: "movie" | "tv") => {
  const itemExclusions = mediaType === "tv" ? ["files", "seasons"] : ["files"];

  const filteredItem: any = excludeKeys(item, itemExclusions);

  return {
    ...filteredItem,
    tmdb_data: filterTmdbData(filteredItem.tmdb_data, mediaType),
  };
};

router.get("/", async (req, res) => {
  try {
    const data = await mergeAllData();

    const filteredDataResponse = data
      .slice(0, 6)
      .map((item: any) => filterMedia(item, item.media_type));

    const movies = jsonQuery("[*media_type=movie]", { data }).value;
    const filteredMoviesResponse = movies.map((movie: any) =>
      filterMedia(movie, "movie")
    );

    const tvShows = jsonQuery("[*media_type=tv]", { data }).value;
    const filteredTvShowsResponse = tvShows.map((tvShow: any) =>
      filterMedia(tvShow, "tv")
    );

    res.json({
      carousel: filteredDataResponse,
      movies: filteredMoviesResponse,
      tv_shows: filteredTvShowsResponse,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while merging data." });
  }
});

export default router;
