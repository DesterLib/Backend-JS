import { Router } from "express";
import path from "path";

const router = Router();

router.get("/", (req, res) => {
  const filePath = req.query.path as string;

  if (!filePath) {
    return res.status(400).send("Missing path query parameter");
  }

  const resolvedPath = path.resolve(filePath);

  res.sendFile(resolvedPath, (err) => {
    if (err) {
      if (!res.headersSent) {
        console.error("File not found or error occurred:", err);
        res.status(404).send("File not found");
      } else {
        console.error(
          "Connection was interrupted, unable to send full response."
        );
      }
    }
  });
});

export default router;
