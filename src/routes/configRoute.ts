import { Router } from "express";
import readConfig from "../utils/readConfig";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const config = await readConfig();
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
