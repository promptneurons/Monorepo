# PN Desktop Prototype

**Epic**: PN Desktop - ElectronJS app to compete/cooperate with Anthropic CoWork
**Timeline**: Sprint 26021-26022 (Feb 13 - Mar 2, 17 days)
**Goal**: Demonstrate 18-day BPRE from ourselves → OpenClaw + Agent Flywheel

## Strategic Context

From [kitsaplabs.com/index.txt](https://kitsaplabs.com/index.txt):
- CoWork tech preview launched Feb 10
- Anthropic full launch = our window
- Core differentiator: No spinning cursors — agent swarms manage LLM calls in parallel
- "Make Humans the Bottleneck Again"

## Two Demos

### 1. e-wall (Weather)
- **Purpose**: Visual "wow" for FrankenTUI
- **Tech**: FrankenTUI/web + OpenClaw weather skill
- **Status**: To be created

### 2. Company Terminal ("Run a Company")
- **Purpose**: Business process orchestration demo
- **Tech**: Based on `dashboard.rs` from ftui-demo-showcase
- **Status**: Exists in Rust, needs WASM port

## Architecture

```
┌─────────────────────────────────────────┐
│           PN Desktop (Electron)          │
│  ┌─────────────────────────────────────┐│
│  │         WebView (FrankenTUI/web)    ││
│  │  ┌─────────┐  ┌──────────────────┐  ││
│  │  │ e-wall  │  │ Company Terminal │  ││
│  │  │(weather)│  │   (dashboard)    │  ││
│  │  └─────────┘  └──────────────────┘  ││
│  └─────────────────────────────────────┘│
│                    │                     │
│              [Gateway Client]            │
└────────────────────┼─────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼────┐            ┌──────▼──────┐
   │ OpenClaw │◄── NATS ──►│Agent Flywheel│
   │ Gateway  │            │   (vNext)    │
   └──────────┘            └──────────────┘
```

## Tech Stack

- **Shell**: Electron Forge (ElectronJS)
- **WebView**: FrankenTUI/web (Rust → WASM)
- **Monorepo**: promptneurons/Monorepo (Rush, pnpm/bun)
- **Backend**: OpenClaw gateway + NATS (architecture TBD)

## Sprint Plan

### Week 1 (Feb 13-19) - Sprint 26021
- [ ] Scaffold Monorepo with Rush/pnpm
- [ ] Create `apps/desktop/` - Electron Forge minimal shell
- [ ] Verify FrankenTUI/web WASM build works
- [ ] Port dashboard.rs to web (or verify existing)
- [ ] Integrate WebView into Electron

### Week 2 (Feb 20-26) - Sprint 26022  
- [ ] Create e-wall weather demo
- [ ] Wire OpenClaw gateway client (basic)
- [ ] Add agent status panel (no spinning cursor!)
- [ ] NATS integration spike

### Days 15-17 (Feb 27 - Mar 2)
- [ ] Agent Flywheel wiring
- [ ] Polish and integration testing
- [ ] Demo recording

## Repos

| Repo | Purpose |
|------|---------|
| promptneurons/Monorepo | PN Desktop app (Electron + packages) |
| Dicklesworthstone/frankentui | FrankenTUI source (upstream) |
| beads-for-frankentui | Web viewer components |

## Key Files

- `/home/john/frankentui/` - FrankenTUI source
- `/home/john/Monorepo/` - PN monorepo (fresh)
- `/home/john/beads-for-frankentui/` - Web components
- `https://frankentui.com/web` - Live WASM demo

## Open Questions

1. Does dashboard.rs already compile to WASM target?
2. NATS topology for OpenClaw ↔ Agent Flywheel cooperation?
3. CoWork API surface for cooperation (not just competition)?

## Success Criteria

- [ ] Electron app launches with FrankenTUI WebView
- [ ] e-wall displays live weather data
- [ ] Company terminal shows business process visualization
- [ ] Agent swarm status visible (not spinning cursor)
- [ ] OpenClaw gateway connected

---

*Created: 2026-02-13 (Sprint 26021 Day 2)*
*Target: 2026-03-02 (17 days)*
