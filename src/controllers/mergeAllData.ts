import * as fs from "fs/promises";
import * as path from "path";
import readJson from "../utils/readJson";

async function getAllFiles(
  dirPath: string,
  arrayOfFiles: string[] = []
): Promise<string[]> {
  const files = await fs.readdir(dirPath);

  await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(dirPath, file);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        await getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    })
  );

  return arrayOfFiles;
}

const mergeAllData = async () => {
  const DATA_DIRECTORY = process.env.DATA_DIRECTORY_PATH || "";

  try {
    // Get all file paths asynchronously
    const allFiles = await getAllFiles(DATA_DIRECTORY);

    // Read and merge all JSON data concurrently
    const mergedData = (
      await Promise.all(
        allFiles.map(async (singleFile) => {
          try {
            const fileData = await readJson(singleFile);
            return fileData; // Return the data or an empty array if an error occurs
          } catch (error) {
            console.error(`Failed to read or parse file ${singleFile}:`, error);
            return []; // Ignore errors and continue
          }
        })
      )
    ).flat(); // Flatten the array of arrays into a single array

    return mergedData;
  } catch (error) {
    console.error("Failed to merge data:", error);
    throw error; // Re-throw the error if needed
  }
};

export default mergeAllData;
