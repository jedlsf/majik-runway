import { hash } from "@stablelib/sha256";
import { AES } from "@stablelib/aes";
import { GCM } from "@stablelib/gcm";
import { randomBytes } from "@stablelib/random";

export interface EncryptedData {
  rqc: Uint8Array; // 256-bit encryption key
  iv: Uint8Array; // 96-bit nonce used for GCM
  cipher: Uint8Array; // Encrypted payload
}

export interface SerializedEncryptedData {
  rqc: string;
  iv: string;
  cipher: string;
}

class APITranscoder {
  /**
   * Generates a 32-byte cipher key encoded as a base64 string, suitable for use with Fernet encryption.
   * @returns {string} The generated cipher key ("rqc") in base64 format.
   */
  static generateRQC(): string {
    const bytes = randomBytes(32); // 32 bytes = 256 bits
    const fKey = arrayToBase64(bytes);

    return fKey; // Converts the byte array to a base64 string
  }

  /**
   * Generates a transformed version of the rqc by reversing and interleaving the bytes.
   * If rqc is not provided, a new one will be generated automatically.
   * @param {string} [rqc] - Optional. The original 32-byte cipher key in base64 format.
   * @returns {string} The transformed key as a base64 string.
   */
  static generateRQX(rqc: string | null = null): string {
    // Auto-generate rqc if it's empty or null
    if (!rqc) {
      rqc = this.generateRQC();
    }

    // Decode the input rqc to bytes
    const rqcBytes = Uint8Array.from(atob(rqc), (c) => c.charCodeAt(0)); // Decode base64 to byte array
    const intArray = Array.from(rqcBytes);

    // Reverse the array
    const reversedArray = [...intArray].reverse();

    // Interleave original and reversed arrays
    const interleavedArray: number[] = [];
    for (let i = 0; i < intArray.length; i++) {
      interleavedArray.push(intArray[i], reversedArray[i]);
    }

    // Convert the interleaved array to a base64 string and return
    return btoa(String.fromCharCode(...interleavedArray)); // Convert the byte array to base64 string
  }

  /**
   * Decodes the transformed rqx back to the original rqc base64 string.
   * @param {string} rqx - The transformed key in base64 format.
   * @returns {string} The original rqc in base64 format.
   */
  static decodeRQX(rqx: string): string {
    const interleavedArray = Uint8Array.from(atob(rqx), (c) => c.charCodeAt(0)); // Decode base64 to byte array

    // Separate the original and reversed arrays from the interleaved array
    const originalArray: number[] = [];
    const reversedArray: number[] = [];
    for (let i = 0; i < interleavedArray.length; i += 2) {
      originalArray.push(interleavedArray[i]);
      reversedArray.push(interleavedArray[i + 1]);
    }

    // Verify reversedArray matches the reverse of originalArray (optional, for validation)
    if (reversedArray.join() !== [...originalArray].reverse().join()) {
      throw new Error("Decoded rqx does not match original rqc format.");
    }

    // Convert the original array back to a base64 string representing the original rqc
    return btoa(String.fromCharCode(...originalArray)); // Convert to base64 string
  }

  static hashData(inputJson: Record<string, unknown>): string {
    const jsonString = JSON.stringify(inputJson, Object.keys(inputJson).sort());
    const hashString = hash(jsonStringToBytes(jsonString));
    return hashString.toString();
  }

  /**
   * Generates a SHA-256 hash for a given string.
   * Validates that the input is a non-empty string.
   * @param {string} string - The string to hash.
   * @returns {string} The hash of the string in hexadecimal format.
   * @throws {Error} If the input is not a valid non-empty string.
   */
  static hashString(string: string): string {
    const hashed = hash(new TextEncoder().encode(string));
    return hashed.toString();
  }

  /**
   * Verifies that the hash of a decoded JSON object matches a provided hash.
   * @param {Object} decodedJson - The JSON object to verify.
   * @param {string} providedHash - The hash to compare against.
   * @returns {boolean} True if the hashes match, false otherwise.
   * @throws {Error} If inputs are invalid.
   */
  static verifyHashJSON(
    decodedJson: Record<string, unknown>,
    providedHash: string
  ): boolean {
    const generatedHash = this.hashData(decodedJson);
    return generatedHash === providedHash;
  }

