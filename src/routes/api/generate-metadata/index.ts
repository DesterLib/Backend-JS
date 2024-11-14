import { Router } from "express";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import {
  extractExternalData,
  readJson,
  sanitizeFileName,
  writeJson,
} from "../../../utils";
import { fetchApiData } from "../../../services/apiService";
import { ENV_DEFAULT_METADATA_FOLDER } from "../../../config";
import { getSocketIO } from "../../../socket";
import { ServiceProvider } from "../../../services/types";

const router = Router();

const progressStatus = {
  status: "idle",
  completed: 0,
  failed: 0,
  override: 0,
};

const reqBodySchema = z.object({
  collectionName: z.string({ message: "collectionName is required." }),
  collectionPath: z.string({ message: "collectionPath is required." }),
  mediaType: z.enum(["movie", "tvshow"]),
  apiProvider: z.enum(["tmdb", "anilist"]).default("tmdb").optional(),
  override: z.boolean().optional(),
});

const validateRequest = (body: any) => reqBodySchema.safeParse(body);

const initializeMetadataFile = async (filePath: string) => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await writeJson(filePath, []);
  console.log(`Initialized empty metadata file at: ${filePath}`);
};

const updateProgress = (io: any, status: Partial<typeof progressStatus>) => {
  Object.assign(progressStatus, status);
  io.emit("progress", { ...progressStatus });
};

const processCollectionItems = async (
  collectionItems: string[],
  existingMetadata: any[],
  metadataFilePath: string,
  {
    mediaType,
    apiProvider,
    override,
  }: {
    mediaType: "movie" | "tvshow";
    apiProvider: ServiceProvider;
    override: boolean;
  },
  io: any
) => {
  for (const item of collectionItems) {
    const externalData = extractExternalData(item);
    if (!externalData) continue;

    const metadataExists = existingMetadata.some(
      (metadata) => metadata.externalId === parseInt(externalData.externalId)
    );

    if (!metadataExists || override) {
      try {
        const newMetadata = await fetchApiData({
          apiProvider,
          endpoint: mediaType,
          params: { id: externalData.externalId },
        });

        if (metadataExists && override) {
          const index = existingMetadata.findIndex(
            (metadata) =>
              metadata.externalId === parseInt(externalData.externalId)
          );
          existingMetadata[index] = newMetadata;
          progressStatus.override++;
        } else {
          existingMetadata.push(newMetadata);
        }

        progressStatus.completed++;
      } catch (error) {
        console.error("Error fetching new metadata:", error);
        progressStatus.failed++;
      }
    } else {
      progressStatus.completed++;
    }
    updateProgress(io, { status: "generating" });
  }

  await writeJson(metadataFilePath, existingMetadata);
};

router.post("/", async (req, res) => {
  const { success, data, error } = validateRequest(req.body);
  const io = getSocketIO();

  if (!success) {
    const errorMessages = error.errors.map((e) => e.message);
    return res
      .status(400)
      .json({ error: "Validation failed.", details: errorMessages });
  }

  const {
    collectionName,
    collectionPath,
    mediaType,
    apiProvider = "tmdb",
    override = false,
  } = data;
  const sanitizedFileName = sanitizeFileName(collectionName) + ".json";
  const metadataFilePath = path.join(
    ENV_DEFAULT_METADATA_FOLDER,
    sanitizedFileName
  );

  try {
    try {
      await fs.access(metadataFilePath);
    } catch {
      await initializeMetadataFile(metadataFilePath);
    }

    const collectionItems = await fs.readdir(collectionPath);
    const existingMetadata = await readJson(metadataFilePath);

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      socket.emit("progress", { ...progressStatus });
    });

    updateProgress(io, {
      status: "idle",
      completed: 0,
      failed: 0,
      override: 0,
    });

    await processCollectionItems(
      collectionItems,
      existingMetadata,
      metadataFilePath,
      { mediaType, apiProvider, override },
      io
    );

    updateProgress(io, { status: "idle" });
    res.json({ message: "success" });
  } catch (error: any) {
    console.error("Fatal error:", error);
    updateProgress(io, { status: "idle" });
    res.status(500).json({ message: "error", error: error.message });
  }
});

export default router;
