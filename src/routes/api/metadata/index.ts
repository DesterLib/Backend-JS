import { Router, Request, Response } from "express";
import path from "path";
import { readJson, sanitizeFileName } from "../../../utils";
import { ENV_DEFAULT_METADATA_FOLDER } from "../../../config";

const router = Router();

interface CollectionQueryParams {
  collectionName?: string;
}

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { collectionName } = req.query as CollectionQueryParams;

  if (!collectionName) {
    return res.status(400).json({ error: "Missing 'collectionName' in query" });
  }

  const sanitizedFileName = `${sanitizeFileName(collectionName)}.json`;
  const metadataFilePath = path.join(
    ENV_DEFAULT_METADATA_FOLDER,
    sanitizedFileName
  );

  try {
    const existingMetadata = await readJson(metadataFilePath);

    const externalId = parseInt(id, 10);

    const matchedMetadata = existingMetadata.find(
      (item: any) => item.externalId === externalId
    );

    if (!matchedMetadata) {
      return res.status(404).json({ error: "Item not found in metadata" });
    }

    res.json({
      id,
      collectionName,
      metadata: matchedMetadata,
    });
  } catch (error) {
    console.error("Error reading metadata file:", error);
    res.status(500).json({
      error: "Failed to read metadata file",
      details: (error as Error).message,
    });
  }
});

export default router;
