import fs from "fs";
import { Config } from "../types/configTypes";

const writeJson = (filePath: string, data: Config) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        return reject(new Error("Error writing config file: " + err.message));
      }
      resolve();
    });
  });
};

export default writeJson;
