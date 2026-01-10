import { customAlphabet } from "nanoid";
import { StartDateInput, YYYYMM } from "./types/types";

export function isValidYYYYMM(month: string): month is YYYYMM {
  return /^\d{4}-0[1-9]|1[0-2]$/.test(month);
}

/**
 * Generates a unique, URL-safe ID for an item based on its name and current timestamp.
 *
 * @param prefix - The prefix string name to add.
 * @returns A unique ID string prefixed.
 */
export function autogenerateID(prefix: string = "majik"): string {
  // Create the generator function ONCE with your custom alphabet and length
  const generateID = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    8
  );

  // Call the generator function to produce the actual ID string
  const genUID = generateID(); // Example output: 'G7K2aZp9'

  return `${prefix}-${genUID}`;
}
export function isoToYYYYMM(isoDate: string): YYYYMM {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO date");
  }

  // Use UTC to avoid date shifting backwards/forwards based on timezone
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}` as YYYYMM;
}

export function yyyyMMToISO(yyyyMM: YYYYMM): string {
  const [year, month] = yyyyMM.split("-").map(Number);
  // Construct as UTC Midnight
  return new Date(Date.UTC(year, month - 1, 1)).toISOString();
}

export function dateToYYYYMM(date: Date): YYYYMM {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid Date object");
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}` as YYYYMM;
}

export function yyyyMMToDate(yyyyMM: YYYYMM): Date {
  const [year, month] = yyyyMM.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

export function offsetMonthsToYYYYMM(
  input: StartDateInput,
  offsetMonths: number
): YYYYMM {
  const date = normalizeStartDate(input);

  // Since normalizeStartDate now returns a UTC date,
  // we can safely use UTC methods here.
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + offsetMonths;

  const result = new Date(Date.UTC(year, month, 1));

  return dateToYYYYMM(result);
}

export function monthsInPeriod(earlier: YYYYMM, later: YYYYMM): number {
  const start = yyyyMMToDate(earlier);
  const end = yyyyMMToDate(later);

  const startYear = start.getUTCFullYear();
  const startMonth = start.getUTCMonth();

  const endYear = end.getUTCFullYear();
  const endMonth = end.getUTCMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
}

/**
 * Returns an array of YYYYMM strings from start to end (inclusive)
 */
export function monthsArrayInPeriod(start: YYYYMM, end: YYYYMM): YYYYMM[] {
  const months: YYYYMM[] = [];
  let current = start;

  while (current <= end) {
    months.push(current);
    current = offsetMonthsToYYYYMM(current, 1); // increment 1 month
  }

  return months;
}

export function normalizeStartDate(input?: StartDateInput): Date {
  if (!input) {
    const now = new Date();
    // Return UTC version of the first of the current month
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }

  // YYYYMM (e.g. "2025-03")
  if (typeof input === "string" && /^\d{4}-\d{2}$/.test(input)) {
    const [yyyy, mm] = input.split("-").map(Number);
    // FIX: Use Date.UTC instead of new Date(yyyy, mm-1, 1)
    return new Date(Date.UTC(yyyy, mm - 1, 1));
  }

  // ISO string
  if (typeof input === "string") {
    const date = new Date(input);
    if (!isNaN(date.getTime())) {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    }
  }

  // Date instance
  if (input instanceof Date && !isNaN(input.getTime())) {
    return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), 1));
  }

  throw new Error("Invalid startDate format");
}

export const DEFAULT_COLORS: DefaultColors = {
  green: "#d6f500",
  red: "#ed3500",
  blue: "#00339f",
  white: "#f7f7f7",
};

export interface DefaultColors {
  green: string;
  red: string;
  blue: string;
  white: string;
}
