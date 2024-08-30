import { Request, Response, Router } from "express";

const router = Router();

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }

    res.status(200).json({ message: "Logout successful" });
  });
});

export default router;