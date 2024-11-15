import { Router } from "express";
import { ENV_API_VERSION_PATH } from "../config";

import generateMetadataRoute from "./api/generate-metadata";
import metadataRoute from "./api/metadata";
import mediaRoute from "./api/file";

const router = Router();

router.use(ENV_API_VERSION_PATH + "/generate-metadata", generateMetadataRoute);
router.use(ENV_API_VERSION_PATH + "/metadata", metadataRoute);
router.use(ENV_API_VERSION_PATH + "/media", mediaRoute);

export default router;
