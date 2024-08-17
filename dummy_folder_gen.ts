import fs from "fs";
import path from "path";
import axios from "axios";
import "dotenv/config";


// TMDB API base URL
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

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

      const { number_of_seasons: seasons, episode_run_time: episodeRunTimes } =
        showDetails;

      for (let season = 1; season <= seasons; season++) {
        const seasonDir = path.join(showDir, `season ${season}`);
        await fs.promises.mkdir(seasonDir, { recursive: true });

        // Fetch episodes for the current season
        const episodesCount = episodeRunTimes[season - 1] || 0;

        for (let episode = 1; episode <= episodesCount; episode++) {
          const filename = `s${String(season).padStart(2, "0")}e${String(
            episode
          ).padStart(2, "0")}.mp4`;
          const filePath = path.join(seasonDir, filename);

          // Copy the file from the source path to the destination
          await fs.promises.copyFile(sourceFilePath, filePath);
        }
      }

      // Log message after completing the show folder structure
      console.log(`Created folder structure for: ${show.name}`);
    }
  } catch (error) {
    console.error("Error creating TV show folders:", error);
  }
};

// Usage example
const basePath =
  "C:/Users/Yeshwanth/Desktop/Projects/Backend-JS/files/personal-collection";
const sourceFilePath =
  "C:/Users/Yeshwanth/Desktop/Projects/Backend-JS/demo.mp4";
createTVShowFolders(basePath, sourceFilePath);
