// globals.d.ts

// Global window extensions
export {};

export interface ElectronAPI {
  importData: () => Promise<{ base64Content: string; fileName: string } | null>;
  exportData: (data: {
    base64Content: string;
    fileName: string;
  }) => Promise<boolean>;
  onImportTriggered: (callback: () => void) => () => void;
  onExportTriggered: (callback: () => void) => () => void;
  onClearTriggered: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }

  interface Window {
    PinUtils?: {
      build: () => void;
    };
  }

  interface Window {
    electron: ElectronAPI;
  }
}

// Audio modules
declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}

// CSS modules (for Swiper, etc.)
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
