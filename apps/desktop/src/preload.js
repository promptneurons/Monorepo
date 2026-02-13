const { contextBridge, ipcRenderer } = require("electron");

// Real weather fetch
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
    return { temp: "??", condition: "Error", location, error: err.message };
  }
}

// Maltego TRX server check (GREEN)
async function checkMaltego() {
  const MALTEGO_URL = "http://45.79.58.143:9001";
  try {
    const start = Date.now();
    const response = await fetch(MALTEGO_URL, { method: "GET" });
    const latency = Date.now() - start;
    const text = await response.text();
    const isUp = text.includes("Maltego Transform Server");
    return {
      status: isUp ? "online" : "unknown",
      url: MALTEGO_URL,
      latency: `${latency}ms`,
      message: isUp ? "Transform server ready" : text.substring(0, 50)
    };
  } catch (err) {
    return { status: "offline", url: MALTEGO_URL, error: err.message };
  }
}

// Virtuoso SPARQL check (GREEN)
async function checkVirtuoso() {
  const SPARQL_URL = "http://45.79.58.143:8890/sparql";
  try {
    const start = Date.now();
    const query = encodeURIComponent("SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o }");
    const response = await fetch(`${SPARQL_URL}?query=${query}&format=json`);
    const latency = Date.now() - start;
    const data = await response.json();
    const count = data.results?.bindings[0]?.count?.value || "?";
    return {
      status: "online",
      url: SPARQL_URL,
      latency: `${latency}ms`,
      triples: count
    };
  } catch (err) {
    return { status: "offline", url: SPARQL_URL, error: err.message };
  }
}

// Command handlers
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
  "/maltego": async () => {
    const result = await checkMaltego();
    return { type: "maltego", data: result, live: true };
  },
  "/sparql": async () => {
    const result = await checkVirtuoso();
    return { type: "sparql", data: result, live: true };
  },
  "/agents": () => ({ type: "agents", data: { active: 3, waiting: 0, complete: 12 }}),
  "/gate": () => ({ type: "gate", data: { pass: 6, warn: 2, fail: 0 }}),
  "/queue": () => ({ type: "queue", data: { pending: ["DQ-024"] }}),
  "/demos": () => ({ type: "demos", data: { available: ["sql", "costs", "onboard", "maltego"] }}),
  "/demos sql": () => ({ type: "demo", name: "sql", steps: 5 }),
  "/demos costs": () => ({ type: "demo", name: "costs", steps: 4 }),
  "/demos maltego": async () => {
    const maltego = await checkMaltego();
    const sparql = await checkVirtuoso();
    return { type: "demo", name: "maltego", maltego, sparql };
  },
  "/help": () => ({ type: "help", commands: ["/fn", "/status", "/weather", "/maltego", "/sparql"] })
};

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
  version: "0.0.3"
});
