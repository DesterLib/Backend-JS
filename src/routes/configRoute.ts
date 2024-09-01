import { Router } from "express";
import bcrypt from "bcrypt";
import readJson from "../utils/readJson";
import writeJson from "../utils/writeJson";
import generateUid from "../utils/generateUid";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const config = await readJson(process.env.CONFIG_PATH || "");
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/server", async (req, res) => {
  try {
    const { name, fileNameDominance, allowedExtensions } = req.body;

    const config = await readJson(process.env.CONFIG_PATH || "");

    if (name) {
      config.server.name = name;
    }
    if (fileNameDominance) {
      if (["file", "folder"].includes(fileNameDominance)) {
        config.server.fileNameDominance = fileNameDominance;
      } else {
        return res
          .status(400)
          .json({ error: "Invalid fileNameDominance value [file or folder]" });
      }
    }
    if (allowedExtensions) {
      const { video, image, subtitle } = allowedExtensions;

      if (video) {
        config.server.allowedExtensions.video = video;
      }
      if (image) {
        config.server.allowedExtensions.image = image;
      }
      if (subtitle) {
        config.server.allowedExtensions.subtitle = subtitle;
      }
    }

    await writeJson(process.env.CONFIG_PATH || "", config);

    res.json(config.server);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/desktop", async (req, res) => {
  try {
    const { homePage } = req.body;

    const config = await readJson(process.env.CONFIG_PATH || "");

    if (homePage) {
      const {
        carouselEnabled,
        categorySliderEnabled,
        genreSliderEnabled,
        collectionSliderEnabled,
      } = homePage;

      if (carouselEnabled !== undefined) {
        config.desktop.homePage.carouselEnabled = carouselEnabled;
      }
      if (categorySliderEnabled !== undefined) {
        config.desktop.homePage.categorySliderEnabled = categorySliderEnabled;
      }
      if (genreSliderEnabled !== undefined) {
        config.desktop.homePage.genreSliderEnabled = genreSliderEnabled;
      }
      if (collectionSliderEnabled !== undefined) {
        config.desktop.homePage.collectionSliderEnabled =
          collectionSliderEnabled;
      }
    }

    await writeJson(process.env.CONFIG_PATH || "", config);

    res.json(config.desktop);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/collections", async (req, res) => {
  try {
    const {
      name,
      path: collectionPath,
      mediaType,
      isAdult = false,
      passwordProtected = false,
      password = "",
      userAccessIds = [],
    } = req.body;

    const config = await readJson(process.env.CONFIG_PATH || "");

    if (!name || !collectionPath || !mediaType) {
      return res
        .status(400)
        .json({ error: "name, path, and mediaType are required fields." });
    }

    const existsName = config.collections.some((coll) => coll.name === name);

    const existsPath = config.collections.some(
      (coll) => coll.path === collectionPath
    );

    if (existsName) {
      return res
        .status(409)
        .json({ error: "Collection with the same name already exists." });
    }

    if (existsPath) {
      return res
        .status(409)
        .json({ error: "Collection with the same path already exists." });
    }

    if (!["movie", "tv"].includes(mediaType)) {
      return res
        .status(400)
        .json({ error: 'mediaType must be either "movie" or "tv".' });
    }

    const newCollection = {
      id: generateUid(),
      name,
      path: collectionPath,
      mediaType,
      isAdult,
      passwordProtected,
      password,
      userAccessIds,
    };

    config.collections.push(newCollection);

    await writeJson(process.env.CONFIG_PATH || "", config);

    res.status(201).json(newCollection);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/collections/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      path: collectionPath,
      mediaType,
      isAdult,
      passwordProtected,
      password,
      userAccessIds,
    } = req.body;

    const config = await readJson(process.env.CONFIG_PATH || "");

    const collection = config.collections.find(
      (collection) => collection.id === id
    );

    if (!collection) {
      return res.status(404).json({ error: "Collection not found." });
    }

    // Check for duplicate name or path
    if (name) {
      const nameExists = config.collections.some(
        (col) => col.name === name && col.id !== id
      );
      if (nameExists) {
        return res
          .status(400)
          .json({ error: "A collection with this name already exists." });
      }
      collection.name = name;
    }

    if (collectionPath) {
      const pathExists = config.collections.some(
        (col) => col.path === collectionPath && col.id !== id
      );
      if (pathExists) {
        return res
          .status(400)
          .json({ error: "A collection with this path already exists." });
      }
      collection.path = collectionPath;
    }

    if (mediaType) {
      if (!["movie", "tv"].includes(mediaType)) {
        return res
          .status(400)
          .json({ error: 'mediaType must be either "movie" or "tv".' });
      }
      collection.mediaType = mediaType;
    }

    if (isAdult !== undefined) {
      collection.isAdult = isAdult;
    }

    if (passwordProtected !== undefined) {
      collection.passwordProtected = passwordProtected;

      if (passwordProtected && (password === undefined || password === "")) {
        return res.status(400).json({
          error: "Password must be provided when passwordProtected is true.",
        });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        collection.password = hashedPassword;
      }
    }

    if (userAccessIds) {
      collection.userAccessIds = userAccessIds;
    }

    await writeJson(process.env.CONFIG_PATH || "", config);

    res.json(collection);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
