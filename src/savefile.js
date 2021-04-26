import { serializeObject, deserializeObject } from "./read_write_proxy.js";
import fs from "fs";

export const save_text = (path, text) => {
  try {
    fs.writeFileSync(path, text);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const save_bin = (path, json) => {
  try {
    const data = serializeObject(json);
    fs.writeFileSync(path, data);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const load_json = (path) => {
  try {
    const text = fs.readFileSync(path, "utf8");
    return JSON.parse(text);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const load_bin = (path) => {
  try {
    const data = fs.readFileSync(path, "latin1");
    return deserializeObject(data);
  } catch (err) {
    console.error(err);
    return null;
  }
};
