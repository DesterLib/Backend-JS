import { Router } from "express";
import bcrypt from "bcrypt";
import readJson from "../../utils/readJson";
import generateUid from "../../utils/generateUid";
import writeJson from "../../utils/writeJson";

const router = Router();

const CONFIG_FILE_PATH = process.env.CONFIG_PATH || "";

router.post("/create", async (req, res) => {
  const config = await readJson(CONFIG_FILE_PATH);

  const {
    name,
    passwordProtected = false,
    password = "",
    isChildUser = false,
    profileImage = "",
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (passwordProtected && !password) {
    return res
      .status(400)
      .json({ error: "Password is required when passwordProtected is true" });
  }

  if (!passwordProtected && password) {
    return res.status(400).json({
      error: "Password should not be set when passwordProtected is false",
    });
  }

  let hashedPassword = password;

  if (passwordProtected && password) {
    try {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      return res.status(500).json({ error: "Error hashing the password" });
    }
  }

  try {
    const newUser = {
      id: generateUid(),
      name,
      passwordProtected,
      password: hashedPassword,
      isChildUser,
      profileImage,
    };

    config.users.push(newUser);

    await writeJson(CONFIG_FILE_PATH, config);

    res.status(201).json({
      message: "Created new user successfully.",
      newUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
