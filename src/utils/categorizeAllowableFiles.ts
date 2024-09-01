import { Config } from "../types/configTypes";
import fs from "fs";
import path from "path";

interface CategorizedFiles {
  videos: string[];
  images: string[];
  subtitles: string[];
}

function categorizeAllowableFiles(folderPath: string): CategorizedFiles {
  const configPath = process.env.CONFIG_PATH;

  if (!configPath) {
    throw new Error("CONFIG_PATH environment variable is not set.");
  }

  // Resolve the absolute path
  const absolutePath = path.resolve(configPath);

  // Read and parse the configuration file
  let config: Config;

  try {
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    config = JSON.parse(fileContent) as Config;
  } catch (error: any) {
    throw new Error(
      `Failed to read or parse the config file at ${absolutePath}: ${error.message}`
    );
  }

  const categorizedFiles: CategorizedFiles = {
    videos: [],
    images: [],
    subtitles: [],
  };

  try {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      const fullPath = path.join(folderPath, file);

      if (config.server.allowedExtensions.video.includes(ext)) {
        categorizedFiles.videos.push(fullPath);
      } else if (config.server.allowedExtensions.image.includes(ext)) {
        categorizedFiles.images.push(fullPath);
      } else if (config.server.allowedExtensions.subtitle.includes(ext)) {
        categorizedFiles.subtitles.push(fullPath);
      }
    });
  } catch (error: any) {
    throw new Error(
      `Failed to read directory at ${folderPath}: ${error.message}`
    );
  }

  return categorizedFiles;
}

export default categorizeAllowableFiles;
