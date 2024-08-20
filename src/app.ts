import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import appRouter from "./router";

const app = express();
const PORT = process.env.PORT || 8803;

app.use(
  cors({
    origin: "*",
  })
);

app.use(helmet());

app.use("/api/v1", appRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
