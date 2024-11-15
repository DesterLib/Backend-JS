import { Router } from "express";
import path from "path";
import fs from "fs/promises";
import { extractExternalData, sanitizeFileName } from "../../../utils";
import { fetchApiData } from "../../../services/apiService";
import { getSocketIO } from "../../../socket";
import { ServiceProvider } from "../../../services/types";
import reqBodySchema from "./schema";
import { simpleScan } from "./scanFolder";

const router = Router();

const progressStatus = {
  status: "idle",
  completed: 0,
  failed: 0,
  override: 0,
};

const validateRequest = (body: any) => reqBodySchema.safeParse(body);

const updateProgress = (io: any, status: Partial<typeof progressStatus>) => {
  Object.assign(progressStatus, status);
  io.emit("progress", { ...progressStatus });
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

  try {
    const items = simpleScan(collectionPath);

    items.map((item) => {
      console.log(extractExternalData(item));
    });
    // io.on("connection", (socket) => {
    //   console.log("Client connected:", socket.id);
    //   socket.emit("progress", { ...progressStatus });
    // });

    // updateProgress(io, {
    //   status: "idle",
    //   completed: 0,
    //   failed: 0,
    //   override: 0,
    // });

    // updateProgress(io, { status: "idle" });
    res.json({ message: items });
  } catch (error: any) {
    console.error("Fatal error:", error);
    updateProgress(io, { status: "idle" });
    res.status(500).json({ message: "error", error: error.message });
  }
});

export default router;
