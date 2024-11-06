import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, meta }) => {
  return `${timestamp} [${level.toUpperCase()}] - ${message} ${
    meta ? JSON.stringify(meta) : ""
  }`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/combined.log" }),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
  ],
});

export default logger;
