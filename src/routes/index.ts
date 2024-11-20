import { Router } from "express";
import { ENV_API_VERSION_PATH } from "../config";

import collectionRoute from "./api/collection";
import mediaRoute from "./api/file";

const router = Router();

router.use(ENV_API_VERSION_PATH + "/collection", collectionRoute);
router.use(ENV_API_VERSION_PATH + "/media", mediaRoute);

export default router;
