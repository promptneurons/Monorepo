const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Terminal PTY
  sendTerminalInput: (data) => ipcRenderer.send("terminal-input", data),
  onTerminalOutput: (callback) => ipcRenderer.on("terminal-output", (event, data) => callback(data)),
  resizeTerminal: (cols, rows) => ipcRenderer.send("terminal-resize", { cols, rows }),
  
  // Commands
  executeCommand: (command) => ipcRenderer.send("execute-command", command),
  onCommandResult: (callback) => ipcRenderer.on("command-result", (event, result) => callback(result))
});
