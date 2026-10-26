# eee-Simulator — Electro Panel

A browser-based **electrical panel designer and control-circuit simulator**. Drag real-world
low-voltage components onto a canvas, wire them terminal-to-terminal, then press **Run** and
interact with the panel: hold pushbuttons, trip overloads, toggle selectors, cycle water levels —
and watch the solver energize coils, seal in contactors, switch star→delta on a timer, and spin motors.

Bilingual throughout (**English / العربية**), with photographed-style realistic skins for panels,
contactors, relays and motors.

---

## Quick start

```bash
npm install     # install dependencies
npm run dev     # start the Vite dev server (http://localhost:5173)
```

Other scripts:

| Script              | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Dev server with HMR, bound to `0.0.0.0:5173`                    |
| `npm run build`     | Production build to `dist/` (single self-contained HTML file)   |
| `npm run preview`   | Serve the production build on `0.0.0.0:4173`                    |
| `npm run typecheck` | `tsc --noEmit` — strict type check, no emit                     |

Node 20+ recommended (CI runs 20.x and 22.x).

---

## Tech stack

- **React 19** + **TypeScript 5.9** (strict, `noUnusedLocals`, `noUnusedParameters`)
- **Vite 7** with `vite-plugin-singlefile` — the production build inlines JS + CSS into one `dist/index.html`
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **lucide-react** icons; all component artwork is hand-authored inline SVG

---

## Project layout

```
.
├── index.html                     # Vite entry, loads /src/main.tsx
├── vite.config.ts                 # react + tailwind + singlefile; dev/preview host config
├── tsconfig.json                  # strict; "@/*" → "src/*"
└── src/
    ├── main.tsx                   # createRoot(<App />) in StrictMode
    ├── App.tsx                    # top-level state, persistence, undo/redo, run loop, toasts
    ├── index.css                  # Tailwind entry + CSS custom properties (theme tokens)
    ├── components/
    │   ├── Canvas.tsx             # pan/zoom canvas, drag-drop, selection, wire drawing, interaction
    │   ├── Sidebar.tsx            # searchable parts library, grouped by section
    │   ├── Toolbar.tsx            # run/stop, undo/redo, fit, theme, save, new, export, edit mode
    │   ├── PropertiesPanel.tsx    # per-part properties (label, color, skin, size)
    │   ├── StepsPanel.tsx         # guided tutorial steps for the active example
    │   ├── ExamplesModal.tsx      # example circuit picker
    │   ├── CableLayer.tsx         # duct/trunking rendering beneath wires
    │   ├── Icons.tsx              # <GlyphDefs> — schematic SVG symbol library
    │   ├── IconsExtra.tsx         # additional glyphs
    │   ├── RealisticPower.tsx     # photographic-style sources, breakers, transformers
    │   ├── RealisticRelays.tsx    # contactors, relays, timers, overloads
    │   ├── RealisticControls.tsx  # pushbuttons, selectors, pilot devices
    │   ├── RealisticEquipment.tsx # motors, pumps, panels, enclosures
    │   ├── StarDeltaArtwork.tsx   # star-delta starter artwork + layout
    │   ├── FloatlessLevel.tsx     # floatless (electrode) level relay artwork
    │   ├── SensorHardware.tsx     # sensor bodies and their contact blocks
    │   └── hardware/Primitives.tsx# shared SVG primitives for realistic skins
    ├── data/
    │   ├── catalog.ts             # SECTIONS: 182 parts across 11 categories (EN + AR labels)
    │   ├── terminals.ts           # TERMINALS map, port geometry, termPos()/itemRect()
    │   ├── floatless.ts           # floatless relay ports + WATER_STAGES cycling
    │   ├── sensorContacts.ts      # COM/NO/NC sensor contact normalization
    │   └── starDeltaLayout.ts     # star-delta starter placement constants
    ├── engine/
    │   ├── solver.ts              # the simulation kernel (see below)
    │   └── examples.ts            # 14 built-in example circuits with guided steps
    └── utils/
        ├── wireRouting.ts         # orthogonal routing, wire length, midpoint helpers
        ├── exportPng.tsx          # canvas → PNG export
        ├── partSizing.ts          # canvas sizing for parts
        └── cn.ts                  # clsx + tailwind-merge helper
```

---

## How the simulation works

`src/engine/solver.ts` is the kernel. It treats the design as a **graph of terminals connected by
wires** and propagates electrical potentials:

- **Potential bits** — each node carries a bitmask of what it is energized with:
  `L1`, `L2`, `L3`, `NN` (neutral), `PE` (earth), `P24`, `Z24` (24 V DC rails).
- **Inputs** — the live user state: `pressed` (momentary buttons held), `off` (breakers opened /
  NC contacts), `on` (selectors closed / NO sensors), `latched` (e-stop), `tripped` (overloads),
  and `levels` (floatless water stage per device).
- **Interaction kinds** — `INTERACT` maps each part id to how a click behaves:
  `moment`, `latch`, `toggleOn`, `toggleOff`, `trip`, `cycleLevel`, `probe`.
- **Timers** — a `TimerEnv` tracks on-delay/off-delay state so star→delta changeover happens
  after the configured delay while the run loop ticks.
