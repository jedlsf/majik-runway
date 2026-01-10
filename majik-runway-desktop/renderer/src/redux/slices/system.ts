import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Redux state type
export interface SystemState {
  darkMode: boolean;
  scannerMode: boolean;
}

// Redux state types
export interface ReduxSystemRootState {
  system: {
    darkMode: boolean;
    scannerMode: boolean;
  };
}

const initialState: SystemState = {
  darkMode: false,
  scannerMode: false,
};

const system = createSlice({
  name: "system",
  initialState,
  reducers: {
    toggleTheme: (state, action: PayloadAction<boolean | undefined>) => {
      state.darkMode =
        action.payload !== undefined ? action.payload : !state.darkMode;
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(state.darkMode)); // persist to localStorage
      }
      // console.log("New Theme Dark Mode Saved: ", action.payload);
    },
    toggleScannerMode: (state, action: PayloadAction<boolean | undefined>) => {
      state.scannerMode =
        action.payload !== undefined ? action.payload : !state.scannerMode;
      if (typeof window !== "undefined") {
        localStorage.setItem("scannerMode", JSON.stringify(state.scannerMode)); // persist to localStorage
      }
      // console.log("New Scanner Mode Saved: ", action.payload);
    },
  },
});

export const { toggleTheme, toggleScannerMode } = system.actions;
export default system.reducer;
