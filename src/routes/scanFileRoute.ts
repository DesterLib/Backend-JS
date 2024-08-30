import fs from "fs";
import path from "path";
import { Router } from "express";
import generateTVMetadata from "../controllers/generateTVMetadata";
import generateMovieMetadata from "../controllers/generateMovieMetadata";
import readJson from "../utils/readJson";

const router = Router();

// Global progress data
let progressData = { processed: 0, failed: 0, total: 0, status: "idle" };

// POST route to start the process
router.post("/", async (req, res) => {
  const { path: directoryPath, media_type } = req.body;

  if (!directoryPath) {
    return res.status(400).json({ error: "Directory path is required." });
  }

  const ROOT_DIRECTORY_PATH = path.resolve(directoryPath);
  if (!fs.existsSync(ROOT_DIRECTORY_PATH)) {
    return res.status(400).json({ error: "Directory does not exist." });
  }

  const config = await readJson(process.env.CONFIG_PATH || "");

  // Initialize progress data
  progressData = { processed: 0, failed: 0, total: 0, status: "processing" };

  const rootDirectoryName = path.basename(ROOT_DIRECTORY_PATH);
  const directoryItems = fs.readdirSync(ROOT_DIRECTORY_PATH);
  const subdirectories = directoryItems.filter((itemName) =>
    fs.statSync(path.join(ROOT_DIRECTORY_PATH, itemName)).isDirectory()
  );

  progressData.total = subdirectories.length;

  const jsonFilePath = path.join(
    process.env.DATA_DIRECTORY_PATH || ROOT_DIRECTORY_PATH,
    `${rootDirectoryName}.json`
  );

  if (fs.existsSync(jsonFilePath)) {
    try {
      fs.unlinkSync(jsonFilePath);
      console.log(`Deleted existing file: ${jsonFilePath}`);
    } catch (err: any) {
      console.error(`Error deleting file: ${err.message}`);
    }
  }

  const jsonData: any[] = [];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendProgressUpdate = () => {
    res.write(`data: ${JSON.stringify(progressData)}\n\n`);
  };

  sendProgressUpdate();

  try {
    for (const subdirectory of subdirectories) {
      const subdirectoryPath = path.join(ROOT_DIRECTORY_PATH, subdirectory);

      try {
        let metadata;

        if (media_type === "movie") {
          const { movie } = await generateMovieMetadata(subdirectoryPath);
          metadata = movie;
        } else if (media_type === "tv") {
          const { tvShow } = await generateTVMetadata(
            subdirectoryPath,
            config.fileSettings.fileNameDominance
          );
          metadata = tvShow;
        }

        jsonData.push(metadata);

        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify(jsonData, null, 2),
          "utf-8"
        );

        progressData.processed++;
      } catch (error: any) {
        console.error(`Error processing ${subdirectory}: ${error.message}`);
        progressData.failed++;
      } finally {
        sendProgressUpdate();
      }
    }

    progressData.status = "completed";
  } catch (error: any) {
    console.error(`Error during processing: ${error.message}`);
    progressData.status = "failed";
  } finally {
    sendProgressUpdate();
    res.end();
  }
});

// GET route to fetch progress
router.get("/", (req, res) => {
  res.json(progressData);
});

export default router;
