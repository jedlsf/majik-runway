// useMajik.ts
import { useContext } from "react";
import { MajikContext } from "./majik-context";

export const useMajik = () => useContext(MajikContext);
