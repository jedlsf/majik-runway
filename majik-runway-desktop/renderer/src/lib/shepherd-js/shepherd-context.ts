// MajikContext.ts
import { createContext } from "react";
import type { Tour } from "shepherd.js";

export const ShepherdFactoryContext = createContext<() => Tour>(() => {
  throw new Error("ShepherdProvider missing");
});
