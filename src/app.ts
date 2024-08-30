import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import appRouter from "./router";

const app = express();
const PORT = process.env.PORT || 8803;

app.use(
  cors({
    origin: "*",
  })
);

app.use(helmet());

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use("/api/v1", appRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
