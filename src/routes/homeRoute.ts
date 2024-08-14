import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.json({
    carousel: [],
    recently_added: [],
    genres: [],
  });
});

export default router;
