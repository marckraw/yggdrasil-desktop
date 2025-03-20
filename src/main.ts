import { app, BrowserWindow, globalShortcut, ipcMain, shell } from "electron";
import path from "path";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Register IPC handlers before creating the window
ipcMain.handle("open-external-url", async (_event, url) => {
  try {
    await shell.openExternal(url);
  } catch (error) {
    console.error("Failed to open external URL:", error);
    throw error;
  }
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    title: "Yggdrasil Desktop",
    fullscreenable: true,
    resizable: true,
    minWidth: 800,
    minHeight: 600,
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Register global shortcut
  globalShortcut.register("CommandOrControl+Shift+X", () => {
    // Get selected text from clipboard
    const selectedText = require("electron").clipboard.readText();

    // Send the selected text to your renderer process
    mainWindow.webContents.send("selected-text", selectedText);

    // Bring window to front
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Unregister all shortcuts when app is about to quit
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
