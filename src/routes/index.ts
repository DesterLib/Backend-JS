import { Router } from "express";
import { ENV_API_VERSION } from "../config";
import generateMetadataRoute from "./api/generate-metadata";
import mediaRoute from "./api/media";

const router = Router();

router.use(ENV_API_VERSION + "/generate-metadata", generateMetadataRoute);
router.use(ENV_API_VERSION + "/media", mediaRoute);

export default router;
