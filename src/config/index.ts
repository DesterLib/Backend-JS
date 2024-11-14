import dotenv from "dotenv";

dotenv.config();

export const ENV_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const ENV_TMDB_API_KEY = process.env.TMDB_API_KEY || "";
export const ENV_API_VERSION = process.env.API_VERSION || "";
export const ENV_DEFAULT_METADATA_FOLDER = process.env.DEFAULT_METADATA_FOLDER_PATH || ""