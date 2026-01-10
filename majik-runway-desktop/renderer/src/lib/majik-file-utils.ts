import APITranscoder, {
  type SerializedEncryptedData,
} from "@/utils/APITranscoder";

interface MajikFileData {
  /** JSON object */
  j: unknown;

  /** STX Timestamp */
  s: string;

  /** Version */
  v: string;
}
export async function importMajikFileData(file: File): Promise<MajikFileData> {
  if (!file) throw new Error("Invalid file.");

  if (!file.name.endsWith(".mjkb")) {
    throw new Error(
      "Oops! Only .mjkb files are allowed. Please load a valid MajikFile."
    );
  }

  try {
    // Step 1: Read as base64 text
    const base64String = (await readBlobFile(file)) as string;

    // Step 2: base64 → JSON
    const jsonString = base64DecodeUtf8(base64String);
    const parsedData = JSON.parse(jsonString) as SerializedEncryptedData;

    // Step 3: Decrypt
    const decryptedData = APITranscoder.decryptPayload(parsedData);

    return decryptedData as unknown as MajikFileData;
  } catch (error) {
    console.error("Import Error:", error);
    throw new Error("Failed to import and decrypt .mjkb file.");
  }
}

export async function loadSavedMajikFileData(
  file: Blob
): Promise<MajikFileData> {
  try {
    const content = await readBlobFile(file);

    // Step 2: base64 → UTF-8 JSON string
    const jsonString = base64DecodeUtf8(content);

    // Step 3: Parse encrypted payload
    const parsedData = JSON.parse(jsonString) as SerializedEncryptedData;

    const decryptedData = APITranscoder.decryptPayload(parsedData);

    const MajikFileData = decryptedData as unknown as MajikFileData;

    return MajikFileData;
  } catch (error) {
    console.error("Loading Autosaved File Error: ", error);
    throw new Error("Failed to load autosaved .mjkb file.");
  }
}

export function autoSaveMajikFileData(
  json: unknown,
  version: string = "1.0.0"
): Blob {
  const rawData = {
    j: json,
    s: secureTimecode(),
    v: version,
  };

  const generatedRQC = APITranscoder.generateRQC();
  const encryptedData = APITranscoder.encryptPayload(rawData, generatedRQC);

  const dataString = JSON.stringify(encryptedData);

  // 🔐 Convert JSON string to base64
  const base64Encoded = base64EncodeUtf8(dataString);

  const blobData = prepareToBlobFile(base64Encoded);
  return blobData;
}

export function exportMajikFileData(
  json: unknown,
  name: string,
  version: string = "1.0.0"
): void {
  const rawData = {
    j: json,
    s: secureTimecode(),
    v: version,
  };

  const generatedRQC = APITranscoder.generateRQC();
  const encryptedData = APITranscoder.encryptPayload(rawData, generatedRQC);

  const dataString = JSON.stringify(encryptedData);

  // 🔐 Convert JSON string to base64
  const base64Encoded = base64EncodeUtf8(dataString);

  const blobData = prepareToBlobFile(base64Encoded);
  downloadBlob(blobData, "mjkb", name);
}

// Prepare Blob file from various input types
export function prepareToBlobFile(data: string): Blob {
  return new Blob([data], { type: "text/plain" });
}

// Download Blob file
function downloadBlob(blob: Blob, filetype: string, fileName: string): void {
  const file = new File([blob], `${fileName}.${filetype}`, { type: blob.type });

  const tryShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: fileName,
          text: `Download ${fileName}.${filetype}`,
        });
        return;
      } catch (error) {
        console.warn("Share not supported in desktop:", error);
        // Fallback continues
      }
    }
    // Fallback to download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${filetype}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Ensure it's wrapped in a user-triggered event like a button click
  void tryShare();
}

// Read Blob file and decode its content
function readBlobFile(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error reading file"));

    reader.readAsText(blob);
  });
}

/**
 * Converts a Unix timestamp, Date object, ISO string, or null/undefined into a secure Base64 string.
 * Defaults to the current time if input is null or undefined.
 *
 * @param {(number | Date | string | null | undefined)} input - The time input.
 * @returns {string} A secure Base64 encoded string generated from the timestamp.
 * @throws {Error} Throws an error if the input is not a valid time format.
 */
function secureTimecode(
  input?: number | Date | string | null | undefined
): string {
  const unixTimestamp = (() => {
    if (input === null || input === undefined)
      return Math.floor(Date.now() / 1000);
    if (typeof input === "number") return input;
    if (input instanceof Date) return Math.floor(input.getTime() / 1000);
    if (typeof input === "string")
      return Math.floor(new Date(input).getTime() / 1000);
    throw new Error(
      "Invalid input type. Must be Unix timestamp, Date object, or ISO string."
    );
  })();

  const unixArray = Array.from(String(unixTimestamp), Number);
  const reversedArray = [...unixArray].reverse();
  const invertedArray: number[] = [];

  for (let i = 0; i < unixArray.length; i++) {
    invertedArray.push(unixArray[i], reversedArray[i]);
  }

  return btoa(String.fromCharCode(...invertedArray));
}

export function base64EncodeUtf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";

  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return btoa(binary);
}

export function base64DecodeUtf8(base64: string): string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
