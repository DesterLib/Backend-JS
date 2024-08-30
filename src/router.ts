import { Router } from "express";
import scanFilesRoute from "./routes/scanFileRoute";
import homeRoute from "./routes/homeRoute";
import configRoute from "./routes/configRoute";

// auth routes
import authLoginRoute from "./routes/auth/loginRoute";
import authLogoutRoute from "./routes/auth/logoutRoute";
import authCreateRoute from "./routes/auth/createUserRoute";
import authEditRoute from "./routes/auth/editUserRoute";

const router = Router();

router.use("/home", homeRoute);
router.use("/scan-files", scanFilesRoute);
router.use("/config", configRoute);

router.use("/auth", authLoginRoute);
router.use("/auth", authLogoutRoute);
router.use("/auth", authCreateRoute);
router.use("/auth", authEditRoute);

export default router;
