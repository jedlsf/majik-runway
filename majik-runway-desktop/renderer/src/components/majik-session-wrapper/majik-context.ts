// MajikContext.ts
import { createContext } from "react";
import type MajikRunwaySession from "../../SDK/majik-runway-session";
import type { MajikRunway } from "@thezelijah/majik-runway";

export interface MajikContextValue {
  majik: MajikRunwaySession | null;
  loading: boolean;
  updateInstance: (updatedInstance: MajikRunwaySession) => void;
  updateRunway: (updatedRunway: MajikRunway) => void;
  clearSession: () => void;
}

export const MajikContext = createContext<MajikContextValue>({
  majik: null,
  loading: true,
  updateInstance: () => {},
  updateRunway: () => {},
  clearSession: () => {},
});