- **Output** — a `SolveResult` of hot nodes, energized items, and animated current paths, which
  `Canvas.tsx` renders (sky-blue current flow, spinning motors, lit pilots, pulled-in contactors).

Terminals come from `data/terminals.ts`, which defines each part's ports, their side
(`top`/`bottom`/`left`/`right`) and their position within the part's box; `wireRouting.ts` turns a
pair of ports into an orthogonal polyline.

---

## Built-in examples

Open **Examples** in the toolbar. Each ships with guided steps (checked live against the solver
state) in both English and Arabic:

1. Three Phase Star Delta Starter *(loads by default on first launch)*
2. Distribution Box
3. DOL Direct Starter
4. Automatic Water Pump
5. Forward / Reverse
6. Automatic Star-Delta
7. Timer-Delayed Lamp
8. Push-to-Light
9. Start from Two Places
10. Water Level Control
11. Over-Temperature Alarm
12. Source / Generator Changeover
13. Floatless Pump Control
14. COM / NC / NO Sensor Test

---

## Parts library

**182 parts** across 11 sections (labels in English and Arabic):

| Section | Parts | Contents |
| --- | --- | --- |
| Sources | 15 | generator (+ photo skin), 3Φ / 1Φ / 110 V AC / DC sources, neutral N, earth PE, solar PV array, solar inverter, battery bank, grid/pole, transformer, UPS/inverter, capacitor bank |
| Protection | 25 | MCB 1P–4P (colorable), MCCB 3P/4P, RCCB 2P/4P, RCBO, MPCB, RCD, SPD, fuse + HRC fuse + holder, overload, phase-fail / phase monitor / phase selector, isolator, knife switch, DC breaker, earth-leakage relay |
| Contactors / Relays | 15 | contactor 1P/2P/4P, mini & capacitor contactors, auxiliary block, mechanical interlock, timer ON / timer OFF, relay, solid-state relay, 8-pin ice-cube relay + socket, flasher relay |
| Automation | 14 | LOGO! 230RCI + DM8/AM2 modules, PLC rack, remote I/O, HMI panel, VFD drive, soft starter, servo drive, PID controller, safety relay, 24 V / 12 V DC PSU, Ethernet switch |
| Buttons / Switches | 16 | PB NO / NC / dual, illuminated green & red, e-stop (incl. key-release), selector ON/OFF, 1-0-2 and cam switches, key switch, toggle, joystick, foot switch, double push I/O |
| Sensors | 18 | limit, float, pressure, temp & flow switches, floatless level (C61F-GP) + level electrode, photo / thru-beam / inductive / capacitive proximity, rotary encoder, thermocouple, RTD PT100, pressure transmitter, smoke detector, door reed, PIR |
| Signaling | 20 | pilot lamps (green/red/blue/orange/yellow), buzzer, horn/siren, electric bell, stack light tower, rotating beacon, 3Φ indicator, voltmeter / ammeter (digital + analog), CT, kWh & power-factor meters, hour counter |
| Loads | 16 | motor 3Φ / 1Φ / DC / servo (+ photo skin), star-delta motor, water pump, compressor, axial fan, conveyor belt, heater element, lamp / LED bulb / fluorescent tube, solenoid valve, electromagnet |
| Wiring | 24 | terminal blocks x1–x12 (incl. colored), neutral & earth links, earth bar, busbar + comb busbar, screw busbar rail, distribution block, junction, wire duct (std/wide), end bracket, cable gland, industrial plug & socket 3P |
| Structure | 13 | panel S/M/L, breaker box, distribution box, floor cabinet, mounting plate, DIN rail, cabinet vent fan, standoff insulator, text label, warning sign, blanking plug |
| Ready-Made Units | 6 | ATS 2-source & 3-source, DOL starter panel, star-delta panel, distribution board, pump control panel |

---

## Editor features

- **Pan / zoom** canvas (`ZOOM_MIN` 0.05 → `ZOOM_MAX` 4.5) with fit-to-view
- **Drag & drop** parts from the library; move, resize, recolor, and re-skin them
- **Wire drawing** terminal-to-terminal with orthogonal routing, color choice, and via-points
- **Undo / redo** history
- **Run / Stop** simulation with live interaction on the panel
- **Edit mode** to lock/unlock layout changes while running
- **Dark / light theme** and **grid toggle**
- **Auto-save** to `localStorage` (`electro-panel-v2`, with migration from `v1`)
- **Export PNG** of the current design
- **Guided steps** panel that validates each tutorial step against live solver state

---

## Continuous integration

`.github/workflows/build.yml` runs on pushes to `main` / `arena/**` and on pull requests to `main`:
`npm ci` → `npm run typecheck` → `npm run build` on Node 20.x and 22.x, with the npm cache enabled.

> The previous workflow ran `npx webpack`, which does not apply to this Vite project and always failed.

---

## Notes

- The dev and preview servers bind `0.0.0.0` and set `allowedHosts: true`, so the app works behind
  reverse proxies and sandboxed preview URLs.
- `eee-simulator (3).zip` is a legacy source archive kept at the repo root for reference. Its
  contents are identical to the files under `src/`; `*.zip` is now git-ignored so new archives are
  not committed by accident.
