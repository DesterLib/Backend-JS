import { Router } from "express";
import scanFilesRoute from "./api/scanFiles";
import { ENV_API_VERSION } from "../config";

const router = Router();

router.use(ENV_API_VERSION + "/scan-files", scanFilesRoute);

export default router;
