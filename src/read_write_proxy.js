import { sha1, CRC_PREFIX, computeCrc } from "./sensitive_utils.encrypt.js";
import { decompressX64, compressX64 } from "./lzstring.js";
import { accessNestedPropertyReverse } from "./utils.js";
import { compressObject, decompressObject } from "./savegame_compressor.js";
import { globalConfig } from "./config.js";

export let compressionPrefix = String.fromCodePoint(1);
const salt = accessNestedPropertyReverse(globalConfig, ["file", "info"]);

/**
 *
 * @param {object} obj
 */
export function serializeObject(obj) {
  const jsonString = JSON.stringify(compressObject(obj));
  const checksum = computeCrc(jsonString + salt);
  return compressionPrefix + compressX64(checksum + jsonString);
}

/**
 *
 * @param {object} text
 */
export function deserializeObject(text) {
  const decompressed = decompressX64(text.substr(compressionPrefix.length));
  if (!decompressed) {
    // LZ string decompression failure
    throw new Error("bad-content / decompression-failed");
  }
  if (decompressed.length < 40) {
    // String too short
    throw new Error("bad-content / payload-too-small");
  }

  // Compare stored checksum with actual checksum
  const checksum = decompressed.substring(0, 40);
  const jsonString = decompressed.substr(40);

  const desiredChecksum = checksum.startsWith(CRC_PREFIX)
    ? computeCrc(jsonString + salt)
    : sha1(jsonString + salt);

  if (desiredChecksum !== checksum) {
    // Checksum mismatch
    throw new Error("bad-content / checksum-mismatch");
  }

  const parsed = JSON.parse(jsonString);
  const decoded = decompressObject(parsed);
  return decoded;
}
