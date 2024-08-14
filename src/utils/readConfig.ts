import fs from "fs";
import { Config } from "../types/configTypes";

const configPath = process.env.CONFIG_PATH || "";

const readConfig = () => {
  return new Promise<Config>((resolve, reject) => {
    fs.readFile(configPath, "utf8", (err, data) => {
      if (err) {
        return reject(new Error("Error reading config file: " + err.message));
      }
      try {
        const config = JSON.parse(data);
        resolve(config);
      } catch (parseError: any) {
        reject(new Error("Error parsing config file: " + parseError.message));
      }
    });
  });
};

export default readConfig;
