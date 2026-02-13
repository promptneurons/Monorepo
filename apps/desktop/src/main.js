const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const os = require("os");
const pty = require("node-pty");
const { createMenu } = require("./menu");

let mainWindow;
let ptyProcess;

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
  
  // Spawn PTY shell
  const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
  ptyProcess = pty.spawn(shell, [], {
    name: "xterm-256color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || process.env.USERPROFILE,
    env: process.env
  });

  // PTY -> Renderer
  ptyProcess.onData((data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("terminal-output", data);
    }
  });

  // Renderer -> PTY
  ipcMain.on("terminal-input", (event, data) => {
    if (ptyProcess) {
      ptyProcess.write(data);
    }
  });

  // Handle resize
  ipcMain.on("terminal-resize", (event, { cols, rows }) => {
    if (ptyProcess) {
      ptyProcess.resize(cols, rows);
    }
  });
  
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
  if (ptyProcess) {
    ptyProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
