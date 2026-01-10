import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  ping: () => "pong",
});

contextBridge.exposeInMainWorld("electron", {
  importData: () => ipcRenderer.invoke("import-data"),
  exportData: (data: any) => ipcRenderer.invoke("export-data", data),
  // Add listeners for menu events
  onImportTriggered: (callback: any) => {
    ipcRenderer.on("trigger-import", callback);
    return () => ipcRenderer.removeListener("trigger-import", callback);
  },
  onExportTriggered: (callback: any) => {
    ipcRenderer.on("trigger-export", callback);
    return () => ipcRenderer.removeListener("trigger-export", callback);
  },
  onClearTriggered: (callback: any) => {
    ipcRenderer.on("trigger-clear", callback);
    return () => ipcRenderer.removeListener("trigger-clear", callback);
  },
});
