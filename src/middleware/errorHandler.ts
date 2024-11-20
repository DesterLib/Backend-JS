import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"] || "unknown";

  logger.error(`Error - ${err.message}`, {
    meta: {
      apiKey,
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
    },
  });

  res.status(500).json({ success: false, message: "Internal Server Error" });
};

export default errorHandler;
