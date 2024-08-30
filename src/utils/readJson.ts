import { promises as fsPromises } from "fs";
import { Config } from "../types/configTypes";

const readJson = async (filePath: string): Promise<Config> => {
  try {
    const data = await fsPromises.readFile(filePath, "utf8");
    return JSON.parse(data) as Config;
  } catch (err: any) {
    throw new Error(`Error reading or parsing config file: ${err.message}`);
  }
};

export default readJson;
