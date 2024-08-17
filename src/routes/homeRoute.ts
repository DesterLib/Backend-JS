import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.json({
    carousel: [],
    watching: [],
    recently_added: [],
    genres: [],
    movies: [],
    tv: [],
  });
});

export default router;
