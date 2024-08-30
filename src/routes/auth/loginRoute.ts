import { Router } from "express";
import bcrypt from "bcrypt";
import readJson from "../../utils/readJson";

const router = Router();

const CONFIG_FILE_PATH = process.env.CONFIG_PATH || "";

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  try {
    const config = await readJson(CONFIG_FILE_PATH);
    const user = config.users.find((u) => u.name === name);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.passwordProtected) {
      return res
        .status(400)
        .json({ error: "This account does not have a password set" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    req.session.userId = user.id;

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to validate password" });
  }
});

export default router;
