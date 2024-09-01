import { Router } from "express";
import bcrypt from "bcrypt";
import readJson from "../../utils/readJson";
import writeJson from "../../utils/writeJson";

const router = Router();

const CONFIG_FILE_PATH = process.env.CONFIG_PATH || "";

router.patch("/edit/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const config = await readJson(CONFIG_FILE_PATH);

  const { id } = req.params;

  // todo: fix unused variable passwordProtected
  const { name, passwordProtected, password, isChildUser, profileImage } =
    req.body;

  const user = config.users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name !== undefined) user.name = name;
  if (isChildUser !== undefined) user.isChildUser = isChildUser;
  if (profileImage !== undefined) user.profileImage = profileImage;

  if (password) {
    if (!user.passwordProtected) {
      return res.status(400).json({
        error: "Password cannot be set when passwordProtected is false",
      });
    }

    try {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      return res.status(500).json({ error: "Error hashing the password" });
    }
  }

  try {
    await writeJson(CONFIG_FILE_PATH, config);
    res.status(200).json({
      message: "User details updated successfully.",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
