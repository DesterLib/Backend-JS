import fs from "fs";
import path from "path";
import { FileNameDominance } from "../types/configTypes";
import { Season, TVShow } from "../types/tmdbTypes";
import {
  fetchTvTmdbDataBase,
  fetchTvTmdbDataSeason,
  fetchTvTmdbDataEpisode,
} from "./fetchTvTmdbData";
import extractTMDBId from "../utils/extractTMDBId";
import categorizeAllowableFiles from "../utils/categorizeAllowableFiles";

// Main function to generate TV metadata
async function generateTVMetadata(
  mainFolder: string,
  dominance: FileNameDominance = "folder"
): Promise<{ tvShow: TVShow }> {
  try {
    const tmdbId = extractTMDBIdFromFolder(mainFolder);
    const tmdbData = tmdbId ? await fetchTvTmdbDataBase(tmdbId) : null;
    const seasons = await processSeasonFolders(mainFolder, tmdbId, dominance);

    return {
      tvShow: {
        media_type: "tv",
        seasons,
        tmdb_data: tmdbData,
      },
    };
  } catch (error) {
    console.error(
      `Error generating TV metadata for folder ${mainFolder}:`,
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

// Process all season folders inside the main folder
async function processSeasonFolders(
  mainFolder: string,
  tmdbId: string | null,
  dominance: FileNameDominance
): Promise<Season[]> {
  const seasonFolders = getSubdirectories(mainFolder);
  const seasons: Season[] = [];

  await Promise.all(
    seasonFolders.map(async (seasonFolder) => {
      const seasonPath = path.join(mainFolder, seasonFolder);
      const folderSeasonNumber = extractSeasonNumber(seasonFolder);
      const episodes = await processEpisodeFiles(
        seasonPath,
        folderSeasonNumber,
        tmdbId,
        dominance
      );

      if (episodes.length > 0) {
        const tmdbSeasonData = tmdbId
          ? await fetchTvTmdbDataSeason(tmdbId, folderSeasonNumber)
          : null;
        seasons.push({
          season_number: folderSeasonNumber,
          tmdb_data: tmdbSeasonData,
          file_path: seasonPath,
          episodes,
        });
      }
    })
  );

  return seasons;
}

// Extract the season number from the folder name
function extractSeasonNumber(seasonFolder: string): number {
  const match = seasonFolder.match(/season\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

// Process all episode files inside a season folder
async function processEpisodeFiles(
  seasonPath: string,
  folderSeasonNumber: number,
  tmdbId: string | null,
  dominance: FileNameDominance
): Promise<any[]> {
  const episodeFiles = categorizeAllowableFiles(seasonPath);
  const episodes: any[] = [];
  const episodePaths = new Set<string>();

  await Promise.all(
    episodeFiles.videos.map(async (episodeFile) => {
      const episodePath = path.join(seasonPath, episodeFile);
      if (episodePaths.has(episodePath)) return;
      episodePaths.add(episodePath);

      const { episodeNumber, finalSeasonNumber } = getEpisodeDetails(
        episodeFile,
        folderSeasonNumber,
        dominance
      );

      if (episodeNumber !== null) {
        const tmdbEpisodeData = tmdbId
          ? await fetchTvTmdbDataEpisode(
              tmdbId,
              finalSeasonNumber,
              episodeNumber
            )
          : null;
        episodes.push({
          episode_number: episodeNumber,
          file_path: episodePath,
          tmdb_data: tmdbEpisodeData,
        });
      }
    })
  );

  return episodes;
}

// Get the list of subdirectories inside a folder
function getSubdirectories(mainFolder: string): string[] {
  return fs.readdirSync(mainFolder).filter((folder) => {
    const folderPath = path.join(mainFolder, folder);
    return fs.statSync(folderPath).isDirectory();
  });
}

// Extract episode number and determine the final season number
function getEpisodeDetails(
  episodeFile: string,
  folderSeasonNumber: number,
  dominance: FileNameDominance
): { episodeNumber: number | null; finalSeasonNumber: number } {
  const episodeMatch = episodeFile.match(/s?(\d+)[eE](\d+)/);
  if (!episodeMatch)
    return { episodeNumber: null, finalSeasonNumber: folderSeasonNumber };

  const filenameSeasonNumber = parseInt(episodeMatch[1], 10);
  const episodeNumber = parseInt(episodeMatch[2], 10);
  const finalSeasonNumber =
    dominance === "file" && filenameSeasonNumber !== folderSeasonNumber
      ? filenameSeasonNumber
      : folderSeasonNumber;

  return { episodeNumber, finalSeasonNumber };
}

export default generateTVMetadata;
