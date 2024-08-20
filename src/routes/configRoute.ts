import { Router } from "express";
import readJson from "../utils/readJson";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const config = await readJson(process.env.CONFIG_PATH || "");
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
