const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { createMenu } = require("./menu");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "PN Desktop",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: "hiddenInset",
    backgroundColor: "#1a1a2e"
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  
  // Create menu
  createMenu(mainWindow);
  
  // Handle command execution from menu
  ipcMain.on("command-result", (event, result) => {
    console.log("Command result:", result);
  });
}

app.whenReady().then(() => {
  createWindow();
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
