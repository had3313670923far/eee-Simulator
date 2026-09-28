import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import Canvas, { ZOOM_MIN, ZOOM_MAX, type Placed, type Wire, type WireDot } from "./components/Canvas";
import { GlyphDefs } from "./components/Icons";
import "./components/IconsExtra";
import "./components/RealisticRelays";
import "./components/RealisticPower";
import "./components/RealisticControls";
import "./components/RealisticEquipment";
import "./components/StarDeltaArtwork";
import "./components/FloatlessLevel";
import "./components/SensorHardware";
import { type Part } from "./data/catalog";
import { emptyInputs, INTERACT, solve, type Inputs, type TimerEnv } from "./engine/solver";
import { EXAMPLES, type Example } from "./engine/examples";
import ExamplesModal from "./components/ExamplesModal";
import StepsPanel from "./components/StepsPanel";
import PropertiesPanel from "./components/PropertiesPanel";
import { exportPng } from "./utils/exportPng";
import { partById } from "./data/catalog";
import { nextWaterStage, WATER_STAGES } from "./data/floatless";
import { normalizeSensorWires } from "./data/sensorContacts";
import { getTerminals, parseKey, termPos } from "./data/terminals";
import { getWirePoints, wireLength } from "./utils/wireRouting";
import { canvasSizeFor } from "./utils/partSizing";
import { CheckCircle2, Lock, Info } from "lucide-react";

const STORE_KEY = "electro-panel-v2";

type Saved = {
  items: Placed[];
  wires: Wire[];
  theme: "dark" | "light";
  mcbColor: string;
  showGrid: boolean;
};

function enlargeLegacyFloatless(items: Placed[]): Placed[] {
  const size = partById("floatless-level")?.size;
  if (!size) return items;
  return items.map((item) =>
    item.id === "floatless-level" && item.w === 122 && item.h === 122
      ? {
          ...item,
          x: item.x - (size.w - 122) / 2,
          y: item.y - (size.h - 122) / 2,
          w: size.w,
          h: size.h,
        }
      : item
  );
}

/* The first launch opens the complete photographed-style star-delta panel. */
const INITIAL_DESIGN = EXAMPLES[0].build();

let uidCounter = 0;
const newUid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${(uidCounter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function loadSaved(): Partial<Saved> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Saved;
      const items = enlargeLegacyFloatless(parsed.items ?? []);
      return {
        ...parsed,
        items,
        wires: normalizeSensorWires(items, parsed.wires ?? []),
      };
    }
    const old = localStorage.getItem("electro-panel-v1");
    if (old) {
      const parsed = JSON.parse(old) as Saved;
      const items = enlargeLegacyFloatless(parsed.items ?? []);
      return {
        items,
        wires: normalizeSensorWires(items, parsed.wires ?? []),
        theme: parsed.theme,
        mcbColor: parsed.mcbColor,
        showGrid: parsed.showGrid,
      };
    }
  } catch {
    /* ignore */
  }
  return {};
}

type Snap = { items: Placed[]; wires: Wire[] };

let toastSeq = 0;

