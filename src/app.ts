import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import scanFilesRoute from "./routes/scanFileRoute";
import homeRoute from "./routes/homeRoute";
import configRoute from "./routes/configRoute";

const app = express();
const port = 8803;

app.use(
  cors({
    origin: "*",
  })
);

app.use(helmet());

app.use("/api/home", homeRoute);
app.use("/api/scan-files", scanFilesRoute);
app.use("/api/config", configRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
