import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import crudLogger from "./middleware/crudLogger";
import rateLimiter from "./middleware/rateLimiter";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import { createServer } from "http";
import { getSocketIO, initializeSocket } from "./socket";

const app = express();
const server = createServer(app);

initializeSocket(server);

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
app.use(routes);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  const io = getSocketIO();

  io.on("connection", (socket) => {
    console.log(`Socket.io connection id ${socket.id}`);
  });
});
