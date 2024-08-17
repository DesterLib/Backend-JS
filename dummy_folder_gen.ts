import * as fs from "fs";
import * as path from "path";

interface TVShow {
  title: string;
  tmdb_id: number;
  seasons: number; // Total number of seasons
  episodesPerSeason: number[]; // Array with number of episodes per season
}

const createTVShowFolders = (
  shows: TVShow[],
  basePath: string,
  sourceFilePath: string
) => {
  shows.forEach((show) => {
    // Sanitize the title to avoid invalid folder names
    const sanitizedTitle = show.title.replace(/[\/\\?%*:|"<>]/g, "_");
    // Create the show directory
    const showDir = path.join(basePath, `${sanitizedTitle} {tmdb-${show.tmdb_id}}`);
    fs.mkdirSync(showDir, { recursive: true });

    // Loop through each season
    for (let season = 1; season <= show.seasons; season++) {
      // Create the season directory
      const seasonDir = path.join(showDir, `season ${season}`);
      fs.mkdirSync(seasonDir, { recursive: true });

      // Get number of episodes for the current season
      const episodesCount = show.episodesPerSeason[season - 1] || 0;

      // Loop through each episode in the season
      for (let episode = 1; episode <= episodesCount; episode++) {
        // Format the episode filename
        const filename = `s${String(season).padStart(2, "0")}e${String(
          episode
        ).padStart(2, "0")}.mp4`;
        const filePath = path.join(seasonDir, filename);

        // Copy the file from the source path to the destination
        fs.copyFileSync(sourceFilePath, filePath);
      }
    }
  });
};

const shows: TVShow[] = [
  {
    title: "Breaking Bad",
    tmdb_id: 169,
    seasons: 5,
    episodesPerSeason: [7, 13, 13, 13, 16],
  },
  {
    title: "Stranger Things",
    tmdb_id: 66732,
    seasons: 4,
    episodesPerSeason: [8, 9, 9, 9],
  },
  {
    title: "The Office",
    tmdb_id: 131,
    seasons: 9,
    episodesPerSeason: [6, 22, 25, 14, 28, 25, 26, 24, 25],
  },
  {
    title: "Game of Thrones",
    tmdb_id: 82,
    seasons: 8,
    episodesPerSeason: [10, 10, 10, 10, 10, 10, 7, 6],
  },
  {
    title: "Friends",
    tmdb_id: 431,
    seasons: 10,
    episodesPerSeason: [24, 24, 25, 24, 24, 25, 24, 24, 24, 18],
  },
  {
    title: "The Mandalorian",
    tmdb_id: 82856,
    seasons: 3,
    episodesPerSeason: [8, 8, 8],
  },
  {
    title: "The Crown",
    tmdb_id: 48616,
    seasons: 6,
    episodesPerSeason: [10, 10, 10, 10, 10, 10],
  },
  {
    title: "Sherlock",
    tmdb_id: 121,
    seasons: 4,
    episodesPerSeason: [3, 3, 3, 3],
  },
  {
    title: "The Simpsons",
    tmdb_id: 83,
    seasons: 34,
    episodesPerSeason: [24, 22, 24, 24, 22, 25, 25, 25, 25, 23],
  },
  {
    title: "Better Call Saul",
    tmdb_id: 61889,
    seasons: 6,
    episodesPerSeason: [10, 10, 10, 10, 13, 13],
  },
];

const basePath = "./files/personal-collection"; // Define the base path where folders will be created
const sourceFilePath = "./demo.mp4"; // Path to the source .mp4 file

createTVShowFolders(shows, basePath, sourceFilePath);