export default function App() {
  const saved = useRef(loadSaved()).current;

  const [theme, setTheme] = useState<"dark" | "light">(saved.theme ?? "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mcbColor, setMcbColor] = useState(saved.mcbColor ?? "#f97316");
  const [items, setItems] = useState<Placed[]>(saved.items ?? INITIAL_DESIGN.items);
  const [wires, setWires] = useState<Wire[]>(saved.wires ?? INITIAL_DESIGN.wires);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  const [draggingPart, setDraggingPart] = useState<{ id: string; color?: string } | null>(null);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [locked, setLocked] = useState(false);
  const [showGrid, setShowGrid] = useState(saved.showGrid ?? true);
  const [running, setRunning] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [currentExample, setCurrentExample] = useState<Example | null>(EXAMPLES[0]);
  const [inputs, setInputs] = useState<Inputs>(emptyInputs());
  const [tickState, setTick] = useState(0);
  const timerEnv = useRef<TimerEnv>(new Map());
  const coilMemory = useRef<Set<string>>(new Set());
  const [toast, setToast] = useState<{ id: number; msg: string; kind: "ok" | "lock" | "info" } | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const past = useRef<Snap[]>([]);
  const future = useRef<Snap[]>([]);
  const [histTick, setHistTick] = useState(0);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string, kind: "ok" | "lock" | "info" = "info") => {
    const id = ++toastSeq;
    setToast({ id, msg, kind });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, 2400);
  }, []);

  const snapshot = useCallback((): Snap => ({ items, wires }), [items, wires]);

  const pushHistory = useCallback(() => {
    const s = snapshot();
    past.current.push(JSON.parse(JSON.stringify(s)) as Snap);
    if (past.current.length > 60) past.current.shift();
    future.current = [];
    setHistTick((t) => t + 1);
  }, [snapshot]);

  const restore = useCallback((s: Snap) => {
    setItems(JSON.parse(JSON.stringify(s.items)) as Placed[]);
    setWires(JSON.parse(JSON.stringify(s.wires)) as Wire[]);
    setHistTick((t) => t + 1);
  }, []);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(JSON.parse(JSON.stringify(snapshot())) as Snap);
    restore(prev);
  }, [restore, snapshot]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(JSON.parse(JSON.stringify(snapshot())) as Snap);
    restore(next);
  }, [restore, snapshot]);

  const persist = useCallback(
    (s?: Snap) => {
      const data: Saved = {
        items: s?.items ?? items,
        wires: s?.wires ?? wires,
        theme,
        mcbColor,
        showGrid,
      };
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
      } catch {
        /* ignore */
      }
    },
    [items, wires, theme, mcbColor, showGrid]
  );

  const addAt = useCallback(
    (id: string, x: number, y: number, color?: string) => {
      if (running) {
        showToast("Stop the simulation to edit the panel", "info");
        return;
      }
      pushHistory();
      const size = canvasSizeFor(partById(id));
      const item: Placed = {
        uid: newUid(id),
        id,
        x,
        y,
        w: size.w,
        h: size.h,
        libraryPlaced: true,
        color,
      };
      setItems((prev) => [...prev, item]);
      setSelected(item.uid);
      setSelectedWire(null);
    },
    [running, pushHistory, showToast]
  );

  const addFromPalette = useCallback(
    (part: Part) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const jitter = ((items.length * 23) % 110) - 40;
      const size = canvasSizeFor(part);
      const hw = size.w / 2;
      const hh = size.h / 2;
      const x = (r.width / 2 - pan.x) / zoom - hw + jitter;
      const y = (r.height / 2 - pan.y) / zoom - hh + jitter;
      addAt(part.id, x, y, part.colorable ? mcbColor : undefined);
    },
    [addAt, items.length, mcbColor, pan, zoom]
  );

  // Keep the library stable while the viewport pans or zooms. A click still
  // uses the latest viewport when it places a component.
  const paletteAddRef = useRef(addFromPalette);
  paletteAddRef.current = addFromPalette;
  const handlePaletteAdd = useCallback((part: Part, pointerType?: string) => {
    paletteAddRef.current(part);
    if (pointerType === "touch") setSidebarOpen(false);
  }, []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const endPartDrag = useCallback(() => setDraggingPart(null), []);

  const onDragStartPart = useCallback(
    (e: React.DragEvent, part: Part) => {
      if (running) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData(
        "application/x-part",
        JSON.stringify({ id: part.id, color: part.colorable ? mcbColor : undefined })
      );
      e.dataTransfer.effectAllowed = "copy";
      setDraggingPart({ id: part.id, color: part.colorable ? mcbColor : undefined });
      // The canvas displays a full-size preview instead of the small browser ghost.
      const ghost = document.createElement("canvas");
      ghost.width = ghost.height = 1;
      e.dataTransfer.setDragImage(ghost, 0, 0);
    },
    [mcbColor, running]
  );

  const moveItem = useCallback((u: string, x: number, y: number) => {
    setItems((prev) => prev.map((it) => (it.uid === u ? { ...it, x, y } : it)));
  }, []);

  const deleteItem = useCallback(
    (u: string) => {
      if (running) return;
      pushHistory();
      setItems((prev) => prev.filter((it) => it.uid !== u));
      setWires((prev) =>
        prev.filter((w) => !w.a.startsWith(u + "::") && !w.b.startsWith(u + "::"))
      );
      setSelected(null);
    },
    [running, pushHistory]
  );

  const addWire = useCallback(
    (a: string, b: string) => {
      if (running) return;
      const exists = wires.some(
        (w) => (w.a === a && w.b === b) || (w.a === b && w.b === a)
      );
      if (exists) {
        showToast("Those terminals are already connected", "info");
        return;
      }
      pushHistory();
      const w: Wire = { uid: newUid("wire"), a, b, color: "#6cc6ff" };
      setWires((prev) => [...prev, w]);
      setSelectedWire(w.uid);
      showToast("Cable connected", "ok");
    },
    [running, wires, pushHistory, showToast]
  );

  const deleteWire = useCallback(
    (u: string) => {
      if (running) return;
      pushHistory();
      setWires((prev) => prev.filter((w) => w.uid !== u));
      setSelectedWire(null);
    },
    [running, pushHistory]
  );

  const setWireColor = useCallback(
    (u: string, color: string) => {
      pushHistory();
      setWires((prev) => prev.map((w) => (w.uid === u ? { ...w, color, previewColor: color } : w)));
    },
    [pushHistory]
  );

  const moveWireDot = useCallback((u: string, dotId: string, x: number, y: number) => {
    const nx = Math.max(-2000, Math.min(3000, x));
    const ny = Math.max(-2000, Math.min(3000, y));
    setWires((prev) =>
      prev.map((wire) =>
        wire.uid === u
          ? {
              ...wire,
              dots: (wire.dots ?? []).map((dot) =>
                dot.id === dotId ? { ...dot, x: nx, y: ny } : dot
              ),
            }
          : wire
      )
    );
  }, []);

  const addWireDot = useCallback(
    (u: string, dot: WireDot) => {
      if (running || locked) return;
      pushHistory();
      setWires((prev) =>
        prev.map((wire) =>
          wire.uid === u ? { ...wire, dots: [...(wire.dots ?? []), dot] } : wire
        )
      );
    },
    [running, locked, pushHistory]
  );

  const setWireThickness = useCallback(
    (u: string, thickness: number) => {
      if (locked || running) return;
      pushHistory();
      setWires((prev) => prev.map((w) => (w.uid === u ? { ...w, thickness } : w)));
    },
    [locked, running, pushHistory]
  );

  const moveWire = useCallback((u: string, offset: { x: number; y: number }) => {
    setWires((prev) => prev.map((wire) => wire.uid === u ? {
      ...wire,
      routeOffset: { x: Math.max(-1500, Math.min(1500, offset.x)), y: Math.max(-1500, Math.min(1500, offset.y)) },
    } : wire));
  }, []);

  const nudgeWire = useCallback((u: string, dx: number, dy: number) => {
    const wire = wires.find((w) => w.uid === u);
    if (!wire || locked || running) return;
    pushHistory();
    moveWire(u, { x: (wire.routeOffset?.x ?? 0) + dx, y: (wire.routeOffset?.y ?? 0) + dy });
  }, [wires, locked, running, pushHistory, moveWire]);

  const resizeWire = useCallback((u: string, delta: number) => {
    const wire = wires.find((w) => w.uid === u);
    if (!wire || locked || running) return;
    const slack = Math.max(0, Math.min(240, (wire.slack ?? 0) + delta));
    if (slack === (wire.slack ?? 0)) return;
    pushHistory();
    setWires((prev) => prev.map((w) => w.uid === u ? { ...w, slack } : w));
  }, [wires, locked, running, pushHistory]);

  const resizeWireThickness = useCallback((u: string, delta: number) => {
    const wire = wires.find((w) => w.uid === u);
    if (!wire || locked || running) return;
    const thickness = Math.max(2, Math.min(10, (wire.thickness ?? 4.5) + delta));
    if (thickness === (wire.thickness ?? 4.5)) return;
    pushHistory();
    setWires((prev) => prev.map((w) => w.uid === u ? { ...w, thickness } : w));
  }, [wires, locked, running, pushHistory]);

  const resetWireRoute = useCallback((u: string) => {
    const wire = wires.find((w) => w.uid === u);
    if (!wire || locked || running) return;
    if (!wire.routeOffset && !wire.slack && !wire.via?.length) return;
    pushHistory();
    setWires((prev) => prev.map((w) => w.uid === u ? {
      ...w, routeOffset: undefined, slack: undefined, via: undefined, routeMode: undefined,
    } : w));
  }, [wires, locked, running, pushHistory]);

  const renameItem = useCallback((u: string, name: string) => {
    setItems((prev) => prev.map((it) => (it.uid === u ? { ...it, name } : it)));
  }, []);

  const setItemColor = useCallback((u: string, color: string) => {
    setItems((prev) => prev.map((it) => (it.uid === u ? { ...it, color } : it)));
  }, []);

  const duplicateItem = useCallback(
    (u: string) => {
      setItems((prev) => {
        const it = prev.find((x) => x.uid === u);
        if (!it) return prev;
        pushHistory();
        const copy: Placed = {
          ...it,
          uid: newUid(it.id),
          x: it.x + 34,
          y: it.y + 34,
          name: it.name,
        };
        setSelected(copy.uid);
        showToast("Component duplicated", "ok");
        return [...prev, copy];
      });
    },
    [pushHistory, showToast]
  );

  const toggleEdit = useCallback(() => {
    setEditMode((v) => {
      const next = !v;
      if (!next) {
        setSelected(null);
        setSelectedWire(null);
      } else {
        showToast("Edit mode — select a component or cable", "info");
      }
      return next;
    });
  }, [showToast]);

  const zoomAt = useCallback(
    (factor: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      const nz = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom * factor));
      const wx = (cx - pan.x) / zoom;
      const wy = (cy - pan.y) / zoom;
      setZoom(nz);
      setPan({ x: cx - wx * nz, y: cy - wy * nz });
    },
    [pan, zoom]
  );

  /** Real fit: compute content bounds and fit them into the viewport */
  const fit = useCallback((target?: Placed[], targetWires?: Wire[]) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const visibleItems = target ?? items;
    if (visibleItems.length === 0) {
      setZoom(1);
      setPan({ x: 24, y: 24 });
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    visibleItems.forEach((it) => {
      minX = Math.min(minX, it.x);
      minY = Math.min(minY, it.y);
      maxX = Math.max(maxX, it.x + (it.w ?? 96));
      maxY = Math.max(maxY, it.y + (it.h ?? 88) + (it.libraryPlaced ? 20 : 0));
    });
    const itemIndex = new Map(visibleItems.map((item) => [item.uid, item]));
    for (const wire of targetWires ?? wires) {
      if (wire.hidden) continue;
      const [au, at] = parseKey(wire.a);
      const [bu, bt] = parseKey(wire.b);
      const a = itemIndex.get(au);
      const b = itemIndex.get(bu);
      const ad = a && getTerminals(a.id).find((terminal) => terminal.id === at);
      const bd = b && getTerminals(b.id).find((terminal) => terminal.id === bt);
      if (!a || !b || !ad || !bd) continue;
      for (const point of getWirePoints(wire, termPos(a, ad), termPos(b, bd))) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      }
    }
    const pad = visibleItems.some((it) => it.id === "sd-panel") ? 24 : 80;
    const w = Math.max(1, maxX - minX);
    const h = Math.max(1, maxY - minY);
    const z = Math.min((r.width - pad * 2) / w, (r.height - pad * 2) / h, ZOOM_MAX);
    const nz = Math.max(ZOOM_MIN, z);
    setZoom(nz);
    setPan({
      x: (r.width - w * nz) / 2 - minX * nz,
      y: (r.height - h * nz) / 2 - minY * nz,
    });
  }, [items, wires]);

  const toggleRun = useCallback(() => {
    setRunning((r) => {
      const next = !r;
      setSelected(null);
      setSelectedWire(null);
      setEditMode(false);
      if (!next) {
        setInputs(emptyInputs());
        timerEnv.current = new Map();
        coilMemory.current = new Set();
      }
      showToast(
        next
          ? "Simulation running — click the blinking buttons to operate"
          : "Simulation stopped",
        next ? "ok" : "info"
      );
      return next;
    });
  }, [showToast]);

  /* timer evaluation heartbeat while running */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 90);
    return () => window.clearInterval(id);
  }, [running]);

  /* release momentary push-buttons on pointer-up anywhere */
  useEffect(() => {
    const up = () =>
      setInputs((prev) =>
        prev.pressed.size === 0
          ? prev
          : { ...prev, pressed: new Set<string>() }
      );
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  const save = useCallback(() => {
    persist();
    showToast("Design saved to this browser", "ok");
  }, [persist, showToast]);

  const newDesign = useCallback(() => {
    if (running) setRunning(false);
    setEditMode(false);
    pushHistory();
    setItems([]);
    setWires([]);
    setSelected(null);
    setSelectedWire(null);
    setInputs(emptyInputs());
    timerEnv.current = new Map();
    coilMemory.current = new Set();
    setCurrentExample(null);
    setZoom(1);
    setPan({ x: 24, y: 24 });
    showToast("Blank design started", "info");
  }, [running, pushHistory, showToast]);

  /* ---- live circuit solver (re-evaluated every tick while running) ---- */
  const sim = useMemo(() => {
    if (!running) {
      return {
        onItems: new Set<string>(),
        closedContacts: new Set<string>(),
        liveWires: new Set<string>(),
        hotItems: new Set<string>(),
        poweredControllers: new Set<string>(),
        masks: new Map<string, number>(),
        wirePhases: new Map<string, number>(),
      };
    }
    const r = solve(items, wires, inputs, timerEnv.current, Date.now(), coilMemory.current);
    coilMemory.current = r.coils;
    return {
      onItems: r.onItems,
      closedContacts: new Set(
        [...timerEnv.current].filter(([, state]) => state.on).map(([uid]) => uid)
      ),
      liveWires: r.liveWires,
      hotItems: r.hotItems,
      poweredControllers: r.poweredControllers,
      masks: r.masks,
      wirePhases: r.wirePhases,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, wires, running, inputs, tickState]);

  /* operate a component while the simulation is running */
  const interact = useCallback(
    (uid: string) => {
      const item = items.find((i) => i.uid === uid);
      if (!item) return;
      const kind = INTERACT[item.id];
      if (!kind) return;
      const probeConnection = kind === "probe" ? wires.reduce<{ controller: string; port: string } | null>((found, wire) => {
        if (found) return found;
        const other = wire.a.startsWith(`${uid}::`) ? wire.b : wire.b.startsWith(`${uid}::`) ? wire.a : null;
        if (!other) return null;
        const [controller, port] = other.split("::");
        return items.some((candidate) => candidate.uid === controller && candidate.id === "floatless-level") &&
          ["E1", "E2", "E3"].includes(port)
          ? { controller, port }
          : null;
      }, null) : null;
      setInputs((prev) => {
        const next: Inputs = {
          pressed: new Set(prev.pressed),
          off: new Set(prev.off),
          latched: new Set(prev.latched),
          on: new Set(prev.on),
          tripped: new Set(prev.tripped),
          levels: new Map(prev.levels),
        };
        const toggle = (s: Set<string>) => (s.has(uid) ? s.delete(uid) : s.add(uid));
        if (kind === "moment") {
          next.pressed.add(uid);
        } else if (kind === "cycleLevel") {
          const stage = nextWaterStage(next.levels.get(uid) ?? 0);
          next.levels.set(uid, stage);
          showToast(`Tank level: ${WATER_STAGES[stage]}`, "info");
        } else if (kind === "probe") {
          if (probeConnection) {
            const previous = next.levels.get(probeConnection.controller) ?? 0;
            const stage = probeConnection.port === "E1" ? 2 : probeConnection.port === "E2" ? previous === 2 ? 3 : 1 : 0;
            next.levels.set(probeConnection.controller, stage);
            showToast(`${probeConnection.port} electrode: ${WATER_STAGES[stage]}`, "info");
          } else {
            toggle(next.on);
            showToast("Wire this electrode to E1, E2 or E3 to control the level switch", "info");
          }
        } else if (kind === "latch") {
          toggle(next.latched);
          showToast(
            next.latched.has(uid) ? "Emergency stop latched OPEN" : "E-stop reset",
            next.latched.has(uid) ? "lock" : "ok"
          );
        } else if (kind === "toggleOn") {
          toggle(next.on);
        } else if (kind === "toggleOff") {
          toggle(next.off);
        } else if (kind === "trip") {
          toggle(next.tripped);
          const trippedNow = next.tripped.has(uid);
          const label = item.name?.trim() || partById(item.id)?.en || "Device";
          showToast(
            trippedNow ? `${label} TRIPPED — contacts open` : `${label} reset`,
            trippedNow ? "lock" : "ok"
          );
        }
        return next;
      });
    },
    [items, wires, showToast]
  );

  const loadExample = useCallback(
    (ex: Example) => {
      const built = ex.build();
      pushHistory();
      setItems(built.items);
      setWires(built.wires);
      setSelected(null);
      setSelectedWire(null);
      setInputs(emptyInputs());
      timerEnv.current = new Map();
      coilMemory.current = new Set();
      setRunning(false);
      setEditMode(false);
      setCurrentExample(ex);
      setExamplesOpen(false);
      if (ex.id === "three-phase-star-delta-starter") setSidebarOpen(false);
      window.setTimeout(() => fit(built.items, built.wires), 80);
      showToast(`Loaded: ${ex.nameEn} — press Run and follow the guide`, "ok");
    },
    [pushHistory, fit, showToast]
  );

  const handleExport = useCallback(() => {
    const ok = exportPng(items, wires, currentExample?.id ?? "circuit");
    showToast(ok ? "Schematic exported as PNG" : "Canvas is empty — nothing to export", ok ? "ok" : "info");
  }, [items, wires, currentExample, showToast]);

  /* persist live when user saves; auto-save on unload too */
  useEffect(() => {
    const h = () => persist();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [persist]);

  /* frame the whole diagram on first load */
  const firstFit = useRef(true);
  useEffect(() => {
    if (firstFit.current) {
      firstFit.current = false;
      const id = window.setTimeout(() => fit(), 60);
      return () => window.clearTimeout(id);
    }
  }, [fit]);

  /* keyboard shortcuts */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      const typing = tag === "input" || tag === "textarea";
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !typing) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y" && !typing) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !typing &&
        !running &&
        editMode
      ) {
        if (selectedWire) {
          e.preventDefault();
          deleteWire(selectedWire);
        } else if (selected) {
          e.preventDefault();
          deleteItem(selected);
        }
      } else if (e.key === "Escape") {
        setSelected(null);
        setSelectedWire(null);
      } else if (
        !typing &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key.toLowerCase() === "f"
      ) {
        fit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, save, deleteItem, deleteWire, selected, selectedWire, running, editMode, fit]);

  const toastIcon =
    toast?.kind === "ok" ? (
      <CheckCircle2 size={16} className="text-emerald-400" />
    ) : toast?.kind === "lock" ? (
      <Lock size={16} className="text-amber-400" />
    ) : (
      <Info size={16} className="text-sky-400" />
    );

  const propItem =
    editMode && !running && selected ? items.find((i) => i.uid === selected) : undefined;
  const propWire =
    editMode && !running && selectedWire ? wires.find((w) => w.uid === selectedWire) : undefined;

  return (
    <div className={`app-root ${theme === "light" ? "light" : ""} flex h-full flex-col`}>
      <GlyphDefs />

      <Toolbar
        sidebarOpen={sidebarOpen}
        onToggleParts={() => setSidebarOpen((v) => !v)}
        onExamples={() => setExamplesOpen(true)}
        running={running}
        onToggleRun={toggleRun}
        canUndo={histTick >= 0 && past.current.length > 0}
        canRedo={future.current.length > 0}
        onUndo={undo}
        onRedo={redo}
        onFit={() => fit()}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onSave={save}
        onNew={newDesign}
        onExport={handleExport}
        editMode={editMode}
        onToggleEdit={toggleEdit}
      />

      <div className="relative flex min-h-0 flex-1">
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-30 hidden bg-black/55 backdrop-blur-[1px] max-lg:block"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {sidebarOpen && (
          <Sidebar
            onClose={closeSidebar}
            lang={lang}
            onLang={setLang}
            mcbColor={mcbColor}
            onMcbColor={setMcbColor}
            onAdd={handlePaletteAdd}
            onDragStart={onDragStartPart}
            onDragEnd={endPartDrag}
            running={running}
          />
        )}

        <div ref={wrapRef} className="relative min-w-0 flex-1">
          <Canvas
            items={items}
            wires={wires}
            selected={selected}
            selectedWire={selectedWire}
            activeMap={sim.onItems}
            hotItems={sim.hotItems}
            poweredControllers={sim.poweredControllers}
            closedContacts={sim.closedContacts}
            liveWires={sim.liveWires}
            masks={sim.masks}
            wirePhases={sim.wirePhases}
            inputs={inputs}
            onInteract={interact}
            onSelect={setSelected}
            onSelectWire={setSelectedWire}
            onItemDragStart={pushHistory}
            onWireDragStart={pushHistory}
            onMove={moveItem}
            onMoveWire={moveWire}
            onMoveWireDot={moveWireDot}
            onAddWireDot={addWireDot}
            onWireThickness={setWireThickness}
            onDelete={deleteItem}
            onDeleteWire={deleteWire}
            onWireColor={setWireColor}
            onAddWire={addWire}
            onDropPart={(id, x, y, color) => addAt(id, x, y, color)}
            draggingPart={draggingPart}
            onDropEnd={() => setDraggingPart(null)}
            zoom={zoom}
            pan={pan}
            onView={(z, pp) => {
              setZoom(z);
              setPan(pp);
            }}
            locked={locked}
            showGrid={showGrid}
            onToggleLock={() => {
              setLocked((v) => {
                showToast(v ? "Layout unlocked" : "Layout locked — cables & parts frozen", "info");
                return !v;
              });
            }}
            onToggleGrid={() => setShowGrid((v) => !v)}
            onZoomIn={() => zoomAt(1.2)}
            onZoomOut={() => zoomAt(1 / 1.2)}
            onFit={() => fit()}
            running={running}
            lang={lang}
            editMode={editMode}
            onCanvasTouch={() => setSidebarOpen(false)}
          />

          {editMode && !running && propItem && (
            <PropertiesPanel
              kind="part"
              item={propItem}
              part={partById(propItem.id)}
              onClose={() => setSelected(null)}
              onRename={renameItem}
              onColor={setItemColor}
              onDuplicate={duplicateItem}
              onDelete={deleteItem}
            />
          )}
          {editMode && !running && propWire && (
            <PropertiesPanel
              kind="wire"
              wire={propWire}
              onClose={() => setSelectedWire(null)}
              onWireColor={setWireColor}
              onNudgeWire={nudgeWire}
              onResizeWire={resizeWire}
              onResizeThickness={resizeWireThickness}
              onResetWire={resetWireRoute}
              length={(() => {
                const [au, at] = parseKey(propWire.a);
                const [bu, bt] = parseKey(propWire.b);
                const a = items.find((item) => item.uid === au);
                const b = items.find((item) => item.uid === bu);
                const ad = a && getTerminals(a.id).find((term) => term.id === at);
                const bd = b && getTerminals(b.id).find((term) => term.id === bt);
                return a && b && ad && bd
                  ? Math.round(wireLength(getWirePoints(propWire, termPos(a, ad), termPos(b, bd))))
                  : 0;
              })()}
              locked={locked}
              onDeleteWire={deleteWire}
            />
          )}

          {running && currentExample && (
            <StepsPanel
              title={currentExample.nameEn}
              steps={currentExample.steps}
              ctx={{ inputs, onItems: sim.onItems, hotItems: sim.hotItems }}
              resetKey={currentExample.id}
            />
          )}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div
            key={toast.id}
            className="ep-pop flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bar)] px-4 py-2.5 text-[13px] font-medium text-[var(--text)] shadow-2xl shadow-black/40"
          >
            {toastIcon}
            {toast.msg}
          </div>
        </div>
      )}

      <ExamplesModal
        open={examplesOpen}
        onClose={() => setExamplesOpen(false)}
        onLoad={loadExample}
      />

      <div className="pointer-events-none fixed bottom-1.5 right-3 z-20 hidden text-[10px] text-[var(--muted)] opacity-60 lg:block">
        Click terminals to connect · drag a cable to reroute · Edit adjusts length and size · F to fit
      </div>
    </div>
  );
}
