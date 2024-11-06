import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const crudLogger = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"] || "unknown";
  const { method, originalUrl: url } = req;

  logger.info(`Request - ${method} ${url}`, {
    meta: { apiKey, method, url },
  });

  next();
};

export default crudLogger;