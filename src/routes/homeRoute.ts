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

router.post("/", async (req, res) => {
  res.json({
    message: "Successfully generated content for Home Page",
  });
});

export default router;
