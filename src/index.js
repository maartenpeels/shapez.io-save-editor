import { save_text, save_bin, load_json, load_bin } from "./savefile.js";

const input = "./save.bin";
const output_json = "./save.json";
const output_bin = "./save_new.bin";

function extract_json() {
  const json = load_bin(input);
  if (json != null) {
    save_text(output_json, JSON.stringify(json));
  }
}

function convert_json_file_to_bin() {
  const json = load_json(output_json);
  if (json != null) {
    save_bin(output_bin, json);
  }
}

// extract_json();
convert_json_file_to_bin();
