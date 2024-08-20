import { Router } from "express";
import scanFilesRoute from "./routes/scanFileRoute";
import homeRoute from "./routes/homeRoute";
import configRoute from "./routes/configRoute";

const router = Router();

router.use("/home", homeRoute);
router.use("/scan-files", scanFilesRoute);
router.use("/config", configRoute);

export default router;
