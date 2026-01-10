"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    ping: () => "pong",
});
electron_1.contextBridge.exposeInMainWorld("electron", {
    importData: () => electron_1.ipcRenderer.invoke("import-data"),
    exportData: (data) => electron_1.ipcRenderer.invoke("export-data", data),
    // Add listeners for menu events
    onImportTriggered: (callback) => {
        electron_1.ipcRenderer.on("trigger-import", callback);
        return () => electron_1.ipcRenderer.removeListener("trigger-import", callback);
    },
    onExportTriggered: (callback) => {
        electron_1.ipcRenderer.on("trigger-export", callback);
        return () => electron_1.ipcRenderer.removeListener("trigger-export", callback);
    },
    onClearTriggered: (callback) => {
        electron_1.ipcRenderer.on("trigger-clear", callback);
        return () => electron_1.ipcRenderer.removeListener("trigger-clear", callback);
    },
});
