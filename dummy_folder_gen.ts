import fs from "fs";
import path from "path";
import axios from "axios";
import "dotenv/config";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

// Access named arguments or default to fallback values
const mediaType = args.m;
const videoFilePath =
  args.v || "/Users/alken/Desktop/dester/js-server/demo.mp4";
const genGenFolder =
  args.f || "/Users/alken/Desktop/dester/js-server/bin";

// TMDB API base URL
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Fetch popular Movies
const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular MOVIE:", error);
    return [];
  }
};

// Fetch popular TV shows
const fetchPopularTVShows = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/day`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
    return [];
  }
};

// Fetch detailed show information
const fetchShowDetails = async (showId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/${showId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for show ID ${showId}:`, error);
    return null;
  }
};

const fetchSeasonDetails = async (showId, seasonNumber) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching details for season ${seasonNumber} of show ID ${showId}:`,
      error
    );
    return null;
  }
};

const createMovieFolders = async (basePath: string, sourceFilePath: string) => {
  try {
    const movies = await fetchPopularMovies();

    if (!Array.isArray(movies)) {
      console.error("Invalid data format for movies.");
      return;
    }

    // Ensure the basePath exists
    await fs.promises.mkdir(basePath, { recursive: true });

    for (const movie of movies) {
      // Sanitize the title to avoid invalid folder names
      const sanitizedTitle = movie.title.replace(/[\/\\?%*:|"<>]/g, "_");
      const movieDir = path.join(
        basePath,
        `${sanitizedTitle} {tmdb-${movie.id}}`
      );

      // Ensure the movie directory exists
      await fs.promises.mkdir(movieDir, { recursive: true });

      // Define the destination file path
      const filePath = path.join(movieDir, path.basename(sourceFilePath));

      // Copy the source file to the new directory
      await fs.promises.copyFile(sourceFilePath, filePath);

      // Log message after completing the movie folder structure
      console.log(`Created folder structure for: ${movie.title}`);
    }
  } catch (error) {
    console.error("Error creating movie folders:", error);
  }
};

const createTVShowFolders = async (basePath, sourceFilePath) => {
  try {
    // Fetch popular TV shows from TMDB
    const shows = await fetchPopularTVShows();

    if (!Array.isArray(shows)) {
      console.error("Invalid data format for shows.");
      return;
    }

    // Ensure the basePath exists
    await fs.promises.mkdir(basePath, { recursive: true });

    for (const show of shows) {
      // Sanitize the title to avoid invalid folder names
      const sanitizedTitle = show.name.replace(/[\/\\?%*:|"<>]/g, "_");
      const showDir = path.join(
        basePath,
        `${sanitizedTitle} {tmdb-${show.id}}`
      );

      // Create the show directory
      await fs.promises.mkdir(showDir, { recursive: true });

      // Fetch detailed information for the show
      const showDetails = await fetchShowDetails(show.id);

      if (!showDetails) {
        console.error(`No details found for show ID ${show.id}.`);
        continue;
      }

      const { number_of_seasons: seasons } = showDetails;

      for (let season = 1; season <= seasons; season++) {
        const seasonDetails = await fetchSeasonDetails(show.id, season);

        if (!seasonDetails || !Array.isArray(seasonDetails.episodes)) {
          console.error(
            `No episodes found for season ${season} of show ID ${show.id}.`
          );
          continue;
        }

        const seasonDir = path.join(showDir, `season ${season}`);
        await fs.promises.mkdir(seasonDir, { recursive: true });
        console.log(
          `Created directory for season ${season} of show: ${show.name}`
        );

        for (const episode of seasonDetails.episodes) {
          const filename = `s${String(season).padStart(2, "0")}e${String(
            episode.episode_number
          ).padStart(2, "0")}.mp4`;
          const filePath = path.join(seasonDir, filename);

          // Copy the file from the source path to the destination
          await fs.promises.copyFile(sourceFilePath, filePath);
          console.log(
            `Created episode file: ${filename} in season ${season} of show: ${show.name}`
          );
        }
      }

      // Log message after completing the show folder structure
      console.log(`Completed folder structure for: ${show.name}`);
    }
    console.log("All TV show folders have been successfully created.");
  } catch (error) {
    console.error("Error creating TV show folders:", error);
  }
};

(async () => {
  try {
    if (mediaType === "movie") {
      await createMovieFolders(genGenFolder, videoFilePath);
    } else if (mediaType === "tv") {
      await createTVShowFolders(genGenFolder, videoFilePath);
    }

    console.log("Operation completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
})();
