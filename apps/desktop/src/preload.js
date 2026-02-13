const { contextBridge, ipcRenderer } = require("electron");

// Career/Resume data (would come from SPARQL in production)
const careerData = {
  name: "John Goodwin",
  current: "Managing Partner, Prompt Neurons LLC",
  previous: [
    { role: "DevOps Engineer", company: "Microsoft", years: "2018-2022" },
    { role: "Infrastructure Lead", company: "Starbucks", years: "2015-2018", note: "10k VDI deployment" },
    { role: "Systems Architect", company: "Boeing", years: "2010-2015" }
  ],
  skills: ["Azure VDI", "Agentic AI", "NQA-1", "Enterprise Scale"],
  source: "local + SPARQL (hybrid)"
};

async function fetchWeather(location = "Kitsap+County") {
  try {
    const response = await fetch(`https://wttr.in/${location}?format=j1`);
    const data = await response.json();
    const current = data.current_condition[0];
    return { temp: current.temp_F, condition: current.weatherDesc[0].value, humidity: current.humidity, wind: current.windspeedMiles, location: data.nearest_area[0].areaName[0].value };
  } catch (err) { return { temp: "??", condition: "Error", error: err.message }; }
}

async function checkMaltego() {
  try {
    const start = Date.now();
    const response = await fetch("http://45.79.58.143:9001");
    const latency = Date.now() - start;
    const text = await response.text();
    return { status: text.includes("Maltego") ? "online" : "unknown", latency: `${latency}ms`, url: "http://45.79.58.143:9001" };
  } catch (err) { return { status: "offline", error: err.message }; }
}

async function checkVirtuoso() {
  try {
    const start = Date.now();
    const response = await fetch("http://45.79.58.143:8890/sparql?query=SELECT+1&format=json", { signal: AbortSignal.timeout(5000) });
    const latency = Date.now() - start;
    return { status: "online", latency: `${latency}ms`, url: "http://45.79.58.143:8890" };
  } catch (err) { return { status: "timeout/offline", error: err.message }; }
}

const commands = {
  "/fn": () => ({ type: "dashboard", aor: "finance", data: { cashflow: "+$1,070", status: "ok" }}),
  "/ld": () => ({ type: "dashboard", aor: "leadership", data: { founders: 2, active: 1 }}),
  "/sf": () => ({ type: "dashboard", aor: "infrastructure", data: { systems: "6/8", gate: "pass" }}),
  "/lg": () => ({ type: "dashboard", aor: "governance", data: { incidents: 0, decisions: 1 }}),
  "/mk": () => ({ type: "dashboard", aor: "marketing", data: { campaigns: 0 }}),
  "/mg": () => ({ type: "dashboard", aor: "management", data: { sprints: "26021" }}),
  "/cf": () => ({ type: "dashboard", aor: "customer", data: { leads: 0 }}),
  "/status": () => ({ type: "status", data: { resources: "2 founders", quality: "6/8", cost: "$59/mo" }}),
  "/weather": async () => ({ type: "weather", data: await fetchWeather("Kitsap+County+WA"), live: true }),
  "/maltego": async () => ({ type: "maltego", data: await checkMaltego(), live: true }),
  "/sparql": async () => ({ type: "sparql", data: await checkVirtuoso(), live: true }),
  "/resume": () => ({ type: "resume", data: careerData, live: true, note: "CoWork cant do this - sandbox blocks local+remote access" }),
  "/agents": () => ({ type: "agents", data: { active: 3, waiting: 0, complete: 12 }}),
  "/gate": () => ({ type: "gate", data: { pass: 6, warn: 2, fail: 0 }}),
  "/queue": () => ({ type: "queue", data: { pending: ["DQ-024"] }}),
  "/demos": () => ({ type: "demos", data: { available: ["sql", "costs", "maltego", "resume"] }}),
  "/demos sql": () => ({ type: "demo", name: "sql", steps: 5 }),
  "/demos costs": () => ({ type: "demo", name: "costs", steps: 4 }),
  "/demos maltego": async () => ({ type: "demo", name: "maltego", maltego: await checkMaltego(), sparql: await checkVirtuoso() }),
  "/demos resume": () => ({ type: "demo", name: "resume", data: careerData }),
  "/help": () => ({ type: "help", commands: ["/fn", "/status", "/weather", "/maltego", "/sparql", "/resume"] })
};

ipcRenderer.on("exec-command", async (event, command) => {
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
  version: "0.0.4"
});
