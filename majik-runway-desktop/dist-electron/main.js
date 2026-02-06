"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const fs_1 = require("fs");
const isDev = !electron_1.app.isPackaged;
let mainWindow = null;
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
        },
        icon: path_1.default.join(__dirname, "assets/Logo_MajikRunway_64px.png"),
    });
    mainWindow = win; // ✅ ADD THIS - Assign to mainWindow so menu can reference it
    // ----------------------------
    // CSP and Security Headers
    // ----------------------------
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        const defaultSrc = [
            "'self'",
            "https://accounts.google.com",
            "https://connect.facebook.net",
            "https://www.facebook.com",
        ];
        const workerSrc = ["'self'", "blob:"];
        const fontSrc = [
            "'self'",
            "https://fonts.googleapis.com",
            "https://fonts.gstatic.com",
            "https://cdn.jsdelivr.net/npm/",
            "https://client.crisp.chat",
        ];
        const imgSrc = [
            "'self'",
            "blob:",
            "data:",
            `https://${constants_1.SUPABASE_DOMAIN_URL}`,
            "https://cdn.hashnode.com",
            "https://lh3.googleusercontent.com",
            "https://www.facebook.com",
            "https://i.ytimg.com",
            "https://i.scdn.co",
            "https://a1.sndcdn.com",
            "https://i.pinimg.com",
            "https://sketchfab.com",
            "https://*.sketchfab.com",
            "https://*.google.com",
            "https://www.googletagmanager.com",
            "https://cdn.ywxi.net",
            "https://www.trustedsite.com",
            "https://*.crisp.chat",
            "https://crisp.chat",
            "https://b.sf-syn.com",
            "https://*.trustpilot.com",
        ];
        const scriptSrc = [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://cdn.lgrckt-in.com",
            "https://www.googletagmanager.com",
            "https://accounts.google.com",
            "https://cdn.jsdelivr.net/npm/",
            "https://connect.facebook.net",
            "https://www.youtube.com",
            "https://www.youtube-nocookie.com",
            "https://s.ytimg.com",
            "https://open.spotify.com",
            "https://sketchfab.com",
            "https://*.sketchfab.com",
            "https://cdn.ywxi.net",
            "https://www.trustedsite.com",
            "https://client.crisp.chat",
            "https://b.sf-syn.com",
            "https://*.trustpilot.com",
        ];
        const styleSrc = [
            "'self'",
            "'unsafe-inline'",
            "https://accounts.google.com/gsi/style",
            "https://fonts.googleapis.com",
            "https://fonts.gstatic.com",
            "https://cdn.jsdelivr.net/npm/",
            "https://client.crisp.chat",
        ];
        const connectSrc = [
            "'self'",
            "blob:",
            "data:",
            `https://${constants_1.SUPABASE_DOMAIN_URL}`,
            "https://www.googleapis.com",
            "https://accounts.google.com",
            "https://www.google-analytics.com",
            "https://graph.facebook.com",
            "https://www.youtube.com",
            "https://www.youtube-nocookie.com",
            "https://yt3.ggpht.com",
            "https://open.spotify.com",
            "https://majikah.solutions",
            "https://www.majikah.solutions",
            "https://dev-test.majikah.solutions",
            "https://o4509590888710144.ingest.us.sentry.io",
            "https://r.lgrckt-in.com",
            "https://sketchfab.com",
            "https://*.sketchfab.com",
            "https://s3-us-west-2.amazonaws.com",
            "https://cdn.ywxi.net",
            "https://www.trustedsite.com",
            "https://client.relay.crisp.chat",
            "wss://client.relay.crisp.chat",
            "https://client.crisp.chat",
            "https://*.trustpilot.com",
        ];
        const childSrc = [
            "'self'",
            "blob:",
            "https://www.youtube.com",
            "https://www.youtube-nocookie.com",
            "https://open.spotify.com",
            "https://*.google.com",
        ];
        const mediaSrc = [
            "'self'",
            "blob:",
            "https://www.youtube.com",
            "https://www.youtube-nocookie.com",
            "https://open.spotify.com",
            "https://sketchfab.com",
            "https://*.sketchfab.com",
            "https://*.google.com",
        ];
        const frameSrc = [
            "'self'",
            "blob:",
            "https://www.youtube.com",
            "https://www.youtube-nocookie.com",
            "https://open.spotify.com",
            "https://accounts.google.com",
            "https://sketchfab.com",
            "https://*.sketchfab.com",
            "https://*.google.com",
            "https://www.trustedsite.com",
        ];
        const csp = [
            `default-src ${defaultSrc.join(" ")}`,
            `worker-src ${workerSrc.join(" ")}`,
            `font-src ${fontSrc.join(" ")}`,
            `img-src ${imgSrc.join(" ")}`,
            `script-src ${scriptSrc.join(" ")}`,
            `style-src ${styleSrc.join(" ")}`,
            `connect-src ${connectSrc.join(" ")}`,
            `child-src ${childSrc.join(" ")}`,
            `media-src ${mediaSrc.join(" ")}`,
            `frame-ancestors 'none'`,
            `frame-src ${frameSrc.join(" ")}`,
            `object-src 'none'`,
            `base-uri 'self'`,
            `upgrade-insecure-requests`,
            `block-all-mixed-content`,
        ].join("; ");
        const headers = {
            ...details.responseHeaders,
            "Content-Security-Policy": [csp.replace(/\n/g, "")],
            "Strict-Transport-Security": [
                "max-age=31536000; includeSubDomains; preload",
            ],
            "X-Frame-Options": ["SAMEORIGIN"],
            "X-Content-Type-Options": ["nosniff"],
            "Referrer-Policy": ["strict-origin-when-cross-origin"],
            "Permissions-Policy": ["geolocation=(), microphone=(), camera=()"],
            "X-Powered-By": [""],
            Server: [""],
        };
        callback({ responseHeaders: headers });
    });
    if (isDev) {
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    }
    else {
        // Production or testing production build locally
        let indexPath;
        if (electron_1.app.getAppPath().includes("app.asar")) {
            // Packaged installer
            indexPath = path_1.default.join(electron_1.app.getAppPath(), "renderer/dist/index.html");
        }
        else {
            // Local production build test
            indexPath = path_1.default.join(electron_1.app.getAppPath(), "../renderer/dist/index.html");
        }
        console.log("Loading from:", indexPath); // Debug log
        win.loadFile(indexPath);
    }
    createMenu(); // Call createMenu after window is created
}
function createMenu() {
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "Import",
                    accelerator: "CmdOrCtrl+O",
                    click: () => {
                        mainWindow?.webContents.send("trigger-import");
                    },
                },
                {
                    label: "Export",
                    accelerator: "CmdOrCtrl+S",
                    click: () => {
                        mainWindow?.webContents.send("trigger-export");
                    },
                },
                { type: "separator" },
                {
                    label: "Clear Session",
                    accelerator: "CmdOrCtrl+Q",
                    click: () => {
                        mainWindow?.webContents.send("trigger-clear");
                    },
                },
                { type: "separator" },
                {
                    label: "Exit",
                    click: () => electron_1.app.quit(),
                },
            ],
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "About Majik Runway",
                    click: () => {
                        electron_1.dialog
                            .showMessageBox({
                            type: "info",
                            title: "About Majik Runway Desktop",
                            message: "Majik Runway",
                            detail: "Version 1.0.1\n\nDeveloped by Zelijah\nhttps://thezelijah.world\n\n© 2026 All rights reserved.",
                            buttons: ["OK", "Visit Website"],
                        })
                            .then((result) => {
                            if (result.response === 1) {
                                electron_1.shell.openExternal("https://thezelijah.world");
                            }
                        });
                    },
                },
                {
                    label: "Docs",
                    click: async () => {
                        await electron_1.shell.openExternal("https://thezelijah.world/tools/finance-majik-runway");
                    },
                },
                {
                    label: "Developer",
                    click: async () => {
                        await electron_1.shell.openExternal("https://thezelijah.world/about");
                    },
                },
                { type: "separator" },
                {
                    label: "Report an Issue",
                    click: async () => {
                        await electron_1.shell.openExternal("https://github.com/jedlsf/majik-runway/issues");
                    },
                },
            ],
        },
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
// ----------------------------
// IPC Handlers
// ----------------------------
electron_1.ipcMain.handle("import-data", async () => {
    const { canceled, filePaths } = await electron_1.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Majik Runway Files", extensions: ["mjkb"] }],
    });
    if (!canceled && filePaths.length > 0) {
        // Read the file as a base64 string (since .mjkb is already base64 encoded)
        const base64Content = await fs_1.promises.readFile(filePaths[0], "utf-8");
        // Return the base64 string - the renderer will handle decryption
        return { base64Content, fileName: path_1.default.basename(filePaths[0]) };
    }
    return null;
});
electron_1.ipcMain.handle("export-data", async (event, { base64Content, fileName }) => {
    const { canceled, filePath } = await electron_1.dialog.showSaveDialog({
        defaultPath: fileName || "Majik Runway.mjkb",
        filters: [{ name: "Majik Runway Files", extensions: ["mjkb"] }],
    });
    if (!canceled && filePath) {
        // Write the base64 string directly to file
        await fs_1.promises.writeFile(filePath, base64Content, "utf-8");
        return true;
    }
    return false;
});
if (process.platform === "win32") {
    electron_1.app.setAppUserModelId("com.majik.runway");
}
electron_1.app.whenReady().then(createWindow);
