const { app, Menu, shell } = require("electron");
const { helpLinks, VIRTUOSO_BASE } = require("./help");

function createMenu(mainWindow) {
  const isMac = process.platform === "darwin";
  
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "quit" }
      ]
    }] : []),
    
    // AOR Menu
    {
      label: "AOR",
      submenu: [
        { label: "💰 Finance", accelerator: "CmdOrCtrl+1", click: () => execCommand(mainWindow, "/fn") },
        { label: "👔 Leadership", accelerator: "CmdOrCtrl+2", click: () => execCommand(mainWindow, "/ld") },
        { label: "⚙️ Infrastructure", accelerator: "CmdOrCtrl+3", click: () => execCommand(mainWindow, "/sf") },
        { label: "📜 Governance", accelerator: "CmdOrCtrl+4", click: () => execCommand(mainWindow, "/lg") },
        { type: "separator" },
        { label: "📣 Marketing", click: () => execCommand(mainWindow, "/mk") },
        { label: "📋 Management", click: () => execCommand(mainWindow, "/mg") },
        { label: "🤝 Customer", click: () => execCommand(mainWindow, "/cf") }
      ]
    },
    
    // View Menu
    {
      label: "View",
      submenu: [
        { label: "📊 Status", accelerator: "CmdOrCtrl+S", click: () => execCommand(mainWindow, "/status") },
        { label: "🌤️ Weather", click: () => execCommand(mainWindow, "/weather") },
        { label: "🤖 Agents", click: () => execCommand(mainWindow, "/agents") },
        { label: "🚦 Quality Gate", click: () => execCommand(mainWindow, "/gate") },
        { type: "separator" },
        { label: "📋 Decision Queue", click: () => execCommand(mainWindow, "/queue") },
        { type: "separator" },
        { role: "toggleDevTools" },
        { role: "reload" }
      ]
    },
    
    // Demos Menu
    {
      label: "Demos",
      submenu: [
        { label: "🔍 SQL Audit", click: () => execCommand(mainWindow, "/demos sql") },
        { label: "💰 Cost-Cutting", click: () => execCommand(mainWindow, "/demos costs") },
        { label: "👋 Onboarding", click: () => execCommand(mainWindow, "/demos onboard") },
        { type: "separator" },
        { label: "📋 All Demos", accelerator: "CmdOrCtrl+D", click: () => execCommand(mainWindow, "/demos") }
      ]
    },
    
    // Help Menu
    {
      label: "Help",
      submenu: [
        { label: "📚 Commands", click: () => execCommand(mainWindow, "/help") },
        { label: "🦋 About Claudius", click: () => execCommand(mainWindow, "/help claudius") },
        { type: "separator" },
        { label: "📖 Specs", submenu: [
          { label: "Governance RACI", click: () => shell.openExternal(helpLinks["SPEC-001"]) },
          { label: "KLFS Archivist", click: () => shell.openExternal(helpLinks["SPEC-KLFS"]) },
          { label: "Slash Commands", click: () => shell.openExternal(helpLinks["SPEC-SLASH"]) }
        ]},
        { label: "📋 Playbooks", submenu: [
          { label: "Morning Workflow", click: () => shell.openExternal(helpLinks["PLAY-morning"]) },
          { label: "Ingestion Queue", click: () => shell.openExternal(helpLinks["PLAY-ingestion"]) }
        ]},
        { label: "🔧 TTPs", submenu: [
          { label: "AM Archive Flow", click: () => shell.openExternal(helpLinks["TTP-AM-ARCHIVE"]) }
        ]},
        { type: "separator" },
        { label: "📂 Browse All Docs", click: () => shell.openExternal(VIRTUOSO_BASE) },
        { label: "📡 RSS Feed", click: () => shell.openExternal(helpLinks["rss"]) },
        { type: "separator" },
        { label: "🌐 OpenClaw Docs", click: () => shell.openExternal("https://docs.openclaw.ai") },
        { label: "💬 Open Telegram", click: () => shell.openExternal("https://t.me/your_bot") }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function execCommand(mainWindow, command) {
  mainWindow.webContents.send("exec-command", command);
  console.log(`Executing: ${command}`);
}

module.exports = { createMenu };
