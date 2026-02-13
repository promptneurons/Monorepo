const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pn', {
  // Weather API bridge (will connect to OpenClaw weather skill)
  getWeather: async (location) => {
    // Placeholder - will connect to OpenClaw gateway
    return { temp: 42, condition: 'Partly Cloudy', location };
  },
  // Agent status bridge
  getAgentStatus: async () => {
    // Placeholder - will show swarm status
    return { active: 3, waiting: 0, complete: 12 };
  },
  version: '0.0.1'
});
