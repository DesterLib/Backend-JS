import fs from "fs";

const simpleScan = (path: string) => {
  const items = fs.readdirSync(path);
  return items;
};

const nestedScan = ({ path }: { path: string }) => {};

export { simpleScan, nestedScan };
