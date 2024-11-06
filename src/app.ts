import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import crudLogger from "./middleware/crudLogger";
import rateLimiter from "./middleware/rateLimiter";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 8803;

app.use(
  cors({
    origin: "*",
  })
);

app.use(helmet());

app.use(express.json());
app.use(crudLogger);
app.use(rateLimiter);
app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
