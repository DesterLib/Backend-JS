import fs from "fs";
import path from "path";
import { Router } from "express";
import generateTVMetadata from "../controllers/generateTVMetadata";
import express from "express";
import readConfig from "../utils/readConfig";

const router = Router();
router.use(express.json());

// Global progress data
let progressData = { processed: 0, failed: 0, total: 0, status: "processing" };

// POST route to start the process
router.post("/", async (req, res) => {
  const { path: directoryPath } = req.body;

  const config = await readConfig();

  if (!directoryPath) {
    return res.status(400).json({ error: "Directory path is required." });
  }

  const ROOT_DIRECTORY_PATH = path.resolve(directoryPath);

  if (!fs.existsSync(ROOT_DIRECTORY_PATH)) {
    return res.status(400).json({ error: "Directory does not exist." });
  }

  // Initialize progress
  progressData = { processed: 0, failed: 0, total: 0, status: "processing" };

  const rootDirectoryName = path.basename(ROOT_DIRECTORY_PATH);
  const directoryItems = fs.readdirSync(ROOT_DIRECTORY_PATH);

  const subdirectories = directoryItems.filter((itemName) =>
    fs.statSync(path.join(ROOT_DIRECTORY_PATH, itemName)).isDirectory()
  );

  // Set total for progress
  progressData.total = subdirectories.length;

  // Define JSON file path
  const jsonFilePath = path.join(
    process.env.DATA_DIRECTORY_PATH || ROOT_DIRECTORY_PATH,
    `${rootDirectoryName}.json`
  );

  // Delete the file if it exists
  if (fs.existsSync(jsonFilePath)) {
    try {
      fs.unlinkSync(jsonFilePath);
      console.log(`Deleted existing file: ${jsonFilePath}`);
    } catch (err: any) {
      console.error(`Error deleting file: ${err.message}`);
    }
  }

  // Initialize jsonData
  let jsonData: any[] = [];

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send the initial total progress data
  res.write(`data: ${JSON.stringify(progressData)}\n\n`);

  const sendProgressUpdate = () => {
    res.write(`data: ${JSON.stringify(progressData)}\n\n`);
  };

  try {
    for (const subdirectory of subdirectories) {
      const subdirectoryPath = path.join(ROOT_DIRECTORY_PATH, subdirectory);
      try {
        const { tvShow } = await generateTVMetadata(
          subdirectoryPath,
          config.fileNameDominance
        );
        jsonData.push(tvShow);

        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify(jsonData, null, 2),
          "utf-8"
        );

        console.log(`Updated existing file: ${jsonFilePath}`);
        progressData.processed++;
      } catch (error: any) {
        console.error(`Error processing ${subdirectory}: ${error.message}`);
        progressData.failed++;
      } finally {
        sendProgressUpdate(); // Send progress update after each subdirectory
      }
    }

    progressData.status = "completed";
    sendProgressUpdate();
  } catch (error: any) {
    console.error(`Error generating TV metadata: ${error.message}`);
    progressData.status = "failed";
    sendProgressUpdate();
  } finally {
    res.end();
  }
});

// GET route to fetch progress
router.get("/", (req, res) => {
  res.json(progressData);
});

export default router;
