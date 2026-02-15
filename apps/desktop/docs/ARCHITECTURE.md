# PN Desktop Architecture & Patterns

**Created**: 2026-02-13 (Sprint 26021)
**Status**: Active Development

## Strategic Context

### Market Position
- **Target**: Claude Code users, DevOps, SMB
- **Timing**: Draft on Anthropic CoWork launch (Feb 10 tech preview)
- **Differentiator**: No spinning cursors — agent swarms manage LLM calls in parallel

### Taglines
1. "Tired of waiting for Claude Coworker?"
2. "We don't browse the web. We browse your organization's capabilities."
3. "NO SPINNING CURSOR"
4. "Make Humans the Bottleneck Again"

### Strategic Patterns
- **Blitzkrieg**: Own the field before LLM hoarders see us coming
- **Motte & Bailey**: Build the fortress (OPR) while they fight over the bailey (UX)
- **Draft Strategy**: Let Anthropic educate market, capture frustrated customers
- **18-day BPRE**: Products at agentic speed

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      PN Desktop (Electron)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Menu Bar                           │   │
│  │  [AOR] [View] [Demos] [Help→Virtuoso]                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─────────────┐  ┌────────────────────────────────────┐   │
│  │  Sidebar    │  │         Main Display               │   │
│  │  ├─Weather  │  │  ┌──────────────────────────────┐  │   │
│  │  └─Commands │  │  │     Terminal / Dashboard     │  │   │
│  └─────────────┘  │  └──────────────────────────────┘  │   │
│                   └────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Footer: Agent Status | NO SPINNING CURSOR           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────────┐
        │ OpenClaw │   │  NATS    │   │Agent Flywheel│
        │ Gateway  │◄──┤  (TBD)   ├──►│   (vNext)    │
        └──────────┘   └──────────┘   └──────────────┘
```

## Two-Window World

| Window | Purpose |
|--------|---------|
| **PN Desktop** | Work happens here (GUI + terminal + embedded browser) |
| **Telegram** | Communication + agent interface |

**What dies**: Browser tabs, standalone Chrome, VS Code (eventually)

## Unified Command Grammar (SPEC-SLASH-HARMONY)

### Three Surfaces, One Language
```
┌─────────────────────────────────────┐
│       /status  /fn  /demos          │
│    (one grammar, three surfaces)    │
└────────────┬────────────────────────┘
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
┌──────┐  ┌──────┐  ┌──────┐
│ Menu │  │ λ >  │  │ Chat │
│Click │  │Type  │  │ Tap  │
└──────┘  └──────┘  └──────┘
  PN        Term     Telegram
```

### Command Taxonomy

| Category | Commands |
|----------|----------|
| **AOR** | `/fn` `/ld` `/sf` `/lg` `/mk` `/mg` `/cf` |
| **View** | `/status` `/weather` `/agents` `/gate` `/queue` |
| **Demos** | `/demos` `/demos sql` `/demos costs` |
| **Help** | `/help` `/help <topic>` |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Shell | Electron Forge (Chromium) |
| Build | pnpm workspaces |
| UI | HTML/CSS (FrankenTUI/web future) |
| Help | Virtuoso WebDAV (shim) |
| Backend | OpenClaw Gateway (future) |
| Messaging | NATS (future) |
| Orchestration | Agent Flywheel (future) |

## File Structure

```
promptneurons/Monorepo/
├── pnpm-workspace.yaml
├── package.json
└── apps/
    └── desktop/
        ├── package.json
        ├── forge.config.js
        └── src/
            ├── main.js      # Electron main process
            ├── menu.js      # Menu bar (mirrors commands)
            ├── help.js      # Virtuoso links
            ├── preload.js   # Command handlers
            └── index.html   # UI
```

## Patterns

### 1. Capability Browser Pattern
- Not a web browser
- Browse organization capabilities, not websites
- Every view is a capability query

### 2. Command Harmony Pattern
- Define command once
- Expose in menu, terminal, and chat
- Same `/status` everywhere

### 3. Help Shim Pattern
- Help files in Virtuoso WebDAV
- Links open in browser (external)
- Migrate to in-app rendering later

### 4. Dogfood Loop Pattern
```
We use it → We improve it → We demo it → We use it
```
- Daily demo to ourselves
- Our needs = customer needs
- Product is experimental tool

### 5. Two-Platform Validation
- Windows laptop (John) → DevOps/Enterprise path
- Mac (Cara) → Creative/SMB path
- Same Electron app, both markets tested

### 6. Agent Status Pattern
- Always visible: active/waiting/complete
- NO SPINNING CURSOR badge
- Proves the swarm is working

## Integration Points

### OpenClaw Gateway (Future)
```javascript
// preload.js - will connect to gateway
contextBridge.exposeInMainWorld("pn", {
  exec: async (command) => {
    // Currently: local handlers
    // Future: gateway.send(command)
  }
});
```

### Telegram Parity
```
User: /status
Bot: [inline keyboard]
     [📊 Details] [🔄 Refresh]
```
Same commands, visual buttons for discovery.

### Virtuoso WebDAV
- Base: `http://66.228.53.216:8890/DAV/home/index/`
- RSS: `?a=rss`
- Specs, Playbooks, TTPs synced from clawd

## Success Metrics

| Metric | Target |
|--------|--------|
| Daily demo completed | Every day |
| Workers on 2 windows | 100% |
| Commands work all surfaces | 100% |
| No spinning cursor | Always |

## Roadmap

### Week 1 (Sprint 26021)
- [x] Electron scaffold
- [x] Menu bar with commands
- [x] Help links to Virtuoso
- [ ] Wire real weather data
- [ ] FrankenTUI/web integration

### Week 2 (Sprint 26022)
- [ ] OpenClaw gateway connection
- [ ] Agent status from real swarm
- [ ] NATS integration spike
- [ ] Emanuel pitch demo

### Days 15-17
- [ ] Full Agent Flywheel wiring
- [ ] Polish
- [ ] Demo recording

---

## Key Decisions Log

| Decision | Rationale |
|----------|-----------|
| Electron over Tauri | Faster to ship, Chromium for WebView |
| pnpm over Rush | Simpler, Windows-compatible |
| Virtuoso help shim | Docs already synced, refine UX later |
| Command harmony | One grammar, three surfaces |
| Two-window world | Focus, no browser tab sprawl |

---
*Architecture: PN Desktop | Sprint: 26021-26022 | Owner: Claudius* 🦋

## Enterprise Scaling Path

### Founder Experience (SBUX)
- **Gig 1**: Virtualized PC image for 10,000 retail stores
- **Gig 2**: Azure VDI (Virtual Desktop Infrastructure)

### Scaling Pattern
```
PN Desktop (Electron)
      ↓
Package as master image
      ↓
Azure Virtual Desktop / Windows 365
      ↓
Enterprise deployment (10k+ seats)
```

### Why This Works
- Electron app = consistent image
- Azure VDI = proven enterprise scale
- Franchise network = distribution
- One image, infinite seats

### Enterprise GTM
1. SMB proves product (local Electron install)
2. Enterprise wants scale → VDI option
3. Deploy via Azure marketplace or image
4. Same app, enterprise infrastructure

*"We've done this before. At Starbucks."*
