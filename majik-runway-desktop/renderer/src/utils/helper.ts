import cryptoJS from "crypto-js";

// Helper functions with TypeScript types

/**
 * Returns an ISO String representing the current time plus input in hours.
 *
 * @param {number} hours - The number of hours to offset from the current time.
 * @returns {string} Returns the ISO string format after offset
 */
export function offsetDateTimeByHours(hours: number = 0): string {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now.toISOString();
}

export function getLanguageCode(
  languageName: string,
  languageOptions: { name: string; code: string }[]
): string | null {
  for (let i = 0; i < languageOptions.length; i++) {
    if (languageOptions[i].name.toLowerCase() === languageName.toLowerCase()) {
      return languageOptions[i].code;
    }
  }
  return null; // Return null if the language is not found
}

export function getCognitoHash(
  email: string,
  clientId: string,
  clientSecret: string
): string {
  const hash = cryptoJS.HmacSHA256(email + clientId, clientSecret);
  console.log("Hash: ", cryptoJS.enc.Base64.stringify(hash));
  return cryptoJS.enc.Base64.stringify(hash);
}

export function appendNames(nameFirst: string, surname: string): string {
  return nameFirst + " " + surname;
}

export function convertDateToISO(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

export function parseDateForCognito(dateInput: number | string): string {
  let date: Date;
  // Check if input is a number (timestamp)
  if (typeof dateInput === "number") {
    date = new Date(dateInput);
  } else {
    date = new Date(dateInput);
  }

  // If date is invalid, throw an error
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  // Format the date to 'YYYY-MM-DD'
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function generateTimestamp(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp.toString();
}

export function parseImage(
  url: string,
  blurhash: string,
  width: number,
  height: number
): { url: string; blurhash: string; width: number; height: number } {
  return { url, blurhash, width, height };
}

export function parseDateFromISO(
  dateISO: string,
  dateOnly: boolean = false
): string {
  const date = new Date(dateISO);
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = date.toLocaleDateString("en-US", optionsDate);
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);

  if (dateOnly) {
    return `${formattedDate}`;
  }
  return `${formattedDate} | ${formattedTime}`;
}

export function parseTimeFromISO(dateISO: string): string {
  const date = new Date(dateISO);
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
  return `${formattedTime}`;
}

export function decodeBase64AndSplit(base64String: string): {
  auth: string;
  timestamp: string;
} {
  const decodedString = atob(base64String);
  const parts = decodedString.split(":");
  if (parts.length !== 2) {
    throw new Error(
      "The decoded string does not contain exactly two parts separated by a colon."
    );
  }
  return { auth: parts[0], timestamp: parts[1] };
}

/**
 * Converts a number into a percentage string.
 *
 * - When `override` is **false** (default):
 *   - Values greater than 1 are capped at 100 %.
 *   - Values less than -1 are capped at -100 %.
 * - When `override` is **true**:
 *   - Values are not clamped; any number is converted directly (e.g., 1.5 → 150 %, –0.4 → –40 %, 2.7 → 270 %).
 * - Result is formatted to a maximum of 2 decimal places.
 *
 * @param value     The number to convert.
 * @param override  If `true`, bypasses clamping and allows values outside –1 … 1. (default: `false`)
 * @returns         A formatted percentage string (e.g., "54.21%").
 */
export function formatPercentage(value: number, override = false): string {
  const processed = override ? value : Math.max(-1, Math.min(1, value));
  const percentage = +(processed * 100).toFixed(2);
  return `${percentage}%`;
}

export function formatAmountCurrency(
  amount: string | number | null | undefined,
  currency: string = "PHP"
): string {
  let finalAmount: number | string = amount ? amount : 0;
  if (amount == null) {
    finalAmount = 0;
  }

  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }

  if (!amount) {
    return `${currency} 0.00`;
  } else {
    const formattedAmount = finalAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency} ${formattedAmount}`;
  }
}

export function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.startsWith("63")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("0")) {
    return `+63${cleaned.substring(1)}`;
  }
  return `+63${cleaned}`;
}

export function formatSmartNumber(input: string | number): string {
  const number =
    typeof input === "string" ? parseFloat(input.replace(/,/g, "")) : input;

  if (isNaN(number)) return "Invalid Number";

  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + "B";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + "K";
  } else {
    return number.toFixed(0);
  }
}

export function parseSocials(
  platform: "facebook" | "tiktok" | "threads" | "x" | "instagram",
  input: string
): string | null {
  if (!input) return null;

  const value = input.trim().toLowerCase();

  switch (platform) {
    case "facebook": {
      const facebookRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/|fb\.com\/|fb\.me\/|facebook\.co\/)([a-zA-Z0-9.]+)(?:\/|$)/;
      const match = value.match(facebookRegex);
      return match ? match[1] : value;
    }

    case "tiktok": {
      const tiktokRegex =
        /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_.]+)(?:\/|$)/;
      const match = value.match(tiktokRegex);
      return match ? match[1] : value;
    }

    case "threads": {
      const threadsRegex =
        /^(?:https?:\/\/)?(?:www\.)?threads\.net\/@([a-zA-Z0-9_.]+)(?:\/|$)|^@([a-zA-Z0-9_.]+)$/;
      const match = value.match(threadsRegex);
      return match ? match[1] || match[2] : value;
    }

    case "x": {
      const xRegex =
        /^(?:https?:\/\/)?(?:www\.)?x\.com\/@([a-zA-Z0-9_]{1,15})(?:\/|$)|^@([a-zA-Z0-9_]{1,15})$/;
      const match = value.match(xRegex);
      return match ? match[1] || match[2] : value;
    }

    case "instagram": {
      const instagramRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/|ig\.com\/|insta\.com\/)([a-zA-Z0-9_.]{1,30})(?:\/|$)/;
      const match = value.match(instagramRegex);
      return match ? match[1] : value;
    }

    default:
      return value;
  }
}

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

// utils/debounce.ts
export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout | undefined;

  const debouncedFunction = (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };

  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return debouncedFunction;
};

// Encryption function
export function encryptPayload(
  base64String: string,
  dtime: number,
  bytes = false
): number[] | string {
  // Validate dtime value
  if (dtime < 0 || dtime > 255 || !Number.isInteger(dtime)) {
    throw new Error("dtime must be an integer between 0 and 255.");
  }

  // Convert the base64 string to a byte array
  const byteArray = Uint8Array.from(atob(base64String), (char) =>
    char.charCodeAt(0)
  );

  // Create a new array to store the encrypted data
  const encryptedArray: number[] = [];

  // Insert the dtime value between every byte
  for (let i = 0; i < byteArray.length; i++) {
    encryptedArray.push(byteArray[i]);
    encryptedArray.push(dtime); // Insert the dtime byte after each byte
  }

  // If 'bytes' flag is true, return the byte array
  if (bytes) {
    return encryptedArray;
  }

  // Convert the array to base64 string
  return btoa(String.fromCharCode(...encryptedArray));
}

// Decryption function
export function decryptPayload(
  base64String: string,
  bytes = false
): number[] | string {
  // Convert base64 to byte array
  const byteArray = Uint8Array.from(atob(base64String), (char) =>
    char.charCodeAt(0)
  );

  // Validate if the byte array length is even (to ensure correct pattern)
  if (byteArray.length % 2 !== 0) {
    throw new Error("Invalid byte array length, cannot be decrypted.");
  }

  // Extract dtime from the first occurrence
  const dtime = byteArray[1];

  // Validate dtime pattern
  for (let i = 1; i < byteArray.length; i += 2) {
    if (byteArray[i] !== dtime) {
      throw new Error("Inconsistent dtime found in the byte array.");
    }
  }

  // Reconstruct the original byte array
  const originalArray: number[] = [];
  for (let i = 0; i < byteArray.length; i += 2) {
    originalArray.push(byteArray[i]);
  }

  // Return original byte array or base64 encoded string based on 'bytes' flag
  if (bytes) {
    return originalArray;
  }

  // Convert back to base64 string
  return btoa(String.fromCharCode(...originalArray));
}

// Prepare Blob file from various input types
export function prepareToBlobFile(data: unknown): Blob {
  let blob: Blob;

  if (typeof data === "object" && data !== null) {
    // JSON object to Blob
    const jsonString = JSON.stringify(data);
    blob = new Blob([jsonString], { type: "application/json" });
  } else if (typeof data === "string") {
    // Base64 string to Blob
    const byteCharacters = atob(data);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    blob = new Blob([byteNumbers], { type: "application/octet-stream" });
  } else if (data instanceof Uint8Array || Array.isArray(data)) {
    // Byte array to Blob
    blob = new Blob([...data], { type: "application/octet-stream" });
  } else {
    throw new Error(
      "Unsupported data type. Provide an object, Base64 string, or byte array."
    );
  }

  return blob;
}

/**
 * Converts a Blob or File to JSON if possible.
 * Returns null if parsing fails.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function blobToJSON<T = any>(blob: Blob): Promise<T | null> {
  try {
    // Convert blob to text
    const text = await blob.text();

    // Parse JSON
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("Failed to parse blob to JSON:", err);
    return null;
  }
}

// Download Blob file
export function downloadBlob(
  blob: Blob,
  filetype: string,
  fileName: string
): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.${filetype}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Read Blob file and decode its content
export function readBlobFile(blob: Blob): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;

      try {
        if (blob.type === "application/json") {
          const jsonContent = JSON.parse(content as string);
          resolve(jsonContent);
        } else if (blob.type === "text/plain" || blob.type === "") {
          const isBase64 = (str: string) => /^[A-Za-z0-9+/=]*$/.test(str);
          if (isBase64(content as string)) {
            const byteCharacters = atob(content as string);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            resolve(byteNumbers);
          } else {
            resolve(content);
          }
        } else if (blob.type.startsWith("application/octet-stream")) {
          const byteReader = new FileReader();
          byteReader.onload = (e) => {
            const byteArray = new Uint8Array(e.target?.result as ArrayBuffer);
            resolve(byteArray);
          };
          byteReader.readAsArrayBuffer(blob);
        } else {
          reject(new Error("Unsupported Blob type."));
        }
      } catch (error) {
        reject(new Error(`Error decoding the Blob file. ${error}`));
      }
    };

    reader.onerror = () => reject(new Error("Error reading the Blob file."));
    reader.readAsText(blob);
  });
}

// Enum for supported devices
export const ENUM_Devices = Object.freeze({
  ANDROID: "Mobile (Android)",
  IOS: "Mobile (Apple iOS)",
  WINDOWS: "Windows",
  MAC: "Macintosh",
  LINUX: "Linux",
  CHROME_OS: "ChromeOS",
  TABLET: "Tablet",
  OTHER: "Other",
});

// Detect device type
export function detectDevice(): string {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) {
    return ENUM_Devices.ANDROID;
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    return ENUM_Devices.IOS;
  } else if (/Windows NT/.test(userAgent)) {
    return ENUM_Devices.WINDOWS;
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    return ENUM_Devices.MAC;
  } else if (/CrOS/.test(userAgent)) {
    return ENUM_Devices.CHROME_OS;
  } else if (/Linux/.test(userAgent)) {
    return ENUM_Devices.LINUX;
  } else if (/Tablet|iPad/.test(userAgent)) {
    return ENUM_Devices.TABLET;
  } else {
    return ENUM_Devices.OTHER;
  }
}

// Check if the specified time has passed
export function hasTimePassed(time: number, originTime: string): boolean {
  const originDate = new Date(originTime);
  const currentDate = new Date();
  const elapsedTime = Math.floor(
    (currentDate.getTime() - originDate.getTime()) / 1000
  );
  return elapsedTime >= time;
}

// Convert Base64 string to binary
export function base64ToBinary(base64String: string): {
  binaryData: Uint8Array;
  contentType: string;
} {
  let base64Data = base64String;
  let contentType = "";

  if (base64String.startsWith("data:")) {
    const matches = base64String.match(/^data:(.*?);base64,/);
    if (matches) {
      contentType = matches[1];
    }
    base64Data = base64String.split(",")[1];
  }

  const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  return { binaryData, contentType };
}

// Check if environment is development
export function isDevEnvironment(): boolean {
  const isNodeEnvOnDev = process.env.NODE_ENV === "development";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isHostOnDev = hostname === "localhost" || hostname === "127.0.0.1";
    return isNodeEnvOnDev || isHostOnDev;
  }

  return isNodeEnvOnDev;
}

/**
 * Compares two JSON objects and checks for any changes.
 *
 * @param {Object} json1 - The first JSON object to compare.
 * @param {Object} json2 - The second JSON object to compare.
 * @returns {boolean} - Returns true if there are changes, false if they are the same.
 */
export function checkForChangesJSON(json1: object, json2: object): boolean {
  const str1: string = JSON.stringify(json1);
  const str2: string = JSON.stringify(json2);
  return str1 !== str2;
}

/**
 * Checks if the current browser is Facebook or Messenger's in-app browser.
 *
 * @returns {boolean} - Returns `true` if the app is loaded in Facebook or Messenger's in-app browser (iOS or Android).
 */
export function isFacebookInAppBrowser(): boolean {
  const userAgent = navigator.userAgent;
  return /FBAN|FBAV|FBBV|FB_IAB|Messenger|MessengerForiOS/.test(userAgent);
}

/**
 * Checks if a Unix timestamp is still valid (greater than the current time).
 *
 * @param {number} unixTimestamp - The Unix timestamp to check.
 * @returns {boolean} Returns true if the timestamp is still valid (greater than current time), false otherwise.
 * @throws {Error} Throws an error if the unixTimestamp is not a valid Unix timestamp.
 */
export function isTimestampValid(unixTimestamp: number): boolean {
  if (typeof unixTimestamp !== "number" || isNaN(unixTimestamp)) {
    throw new Error("Invalid unixTimestamp: must be a number.");
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return unixTimestamp > currentTime;
}

/**
 * Converts a Unix timestamp, Date object, ISO string, or null/undefined into a secure Base64 string.
 * Defaults to the current time if input is null or undefined.
 *
 * @param {(number | Date | string | null | undefined)} input - The time input.
 * @returns {string} A secure Base64 encoded string generated from the timestamp.
 * @throws {Error} Throws an error if the input is not a valid time format.
 */
export function secureTimecode(
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

/**
 * Decodes a Base64 string generated by secureTimecode back into a Unix timestamp.
 *
 * @param {string} base64String - The Base64 string to decode.
 * @returns {number} The decoded Unix timestamp.
 * @throws {Error} Throws an error if validation fails (reversed array doesn't match original).
 */
export function decodeSecureTimecode(base64String: string): number {
  const decodedArray = Array.from(atob(base64String)).map((char) =>
    char.charCodeAt(0)
  );

  const originalArray = decodedArray.filter((_, i) => i % 2 === 0);
  const reversedArray = decodedArray.filter((_, i) => i % 2 !== 0).reverse();

  if (originalArray.join("") !== reversedArray.join("")) {
    throw new Error(
      "Validation failed: reversed array does not match the original array."
    );
  }

  return parseInt(originalArray.join(""), 10);
}

/**
 * Checks if a Unix timestamp has expired based on a specified duration in seconds.
 *
 * @param {number} durationInSeconds - The allowed duration in seconds for the timestamp.
 * @param {number} unixTimestamp - The Unix timestamp to check.
 * @returns {boolean} Returns true if the timestamp has expired, false otherwise.
 * @throws {Error} Throws an error if the unixTimestamp is not a valid Unix timestamp.
 */
export function isTimestampExpired(
  durationInSeconds: number,
  unixTimestamp: number
): boolean {
  if (typeof unixTimestamp !== "number" || isNaN(unixTimestamp)) {
    throw new Error("Invalid unixTimestamp: must be a number.");
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > unixTimestamp + durationInSeconds;
}

/**
 * Checks if a decoded Base64 timecode has expired based on a specified duration in seconds.
 *
 * @param {string} base64String - The Base64 encoded timecode.
 * @param {number} durationInSeconds - The allowed duration in seconds.
 * @returns {boolean} Returns true if the decoded Unix timestamp has expired, false otherwise.
 * @throws {Error} Throws an error if validation of the decoded timecode fails.
 */
export function isSTXExpired(
  base64String: string,
  durationInSeconds: number
): boolean {
  const unixTimestamp = decodeSecureTimecode(base64String);
  return isTimestampExpired(durationInSeconds, unixTimestamp);
}

/**
 * Determines whether the user is accessing the application from a mobile device.
 *
 * @returns {boolean} - Returns true if the device is likely mobile, otherwise false.
 */
export function isOnMobile(): boolean {
  const userAgent = navigator.userAgent;
  const mobileUserAgents = [
    "Android",
    "iPhone",
    "iPad",
    "iPod",
    "Windows Phone",
    "Opera Mini",
    "IEMobile",
    "Mobile",
    "BlackBerry",
    "webOS",
    "Silk",
  ];

  const hasTouchScreen = (): boolean =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isScreenSmall = window.innerWidth <= 800 && window.innerHeight <= 800;
  const isMobileUserAgent = mobileUserAgents.some((agent) =>
    userAgent.includes(agent)
  );

  return isMobileUserAgent || hasTouchScreen() || isScreenSmall;
}

/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export function capitalizeWords(str: string): string {
  if (typeof str !== "string") throw new Error("Input must be a string");
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generates a SHA-256 hash for a given string.
 * Validates that the input is a non-empty string.
 * @param {string} string - The string to hash.
 * @returns {string} The hash of the string in hexadecimal format.
 * @throws {Error} If the input is not a valid non-empty string.
 */
export function hashString(string: string): string {
  const hash = cryptoJS.SHA256(string);
  return hash.toString(cryptoJS.enc.Hex);
}

/**
 * Calculate age based on a birthday, either as an ISO 8601 string or a Date object.
 * @param birthday - The birthday as an ISO 8601 string (e.g., "1990-12-07") or a Date object.
 * @returns The age as a number.
 */
export function getAgeFromBirthdayISO(birthday: string | Date): number {
  // Convert to Date if input is a string
  const birthDate =
    typeof birthday === "string" ? new Date(birthday) : birthday;

  if (isNaN(birthDate.getTime())) {
    throw new Error(
      "Invalid date input. Please provide a valid ISO string or Date object."
    );
  }

  const today = new Date();
  const yearsDifference = today.getFullYear() - birthDate.getFullYear();

  const isBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  return isBirthdayPassedThisYear ? yearsDifference : yearsDifference - 1;
}

/**
 * Splits the input string using the specified delimiter and returns the part at the given index.
 *
 * @param input - The input string to split.
 * @param index - The zero-based index of the desired part.
 * @param delimiter - The string used to split the input string.
 * @param defaultValue - (Optional) A fallback value to return if the index is out of bounds.
 *
 * @returns The string at the given index, or the default value if provided, otherwise null.
 */
export function getStringPart(
  input: string,
  index: number,
  delimiter: string
): string | null {
  // Validate input parameters
  if (typeof input !== "string")
    throw new Error("Parameter 'input' must be a string.");
  if (typeof index !== "number")
    throw new Error("Parameter 'index' must be a number.");
  if (typeof delimiter !== "string")
    throw new Error("Parameter 'delimiter' must be a string.");

  // Split the input string based on the delimiter
  const parts = input.split(delimiter);

  // Return the value at the given index if it exists; otherwise, return the defaultValue
  if (index >= 0 && index < parts.length) {
    return parts[index];
  } else {
    return null;
  }
}

/**
 * Checks if the part of the input string at the specified index matches the given value.
 *
 * @param input - The input string to split.
 * @param index - The zero-based index of the desired part.
 * @param delimiter - The string used to split the input string.
 * @param value - The value to compare the extracted part with.
 *
 * @returns True if the extracted part equals the value; otherwise, false.
 */
export function isStringPartEqualTo(
  input: string,
  index: number,
  delimiter: string,
  value: string
): boolean {
  try {
    // Reuse getStringPart to extract the part at the specified index
    const extractedPart = getStringPart(input, index, delimiter);

    // Compare the extracted part to the value and return the result
    return extractedPart === value;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Transforms the input text based on the specified capitalization mode.
 *
 * @param text - The input string to be transformed.
 * @param mode - The capitalization mode to apply. Can be one of the following:
 *   - "word": Capitalizes the first letter of every word separated by whitespace.
 *   - "character": Converts the entire string to uppercase.
 *   - "sentence": Capitalizes the first letter of every sentence, defined as text following a period and a space.
 *   - "first": (Default) Capitalizes only the first character of the entire string.
 * @returns The transformed string based on the selected mode.
 */
export function autocapitalize(
  text: string,
  mode: "word" | "character" | "sentence" | "first" = "first"
): string {
  if (!text) return "";

  switch (mode) {
    case "word":
      return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    case "character":
      return text.toUpperCase();

    case "sentence":
      return text.replace(/(^|\.\s+)([^\s\n])/g, (_match, prefix, char) => {
        // Prefix captures the period and following space, including newlines
        // Char is the first character after the prefix
        return prefix + char.toUpperCase();
      });

    case "first":
    default:
      return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

/**
 * Checks if the specified time has passed relative to the current time.
 *
 * @param {string} dateTime - The target date and time in ISO string format (e.g., "2025-01-01T17:30:00Z").
 * @param {number} time - The amount of time (in the specified unit) to check if has passed since the given `dateTime`.
 * @param {'SECONDS' | 'MINUTES' | 'HOURS' | 'DAYS' | 'MONTHS' | 'QUARTER' | 'YEAR'} type - The unit of time for comparison. Default is 'MINUTES'.
 *
 * @returns {boolean} - Returns `true` if the specified time has passed based on the given `type` and `time`; otherwise, returns `false`.
 *
 * @example
 * hasTimeElapsed("2025-01-01T17:30:00Z", 6, 'HOURS'); // Returns `true` if the current time is at least 6 hours later than the given dateTime
 */
export function hasTimeElapsed(
  dateTime: string,
  time: number,
  type:
    | "SECONDS"
    | "MINUTES"
    | "HOURS"
    | "DAYS"
    | "MONTHS"
    | "QUARTER"
    | "YEAR" = "MINUTES"
): boolean {
  const now = new Date();
  const targetDate = new Date(dateTime);

  // Function to get the time difference in the specified unit
  const getTimeDifference = (
    target: Date,
    current: Date,
    unit: string
  ): number => {
    const diffInMs = target.getTime() - current.getTime();

    switch (unit) {
      case "SECONDS":
        return diffInMs / 1000;
      case "MINUTES":
        return diffInMs / (1000 * 60);
      case "HOURS":
        return diffInMs / (1000 * 60 * 60);
      case "DAYS":
        return diffInMs / (1000 * 60 * 60 * 24);
      case "MONTHS":
        return diffInMs / (1000 * 60 * 60 * 24 * 30); // Approximation (30 days per month)
      case "QUARTER":
        return diffInMs / (1000 * 60 * 60 * 24 * 90); // Approximation (90 days per quarter)
      case "YEAR":
        return diffInMs / (1000 * 60 * 60 * 24 * 365); // Approximation (365 days per year)
      default:
        return 0;
    }
  };

  const difference = getTimeDifference(targetDate, now, type);

  // Return true if the target time has passed by the specified amount
  return difference >= time;
}

/**
 * Extracts the YouTube video ID from a given URL string.
 *
 * @param url - The full YouTube URL (e.g., https://www.youtube.com/watch?v=LUkf3CK1NR0).
 * @returns The extracted 11-character video ID if found, or null if the input is invalid or not a recognized YouTube URL.
 */
export function extractYouTubeVideoID(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:shorts\/|(?:[^\\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Extracts the Spotify song ID from a given Spotify track URL.
 *
 * @param url - The full Spotify track URL (e.g., embed or regular track link).
 * @returns The Spotify song ID as a string, or null if not found.
 */
export function extractSpotifySongID(url: string): string | null {
  const match = url.match(/\/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export async function convertToBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  console.log("Converted Blob: ", blob);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function getRandomNeonHexColor(): string {
  const neonBase = [
    [255, getRand(100, 255), getRand(100, 255)], // R-heavy neon
    [getRand(100, 255), 255, getRand(100, 255)], // G-heavy neon
    [getRand(100, 255), getRand(100, 255), 255], // B-heavy neon
  ];

  const base = neonBase[Math.floor(Math.random() * neonBase.length)];

  const r = base[0];
  const g = base[1];
  const b = base[2];

  return rgbToHex(r, g, b);
}

function getRand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((val) => {
        const hex = val.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export const URLType = {
  Website: "Website",
  Image: "Image",
  Youtube: "Youtube",
  Facebook: "Facebook",
  X: "X",
  Threads: "Threads",
  Instagram: "Instagram",
  Spotify: "Spotify",
  Soundcloud: "Soundcloud",
  Canva: "Canva",
  Pinterest: "Pinterest",
} as const;

export type URLType = (typeof URLType)[keyof typeof URLType];

export function identifyURLType(url: string): URLType {
  const lowerUrl = url.toLowerCase();

  // Check for image extensions
  const imageExtensions = [
    ".webp",
    ".png",
    ".jpeg",
    ".jpg",
    ".tiff",
    ".bmp",
    ".gif",
    ".svg",
  ];
  if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
    return URLType.Image;
  }

  // Youtube
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return URLType.Youtube;
  }

  // Facebook / Instagram
  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) {
    return URLType.Facebook;
  }

  //  Instagram
  if (lowerUrl.includes("instagram.com")) {
    return URLType.Instagram;
  }

  //  Threads
  if (lowerUrl.includes("threads.net")) {
    return URLType.Threads;
  }

  //  X (formerly Twitter)
  if (
    lowerUrl.includes("twitter.com") || // aka "X"
    lowerUrl.includes("x.com")
  ) {
    return URLType.X;
  }

  // Spotify
  if (lowerUrl.includes("spotify.com")) {
    return URLType.Spotify;
  }

  // Soundcloud
  if (lowerUrl.includes("soundcloud.com")) {
    return URLType.Soundcloud;
  }

  // Canva
  if (lowerUrl.includes("canva.com")) {
    return URLType.Canva;
  }

  // Pinterest
  if (lowerUrl.includes("pinterest.com")) {
    return URLType.Pinterest;
  }

  // Default fallback
  return URLType.Website;
}

export function displayFormattedTIN(tin: number | string): string {
  const tinStr = tin.toString().padStart(12, "0"); // ensure 12 digits
  return tinStr.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})$/, "$1-$2-$3-$4");
}

export interface PinterestAuthCode {
  code: string;
  state: string;
}

export function getPinterestParams(): PinterestAuthCode | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  if (code && state) {
    return { code, state };
  }

  return null;
}

export function openURLNewTab(url: string): void {
  if (typeof window === "undefined") {
    // Prevent running on server
    return;
  }

  if (!url || typeof url !== "string") {
    console.error("Invalid URL");
    return;
  }

  const fullURL =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  const newTab = window.open(fullURL, "_blank");

  if (newTab) {
    newTab.focus();
  } else {
    console.error("Failed to open new tab. Pop-up blocker may be active.");
  }
}

export type PasswordRequirement =
  | "NONE"
  | "DEFAULT"
  | "LETTERS-DIGITS"
  | "CASED-DIGITS"
  | "CASED-DIGITS-SYMBOLS";

/**
 * Validates a password string against specified strength requirements.
 *
 * @param {string} password - The password string to validate.
 * @param {number} [minLength=8] - The minimum required length of the password. Defaults to 8.
 * @param {"NONE" | "DEFAULT" | "LETTERS-DIGITS" | "CASED-DIGITS" | "CASED-DIGITS-SYMBOLS"} [requirements="DEFAULT"]
 * - The password strength requirements:
 *   - "DEFAULT": Only checks the minimum length.
 *   - "LETTERS-DIGITS": Requires at least one digit.
 *   - "CASED-DIGITS": Requires both uppercase and lowercase letters, and at least one digit.
 *   - "CASED-DIGITS-SYMBOLS": Requires uppercase, lowercase, at least one digit, and at least one symbol.
 *
 * @returns {boolean} Returns `true` if the password meets the specified requirements, otherwise `false`.
 *
 * @example
 * isPasswordValidSafe("Password1"); // true (with default settings)
 * isPasswordValidSafe("pass1234", 8, "CASED-DIGITS"); // false (missing uppercase)
 * isPasswordValidSafe("Pass1234!", 8, "CASED-DIGITS-SYMBOLS"); // true
 */

export function isPasswordValidSafe(
  password: string,
  minLength: number = 8,
  requirements: PasswordRequirement = "DEFAULT"
): boolean {
  if (password.length < minLength) return false;

  switch (requirements) {
    case "DEFAULT":
      return true;

    case "LETTERS-DIGITS":
      return /\d/.test(password);

    case "CASED-DIGITS":
      return (
        /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
      );

    case "CASED-DIGITS-SYMBOLS":
      return (
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[^a-zA-Z0-9]/.test(password)
      );

    default:
      return false;
  }
}

/**
 * Combines a list of strings into a single string using the given divider.
 * @param strings - An array of strings to combine.
 * @param divider - A string used to separate the strings (defaults to ':').
 * @returns A single concatenated string.
 */
export function appendStrings(
  strings: string[],
  divider: string = ":"
): string {
  return strings.join(divider);
}

type TimeUnit =
  | "milliseconds"
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years";

const TIME_IN_MS: Record<TimeUnit, number> = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
  weeks: 1000 * 60 * 60 * 24 * 7,
  months: 1000 * 60 * 60 * 24 * 30, // approximate
  years: 1000 * 60 * 60 * 24 * 365, // approximate
};

const TIME_UNITS_ORDER: TimeUnit[] = [
  "milliseconds",
  "seconds",
  "minutes",
  "hours",
  "days",
  "weeks",
  "months",
  "years",
];

type FormatStyle = "plain" | "duration" | "timeline";
/**
 * Converts a numeric time value from one unit to another and returns a human-readable string.
 *
 * This function supports:
 * - Automatic unit selection (`autoSize`) to pick the most readable unit.
 * - Different output formats (`formatStyle`) such as plain text, compact duration, or timeline format.
 *
 * @param {number} input - The numeric value of the time duration to convert.
 * @param {TimeUnit} [fromUnit="milliseconds"] - The unit of the input value.
 * @param {TimeUnit} [toUnit] - The target unit to convert to. Ignored if `autoSize` is true.
 * @param {boolean} [autoSize=false] - If true, automatically selects the most human-readable unit,
 *   overriding `toUnit`.
 * @param {FormatStyle} [formatStyle="plain"] - The output format of the string:
 *   - `"plain"`: e.g., `"5 seconds"`, `"6 hours"`.
 *   - `"duration"`: compact format using unit abbreviations, e.g., `"5h 12m"`, `"1m 5s"`.
 *   - `"timeline"`: HH:MM:SS format (auto-adjusts for days), e.g., `"01:05:03"`.
 *
 * @returns {string} A formatted string representing the converted time.
 *
 * @example
 * formatTime(120, "minutes", "hours"); // "2 hours"
 * @example
 * formatTime(60, "seconds", undefined, true); // "1 minute" (plain)
 * @example
 * formatTime(60, "seconds", undefined, true, "duration"); // "1m"
 * @example
 * formatTime(90061, "seconds", undefined, true, "timeline"); // "01:01:01"
 */
export function formatTime(
  input: number,
  fromUnit: TimeUnit = "milliseconds",
  toUnit?: TimeUnit,
  autoSize: boolean = false,
  formatStyle: FormatStyle = "plain"
): string {
  const inputInMs = input * TIME_IN_MS[fromUnit];

  let targetUnit: TimeUnit = toUnit || "milliseconds";

  if (autoSize) {
    for (let i = TIME_UNITS_ORDER.length - 1; i >= 0; i--) {
      const unit = TIME_UNITS_ORDER[i];
      const value = inputInMs / TIME_IN_MS[unit];
      if (value >= 1) {
        targetUnit = unit;
        break;
      }
    }
  }

  if (formatStyle === "timeline") {
    let remaining = Math.floor(inputInMs);
    const days = Math.floor(remaining / TIME_IN_MS.days);
    remaining %= TIME_IN_MS.days;
    const hours = Math.floor(remaining / TIME_IN_MS.hours);
    remaining %= TIME_IN_MS.hours;
    const minutes = Math.floor(remaining / TIME_IN_MS.minutes);
    remaining %= TIME_IN_MS.minutes;
    const seconds = Math.floor(remaining / TIME_IN_MS.seconds);
    const milliseconds = remaining % 1000;

    const parts: string[] = [];
    if (days) parts.push(String(days).padStart(2, "0"));
    if (days || hours) parts.push(String(hours).padStart(2, "0"));
    parts.push(String(minutes).padStart(2, "0"));
    parts.push(String(seconds).padStart(2, "0"));

    // optionally include milliseconds if under 1 second total
    if (!days && !hours && !minutes && milliseconds) {
      return parts.join(":") + `.${milliseconds}`;
    }

    return parts.join(":");
  }

  if (formatStyle === "duration") {
    let remaining = Math.floor(inputInMs);
    const parts: string[] = [];

    for (const unit of [
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds",
    ] as TimeUnit[]) {
      const unitValue = Math.floor(remaining / TIME_IN_MS[unit]);
      if (unitValue) {
        const shortLabel = unit.charAt(0); // e.g., "h" for "hours"
        parts.push(`${unitValue}${shortLabel}`);
        remaining -= unitValue * TIME_IN_MS[unit];
      }
    }

    return parts.join(" ") || `0ms`;
  }

  // default plain
  const converted = inputInMs / TIME_IN_MS[targetUnit];
  const rounded = Math.round(converted * 100) / 100;
  const unitLabel = rounded === 1 ? targetUnit.slice(0, -1) : targetUnit;

  return `${rounded} ${unitLabel}`;
}