  /**
   * Verifies that the hash of a given string matches a provided hash.
   * @param {string} string - The string to verify.
   * @param {string} providedHash - The hash to compare against.
   * @returns {boolean} True if the hashes match, false otherwise.
   * @throws {Error} If inputs are invalid.
   */
  static verifyHashString(string: string, providedHash: string): boolean {
    if (typeof string !== "string" || string.trim() === "") {
      throw new Error("Invalid input: 'string' must be a non-empty string.");
    }
    if (typeof providedHash !== "string" || providedHash.trim() === "") {
      throw new Error(
        "Invalid input: 'providedHash' must be a non-empty string."
      );
    }
    const generatedHash = this.hashString(string);
    return generatedHash === providedHash;
  }

  /**
   * Decrypts an encrypted payload using AES-GCM encryption and returns the original JSON.
   * @param {string} encrypted - The encrypted object data.
   * @returns {Object} The decrypted and parsed JSON object.
   * @throws {Error} Throws an error if decryption fails.
   */
  static decryptPayload(
    encrypted: SerializedEncryptedData
  ): Record<string, unknown> {
    try {
      const serialized = encryptedDataFromBase64(encrypted);

      const { rqc, iv, cipher } = serialized;
      const aes = new AES(rqc);
      const gcm = new GCM(aes);

      const decrypted = gcm.open(iv, cipher);
      if (!decrypted) {
        throw new Error("Decryption failed or payload was tampered.");
      }
      const base64String = arrayToBase64(decrypted);
      const parsedData = base64ToJson(base64String) as Record<string, unknown>;
      return parsedData;
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Encrypts a JSON object using AES-GCM encryption with the provided cipher key.
   * @param {Object} json - The JSON object to encrypt.
   * @param {string} rqc - The 32-byte cipher key in base64 format.
   * @returns {Object} An object containing the encrypted payload and the transformed key, potentially URL-encoded.
   * @throws {Error} Throws an error if encryption fails.
   */
  static encryptPayload(
    json: Record<string, unknown>,
    rqc: string
  ): SerializedEncryptedData {
    try {
      const jsonString = JSON.stringify(json);
      const data = jsonStringToBytes(jsonString);

      const bufferRQC = base64ToUint8Array(rqc);

      const iv = randomBytes(12);
      const aes = new AES(bufferRQC);
      const gcm = new GCM(aes);

      const cipher = gcm.seal(iv, data);

      const encrypted: EncryptedData = { rqc: bufferRQC, iv, cipher };

      const serialized = encryptedDataToBase64(encrypted);

      return serialized;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }
}

export default APITranscoder;

export function generateRQKey(auth: string): string {
  const now = Math.floor(Date.now() / 1000);
  const appendedKey = now + ":" + auth + ":" + secureReverse(auth, true);
  return btoa(appendedKey);
}

export function getAuthFromRQKey(rqkey: string): string {
  const decodedKey = getDecodedRQKey(rqkey);
  const auth = decodedKey.split(":")[1];
  return auth;
}

export function validateRQKey(rqkey: string): boolean {
  const auth = getAuthFromRQKey(rqkey);
  const secureKey = getSecureKeyFromRQKey(rqkey);
  if (auth !== secureKey) {
    console.error("Access denied. This key is not valid.");
    return false;
  }
  return true;
}

export function getDecodedRQKey(rqkey: string): string {
  return atob(rqkey);
}

export function getSecureKeyFromRQKey(rqkey: string): string | number | object {
  const decodedKey = getDecodedRQKey(rqkey);
  const secureKey = decodeReverse(decodedKey.split(":")[2], "string", true);
  return secureKey;
}

/**
 * Converts input to a string and reverses it.
 * If the input is a number, it is converted to a string.
 * If the input is an object (JSON), it is stringified.
 * If secure is true, it returns a Base64 encoded result.
 * @param {any} input - The input to reverse.
 * @param {boolean} secure - Whether to Base64 encode the result.
 * @returns {string} - The reversed string, possibly encoded.
 */
export function secureReverse(
  input: string | object | number,
  secure: boolean = true
): string {
  let str: string;
  if (typeof input === "number") {
    str = input.toString();
  } else if (typeof input === "object") {
    str = JSON.stringify(input);
  } else {
    str = input;
  }

  let reversedString = str.split("").reverse().join("");

  if (secure) {
    // reversedString = btoa(reversedString);
    reversedString = Buffer.from(reversedString).toString("base64");
  }

  return reversedString;
}

/**
 * Decodes the reversed string based on the mode provided.
 * If secure is true, the reversed string is decoded from Base64 first.
 * @param {string} reversedString - The reversed string (possibly Base64 encoded).
 * @param {string|null} mode - The mode to decode ('json', 'number', or 'string').
 * @param {boolean} secure - Whether the input is Base64 encoded.
 * @returns {any} - The decoded result based on the mode.
 */
export function decodeReverse(
  reversedString: string,
  mode: string = "string",
  secure: boolean = true
): string | object | number {
  // If secure is true, decode the reversed string from Base64
  if (secure) {
    reversedString = atob(reversedString);
  }

  const restoredString = reversedString.split("").reverse().join("");

  if (mode === "json") {
    try {
      return JSON.parse(restoredString);
    } catch (error) {
      throw new Error(`Invalid JSON format. ${error}`);
    }
  } else if (mode === "number") {
    const number = parseFloat(restoredString);
    if (!number) {
      throw new Error("Reversed string is not a valid number");
    }
    return number;
  } else {
    return restoredString; // Treat as string if mode is 'string' or null
  }
}

/* ---------------------------------
 * JSON <-> Bytes Utilities
 * --------------------------------- */

/**
 * Converts a stringified JSON into a Uint8Array (UTF-8 bytes)
 */
export function jsonStringToBytes(jsonString: string): Uint8Array {
  return new TextEncoder().encode(jsonString);
}

/**
 * Converts a Uint8Array (UTF-8 bytes) back into a stringified JSON
 */
export function bytesToJsonString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

/**
 * Converts EncryptedData (Uint8Array fields) into base64 strings
 * for safe transport / storage (JSON, URLs, APIs, etc.)
 */
export function encryptedDataToBase64(
  data: EncryptedData
): SerializedEncryptedData {
  return {
    rqc: arrayToBase64(data.rqc),
    iv: arrayToBase64(data.iv),
    cipher: arrayToBase64(data.cipher),
  };
}

/**
 * Converts SerializedEncryptedData (base64 fields)
 * back into EncryptedData (Uint8Array fields)
 */
export function encryptedDataFromBase64(
  data: SerializedEncryptedData
): EncryptedData {
  return {
    rqc: base64ToUint8Array(data.rqc),
    iv: base64ToUint8Array(data.iv),
    cipher: base64ToUint8Array(data.cipher),
  };
}
export function base64ToJson<T = unknown>(base64: string): T {
  try {
    // 🔹 Step 0: Clean the string (remove whitespace / newlines)
    const cleanBase64 = base64.replace(/\s+/g, "");

    let jsonString: string;

    if (typeof atob === "function") {
      // 🔹 Browser / Service Worker (atob is available globally)
      jsonString = decodeURIComponent(
        atob(cleanBase64)
          .split("")
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join("")
      );
    } else if (typeof Buffer !== "undefined") {
      // 🔹 Node.js fallback (Buffer is available)
      jsonString = Buffer.from(cleanBase64, "base64").toString("utf-8");
    } else {
      throw new Error("No base64 decode available in this environment");
    }

    // 🔹 Parse JSON
    return JSON.parse(jsonString) as T;
  } catch (err) {
    console.error("base64ToJson error:", err);
    throw new Error("Failed to decode Base64 JSON");
  }
}

/* ================================
 * Utilities
 * ================================ */

// utils/utilities.ts
export function arrayToBase64(data: Uint8Array): string {
  let binary = "";
  const bytes = data;
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(base64));
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

export function base64ToUtf8(base64: string): string {
  const buf = base64ToArrayBuffer(base64);
  return new TextDecoder().decode(new Uint8Array(buf));
}

export function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return arrayBufferToBase64(bytes.buffer);
}

export function concatArrayBuffers(
  a: ArrayBuffer,
  b: ArrayBuffer
): ArrayBuffer {
  const tmp = new Uint8Array(a.byteLength + b.byteLength);
  tmp.set(new Uint8Array(a), 0);
  tmp.set(new Uint8Array(b), a.byteLength);
  return tmp.buffer;
}

export function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.byteLength + b.byteLength);
  out.set(a, 0);
  out.set(b, a.byteLength);
  return out;
}

export interface MnemonicJSON {
  seed: string[];
  id: string;
  phrase?: string;
}

/**
 * Converts a space-separated seed phrase string into MnemonicJSON
 */
export function seedToJSON(
  seed: string,
  id: string,
  phrase?: string
): MnemonicJSON {
  return {
    seed: seed
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .filter(Boolean),
    id,
    phrase,
  };
}

/**
 * Converts MnemonicJSON into a single space-separated string
 */
export function jsonToSeed(json: MnemonicJSON): string {
  return json.seed.join(" ");
}

export function seedStringToArray(seed: string): string[] {
  return seed
    .trim()
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter(Boolean);
}
