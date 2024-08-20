import path from "path";
import { Movie } from "../types/tmdbTypes";
import extractTMDBId from "../utils/extractTMDBId";
import { fetchMovieTmdbData } from "./fetchMovieTmdbData";
import categorizeAllowableFiles from "../utils/categorizeAllowableFiles";

// Main function to generate MOVIE metadata
async function generateMovieMetadata(
  mainFolder: string
): Promise<{ movie: Movie }> {
  try {
    const tmdbId = extractTMDBIdFromFolder(mainFolder);
    const tmdbData = tmdbId ? await fetchMovieTmdbData(tmdbId) : null;

    return {
      movie: {
        media_type: "movie",
        tmdb_data: tmdbData,
        files: categorizeAllowableFiles(mainFolder),
      },
    };
  } catch (error) {
    console.error(
      `Error generating MOVIE metadata for folder ${mainFolder}:`,
      error
    );
    throw error;
  }
}

// Extract TMDB ID from folder name
function extractTMDBIdFromFolder(mainFolder: string): string | null {
  const folderName = path.basename(mainFolder);
  return extractTMDBId(folderName);
}

export default generateMovieMetadata;
