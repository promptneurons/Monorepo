const { contextBridge, ipcRenderer } = require("electron");

// Real weather fetch (wttr.in - no API key needed)
async function fetchWeather(location = "Kitsap+County") {
  try {
    const response = await fetch(`https://wttr.in/${location}?format=j1`);
    const data = await response.json();
    const current = data.current_condition[0];
    return {
      temp: current.temp_F,
      condition: current.weatherDesc[0].value,
      humidity: current.humidity,
      wind: current.windspeedMiles,
      location: data.nearest_area[0].areaName[0].value
    };
  } catch (err) {
    return { temp: "??", condition: "Error fetching", location, error: err.message };
  }
}

// Command handlers - mix of real and mock
const commands = {
  "/fn": () => ({ type: "dashboard", aor: "finance", data: { cashflow: "+$1,070", status: "ok" }}),
  "/ld": () => ({ type: "dashboard", aor: "leadership", data: { founders: 2, active: 1 }}),
  "/sf": () => ({ type: "dashboard", aor: "infrastructure", data: { systems: "6/8", gate: "pass" }}),
  "/lg": () => ({ type: "dashboard", aor: "governance", data: { incidents: 0, decisions: 1 }}),
  "/mk": () => ({ type: "dashboard", aor: "marketing", data: { campaigns: 0 }}),
  "/mg": () => ({ type: "dashboard", aor: "management", data: { sprints: "26021" }}),
  "/cf": () => ({ type: "dashboard", aor: "customer", data: { leads: 0 }}),
  "/status": () => ({ type: "status", data: { resources: "2 founders", quality: "6/8", cost: "$59/mo" }}),
  "/weather": async () => {
    const weather = await fetchWeather("Kitsap+County+WA");
    return { type: "weather", data: weather, live: true };
  },
  "/agents": () => ({ type: "agents", data: { active: 3, waiting: 0, complete: 12 }}),
  "/gate": () => ({ type: "gate", data: { pass: 6, warn: 2, fail: 0 }}),
  "/queue": () => ({ type: "queue", data: { pending: ["DQ-024"] }}),
  "/demos": () => ({ type: "demos", data: { available: ["sql", "costs", "onboard"] }}),
  "/demos sql": () => ({ type: "demo", name: "sql", steps: 5 }),
  "/demos costs": () => ({ type: "demo", name: "costs", steps: 4 }),
  "/help": () => ({ type: "help", commands: ["/fn", "/status", "/demos", "/agents", "/weather"] })
};

// Listen for commands from menu
ipcRenderer.on("exec-command", async (event, command) => {
  console.log("Received command:", command);
  const handler = commands[command];
  if (handler) {
    const result = await handler();
    window.dispatchEvent(new CustomEvent("pn-command", { detail: { command, result }}));
  }
});

contextBridge.exposeInMainWorld("pn", {
  exec: async (command) => {
    const handler = commands[command];
    return handler ? await handler() : { type: "error", message: "Unknown command" };
  },
  commands: Object.keys(commands),
  version: "0.0.2"
});
