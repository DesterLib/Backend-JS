import fsPromises from "fs/promises";
import path from "path";
import os from "os";

export function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

export function extractExternalData(text: string) {
  const regex = /{(\w+)-(\d+)}/;
  const match = text.match(regex);

  if (match) {
    return {
      externalProvider: match[1],
      externalId: match[2],
    };
  } else {
    return null;
  }
}

export function generateUid() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export async function readJson(filePath: string) {
  try {
    const data = await fsPromises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading or parsing the JSON file:", err);
    throw err;
  }
}

export async function writeJson(filePath: string, data: any) {
  const tmpFilePath = path.join(os.tmpdir(), `tmp-${path.basename(filePath)}`);

  try {
    await fsPromises.writeFile(
      tmpFilePath,
      JSON.stringify(data, null, 2),
      "utf8"
    );

    await fsPromises.rename(tmpFilePath, filePath);
    console.log("File written successfully!");
  } catch (err) {
    console.error("Error writing to the JSON file:", err);
    throw err;
  } finally {
    try {
      await fsPromises.unlink(tmpFilePath);
    } catch (cleanupErr: any) {
      if (cleanupErr.code !== "ENOENT") {
        console.error("Error cleaning up the temporary file:", cleanupErr);
      }
    }
  }
}
