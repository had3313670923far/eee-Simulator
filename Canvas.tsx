import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Lock,
  Unlock,
  Grid3x3,
  Plus,
  Minus,
  Maximize2,
  MousePointer2,
  Trash2,
  Cable,
  X,
} from "lucide-react";
import { PartGlyph } from "./Icons";
import CableLayer from "./CableLayer";
import { partById } from "../data/catalog";
import {
  getTerminals,
  keyOf,
  parseKey,
  termDotStyle,
  termPos,
  phaseColorOf,
  type Port,
} from "../data/terminals";
import { INTERACT, type Inputs } from "../engine/solver";
import { visibleStarterPort } from "../data/starDeltaLayout";
import { FLOATLESS_CLEAN_PARTS } from "../data/floatless";
import { CONTACT_SENSORS } from "../data/sensorContacts";
import { canvasSizeFor } from "../utils/partSizing";
import { getWirePoints, wireMidpoint } from "../utils/wireRouting";

/* The 7 swatches from the reference popup: red, yellow, blue, sky, green, orange, white. */
const CABLE_POPUP_COLORS = [
  "#f04e56",
  "#f2cf46",
  "#2f6bdb",
  "#38bdf8",
  "#22c55e",
  "#f97316",
  "#f8fafc",
];

const CABLE_SIZES: { key: string; value: number }[] = [
  { key: "S", value: 2.5 },
  { key: "M", value: 3.5 },
  { key: "L", value: 4.5 },
  { key: "XL", value: 6 },
  { key: "XXL", value: 8 },
];

/** Swatch row (7 colors, wrapping to a second row of 2) plus close button. */
function ColorRow({
  current, onPick, onClose,
}: { current: string; onPick: (color: string) => void; onClose: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <button
        onClick={onClose}
        title="Close"
        className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--card)] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
      >
        <X size={13} />
      </button>
      {CABLE_POPUP_COLORS.map((color, i) => {
        const active = current.toLowerCase() === color.toLowerCase();
        const startsRow = i === 5;
        return (
          <button
            key={color}
            onClick={() => onPick(color)}
            title="Cable color"
            className={`h-6 w-6 rounded-md border transition-transform hover:scale-110 ${startsRow ? "ml-1" : ""} ${
              active ? "border-emerald-400 ring-2 ring-emerald-400/70" : "border-black/30"
            }`}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}

export type Placed = {
  uid: string;
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
  name?: string;
  libraryPlaced?: boolean;
  skin?: "starter";
};

export type WireDot = { id: string; x: number; y: number };

export type Wire = {
  uid: string;
  a: string; // terminal key uid::termId
  b: string;
  color?: string;
  via?: { x: number; y: number }[];
  routeMode?: "row" | "column";
  routeOffset?: { x: number; y: number };
  slack?: number;
  thickness?: number;
  /** Free control dots. Each can be dragged in any direction. */
  dots?: WireDot[];
  previewColor?: string;
  hidden?: boolean;
};

type Props = {
  items: Placed[];
  wires: Wire[];
  selected: string | null;
  selectedWire: string | null;
  activeMap: Set<string>;
  hotItems: Set<string>;
  poweredControllers: Set<string>;
  closedContacts: Set<string>;
  liveWires: Set<string>;
  masks: Map<string, number>;
  wirePhases: Map<string, number>;
  inputs: Inputs;
  onInteract: (uid: string) => void;
  onSelect: (uid: string | null) => void;
  onSelectWire: (uid: string | null) => void;
  onItemDragStart: () => void;
  onWireDragStart: () => void;
  onMove: (uid: string, x: number, y: number) => void;
  onMoveWire: (uid: string, offset: { x: number; y: number }) => void;
  onMoveWireDot: (uid: string, dotId: string, x: number, y: number) => void;
  onAddWireDot: (uid: string, dot: WireDot) => void;
  onWireThickness: (uid: string, thickness: number) => void;
  onDelete: (uid: string) => void;
  onDeleteWire: (uid: string) => void;
  onWireColor: (uid: string, color: string) => void;
  onAddWire: (a: string, b: string) => void;
  onDropPart: (id: string, x: number, y: number, color?: string) => void;
  draggingPart: { id: string; color?: string } | null;
  onDropEnd: () => void;
  zoom: number;
  pan: { x: number; y: number };
  onView: (zoom: number, pan: { x: number; y: number }) => void;
  locked: boolean;
  showGrid: boolean;
  onToggleLock: () => void;
  onToggleGrid: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  running: boolean;
  lang: "en" | "ar";
  editMode: boolean;
  onCanvasTouch: () => void;
};

export const ZOOM_MIN = 0.05;
export const ZOOM_MAX = 4.5;
const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

const STRUCTURAL = new Set([
  "sd-panel",
  "panel-s",
  "panel-m",
  "panel-l",
  "dist-panel",
  "cabinet",
  "subplate",
  "box",
  "din",
  "duct",
  "duct-wide",
  "textlabel",
]);

const SOURCE_DISPLAYS = new Set([
  "gen", "gen-photo", "src-3ph", "src-1ph", "src-110", "n", "pe", "solar",
  "battery", "dc-source", "grid", "ats", "ats2", "dol-unit",
  "sd-unit", "db-unit", "pump-unit",
]);

type LinkState = { from: string } | null;

export default function Canvas(p: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<
    | { mode: "item"; uid: string; sx: number; sy: number; ox: number; oy: number; committed: boolean }
    | { mode: "wire"; uid: string; sx: number; sy: number; ox: number; oy: number; committed: boolean }
    | { mode: "dot"; uid: string; dotId: string; sx: number; sy: number; ox: number; oy: number; committed: boolean }
    | { mode: "pan"; sx: number; sy: number; px: number; py: number }
    | null
  >(null);
  const [over, setOver] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewFrame = useRef<number | null>(null);
  const previewPosition = useRef({ x: -1000, y: -1000 });
  const [link, setLink] = useState<LinkState>(null);
  const linkRef = useRef<LinkState>(null);
  const hoverTerm = useRef<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  /* multi-touch pinch tracking */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    d: number;
    cx: number;
    cy: number;
    zoom: number;
    pan: { x: number; y: number };
  } | null>(null);
  const latestProps = useRef(p);
  latestProps.current = p;
  const latestView = useRef({ zoom: p.zoom, pan: p.pan });
  latestView.current = { zoom: p.zoom, pan: p.pan };

  /* index every terminal currently on canvas */
  const termIndex = useMemo(() => {
    const m = new Map<string, { uid: string; defId: string; port: Port; color?: string; label?: string }>();
    p.items.forEach((item) => {
      getTerminals(item.id).forEach((def) => {
        if (item.skin === "starter" && !visibleStarterPort(item.id, def.id)) return;
        m.set(keyOf(item.uid, def.id), {
          uid: item.uid,
          defId: def.id,
          port: termPos(item, def),
          color: def.color,
          label: def.label,
        });
      });
    });
    return m;
  }, [p.items]);

  const cleanHardwareUids = useMemo(
    () => new Set(p.items.filter((item) => FLOATLESS_CLEAN_PARTS.has(item.id)).map((item) => item.uid)),
    [p.items]
  );

  const connectedTerminals = useMemo(() => {
    const connections = new Set<string>();
    for (const wire of p.wires) {
      if (!wire.hidden) {
        connections.add(wire.a);
        connections.add(wire.b);
      }
    }
    return connections;
  }, [p.wires]);

  const visibleWireCount = p.wires.filter((wire) => !wire.hidden).length;
  const liveVisibleWireCount = p.wires.filter((wire) => !wire.hidden && p.liveWires.has(wire.uid)).length;

  const wetProbes = useMemo(() => {
    const active = new Set<string>();
    if (!p.running) return active;
    const controllers = new Set(p.items.filter((item) => item.id === "floatless-level").map((item) => item.uid));
    for (const wire of p.wires) {
      const [uidA, portA] = parseKey(wire.a);
      const [uidB, portB] = parseKey(wire.b);
      const probeUid = p.items.find((item) => item.id === "level-probe" && (item.uid === uidA || item.uid === uidB))?.uid;
      if (!probeUid) continue;
      const controller = probeUid === uidA ? uidB : uidA;
      const electrode = probeUid === uidA ? portB : portA;
      if (!controllers.has(controller)) continue;
      const stage = p.inputs.levels.get(controller) ?? 0;
      if (electrode === "E3" || (electrode === "E2" && stage !== 0) || (electrode === "E1" && stage === 2)) {
        active.add(probeUid);
      }
    }
    return active;
  }, [p.items, p.wires, p.inputs.levels, p.running]);

  const setLinkBoth = (v: LinkState) => {
    linkRef.current = v;
    setLink(v);
    if (!v) {
      hoverTerm.current = null;
      setHoverKey(null);
      setCursor(null);
    }
  };

  /* Esc cancels an in-progress cable */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && linkRef.current) setLinkBoth(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* a fresh pointer landed — begin or grow a pinch gesture */
  const onPointerCaptureDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      if (linkRef.current) setLinkBoth(null);
      drag.current = null;
      const [a, b] = [...pointers.current.values()];
      pinchRef.current = {
        d: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
        zoom: latestView.current.zoom,
        pan: { ...latestView.current.pan },
      };
    }
  };

  /* Coalesce high-frequency input to one viewport / item update per display frame. */
  useEffect(() => {
    let moveFrame: number | null = null;
    let pendingMove: PointerEvent | null = null;
    let wheelFrame: number | null = null;
    let wheelDelta = 0;
    let wheelPoint = { x: 0, y: 0 };
    let wheelIsPinch = false;

    const processMove = (e: PointerEvent) => {
      if (pointers.current.has(e.pointerId))
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const current = latestProps.current;
      const view = latestView.current;

      /* ---- pinch zoom + two-finger pan ---- */
      const pinch = pinchRef.current;
      if (pinch && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const nd = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const ncx = (a.x + b.x) / 2;
        const ncy = (a.y + b.y) / 2;
        const startCx = pinch.cx - r.left;
        const startCy = pinch.cy - r.top;
        const nz = clampZoom(pinch.zoom * (nd / pinch.d));
        const wx = (startCx - pinch.pan.x) / pinch.zoom;
        const wy = (startCy - pinch.pan.y) / pinch.zoom;
        const nextPan = {
          x: ncx - r.left - wx * nz,
          y: ncy - r.top - wy * nz,
        };
        latestView.current = { zoom: nz, pan: nextPan };
        current.onView(nz, nextPan);
        return;
      }

      const d = drag.current;
      if (linkRef.current) {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setCursor({
          x: (e.clientX - r.left - view.pan.x) / view.zoom,
          y: (e.clientY - r.top - view.pan.y) / view.zoom,
        });
        return;
      }
      if (!d || current.running) return;
      if (d.mode === "item") {
        if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 2 && !d.committed) return;
        if (!d.committed) {
          d.committed = true;
          current.onItemDragStart();
        }
        const nx = d.ox + (e.clientX - d.sx) / view.zoom;
        const ny = d.oy + (e.clientY - d.sy) / view.zoom;
        current.onMove(d.uid, nx, ny);
      } else if (d.mode === "wire") {
        if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 2 && !d.committed) return;
        if (!d.committed) {
          d.committed = true;
          current.onWireDragStart();
        }
        current.onMoveWire(d.uid, {
          x: d.ox + (e.clientX - d.sx) / view.zoom,
          y: d.oy + (e.clientY - d.sy) / view.zoom,
        });
      } else if (d.mode === "dot") {
        if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 1.5 && !d.committed) return;
        if (!d.committed) {
          d.committed = true;
          current.onWireDragStart();
        }
        current.onMoveWireDot(d.uid, d.dotId,
          d.ox + (e.clientX - d.sx) / view.zoom,
          d.oy + (e.clientY - d.sy) / view.zoom,
        );
      } else {
        const nextPan = { x: d.px + e.clientX - d.sx, y: d.py + e.clientY - d.sy };
        latestView.current = { zoom: view.zoom, pan: nextPan };
        current.onView(view.zoom, nextPan);
      }
    };

    const move = (e: PointerEvent) => {
      if (pointers.current.has(e.pointerId)) {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }
      pendingMove = e;
      if (moveFrame === null) {
        moveFrame = requestAnimationFrame(() => {
          moveFrame = null;
          const event = pendingMove;
          pendingMove = null;
          if (event) processMove(event);
        });
      }
    };

    const finishPointer = (e: PointerEvent, canceled: boolean) => {
      if (moveFrame !== null) {
        cancelAnimationFrame(moveFrame);
        moveFrame = null;
      }
      pendingMove = null;
      processMove(e);
      const wasPinch = !!pinchRef.current;
      if (pointers.current.has(e.pointerId)) pointers.current.delete(e.pointerId);

      if (wasPinch) {
        if (pointers.current.size < 2) pinchRef.current = null;
        /* One finger remains: carry on panning from the last painted position. */
        if (pointers.current.size === 1 && !linkRef.current && !latestProps.current.running) {
          const [pt] = [...pointers.current.values()];
          drag.current = {
            mode: "pan",
            sx: pt.x,
            sy: pt.y,
            px: latestView.current.pan.x,
            py: latestView.current.pan.y,
          };
        }
        document.body.style.userSelect = "";
        return;
      }

      drag.current = null;
      document.body.style.userSelect = "";
      if (canceled) {
        if (linkRef.current) setLinkBoth(null);
        return;
      }
      if (linkRef.current && hoverTerm.current) {
        const from = linkRef.current.from;
        const to = hoverTerm.current;
        if (to !== from) {
          const [u1] = parseKey(from);
          const [u2] = parseKey(to);
          if (u1 !== u2) latestProps.current.onAddWire(from, to);
        }
        setLinkBoth(null);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const node = ref.current;
      if (!node) return;
      const multiplier = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? node.clientHeight : 1;
      wheelDelta += e.deltaY * multiplier;
      wheelPoint = { x: e.clientX, y: e.clientY };
      wheelIsPinch = e.ctrlKey;
      if (wheelFrame !== null) return;
      wheelFrame = requestAnimationFrame(() => {
        wheelFrame = null;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const { zoom, pan } = latestView.current;
        const cx = wheelPoint.x - rect.left;
        const cy = wheelPoint.y - rect.top;
        const factor = Math.exp(Math.max(-2, Math.min(2, -wheelDelta * (wheelIsPinch ? 0.005 : 0.0015))));
        wheelDelta = 0;
        const nextZoom = clampZoom(zoom * factor);
        const nextPan = {
          x: cx - ((cx - pan.x) / zoom) * nextZoom,
          y: cy - ((cy - pan.y) / zoom) * nextZoom,
        };
        latestView.current = { zoom: nextZoom, pan: nextPan };
        latestProps.current.onView(nextZoom, nextPan);
      });
    };

    const node = ref.current;
    window.addEventListener("pointermove", move);
    const up = (e: PointerEvent) => finishPointer(e, false);
    const cancel = (e: PointerEvent) => finishPointer(e, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", cancel, true);
    node?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (moveFrame !== null) cancelAnimationFrame(moveFrame);
      if (wheelFrame !== null) cancelAnimationFrame(wheelFrame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", cancel, true);
      node?.removeEventListener("wheel", onWheel);
    };
  }, []);

  const startPan = (e: React.PointerEvent) => {
    if (linkRef.current) {
      setLinkBoth(null);
      return;
    }
    if (p.running) return;
    if ((e.target as HTMLElement).closest("[data-item]")) return;
    p.onSelect(null);
    p.onSelectWire(null);
    drag.current = { mode: "pan", sx: e.clientX, sy: e.clientY, px: latestView.current.pan.x, py: latestView.current.pan.y };
    document.body.style.userSelect = "none";
  };

  const startItem = (e: React.PointerEvent, item: Placed) => {
    /* live operation: press buttons, flip switches, trip overloads */
    if (p.running) {
      if (INTERACT[item.id]) {
        e.stopPropagation();
        p.onInteract(item.uid);
      }
      return;
    }
    /* clicking a component body while wiring cancels the hold */
    if (linkRef.current) {
      e.stopPropagation();
      setLinkBoth(null);
      return;
    }
    p.onSelect(item.uid);
    p.onSelectWire(null);
    if (p.locked) return;
    e.stopPropagation();
    drag.current = {
      mode: "item",
      uid: item.uid,
      sx: e.clientX,
      sy: e.clientY,
      ox: item.x,
      oy: item.y,
      committed: false,
    };
    document.body.style.userSelect = "none";
  };

  const startLink = (e: React.PointerEvent, key: string) => {
    if (p.locked || p.running) return;
    e.stopPropagation();
    p.onSelect(null);
    p.onSelectWire(null);
    if (linkRef.current) {
      /* second click completes the connection */
      if (key !== linkRef.current.from) {
        const [u1] = parseKey(linkRef.current.from);
        const [u2] = parseKey(key);
        if (u1 !== u2) p.onAddWire(linkRef.current.from, key);
      }
      setLinkBoth(null);
      return;
    }
    /* first click holds the terminal */
    setLinkBoth({ from: key });
    const held = termIndex.get(key)?.port;
    const r = ref.current!.getBoundingClientRect();
    const { zoom, pan } = latestView.current;
    setCursor(
      held ?? {
        x: (e.clientX - r.left - pan.x) / zoom,
        y: (e.clientY - r.top - pan.y) / zoom,
      }
    );
  };

  const handleWirePointerDown = useCallback((e: React.PointerEvent<SVGElement>, wire: Wire) => {
    // This handler stays stable while the viewport pans; live options come from the ref.
    const current = latestProps.current;
    if (current.running) return;
    e.stopPropagation();
    if (linkRef.current) {
      setLinkBoth(null);
      return;
    }
    current.onSelect(null);
    current.onSelectWire(wire.uid);
    if (current.locked) return;
    drag.current = {
      mode: "wire",
      uid: wire.uid,
      sx: e.clientX,
      sy: e.clientY,
      ox: wire.routeOffset?.x ?? 0,
      oy: wire.routeOffset?.y ?? 0,
      committed: false,
    };
    document.body.style.userSelect = "none";
  }, []);

  const handleDotPointerDown = useCallback(
    (e: React.PointerEvent<SVGElement>, wire: Wire, dot: WireDot) => {
      const current = latestProps.current;
      if (current.running) return;
      e.stopPropagation();
      if (linkRef.current) {
        setLinkBoth(null);
        return;
      }
      current.onSelect(null);
      current.onSelectWire(wire.uid);
      if (current.locked) return;
      drag.current = {
        mode: "dot",
        uid: wire.uid,
        dotId: dot.id,
        sx: e.clientX,
        sy: e.clientY,
        ox: dot.x,
        oy: dot.y,
        committed: false,
      };
      document.body.style.userSelect = "none";
    },
    []
  );

  const handleAddDotPointerDown = useCallback(
    (e: React.PointerEvent<SVGElement>, wire: Wire, dot: WireDot) => {
      const current = latestProps.current;
      if (current.running) return;
      e.stopPropagation();
      if (linkRef.current) {
        setLinkBoth(null);
        return;
      }
      current.onSelect(null);
      current.onSelectWire(wire.uid);
      if (current.locked) return;
      current.onAddWireDot(wire.uid, dot);
      drag.current = {
        mode: "dot",
        uid: wire.uid,
        dotId: dot.id,
        sx: e.clientX,
        sy: e.clientY,
        ox: dot.x,
        oy: dot.y,
        committed: true,
      };
      document.body.style.userSelect = "none";
    },
    []
  );

  const toWorld = (clientX: number, clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    const { zoom, pan } = latestView.current;
    return {
      x: (clientX - r.left - pan.x) / zoom,
      y: (clientY - r.top - pan.y) / zoom,
    };
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    setPreviewVisible(false);
    if (previewFrame.current !== null) {
      cancelAnimationFrame(previewFrame.current);
      previewFrame.current = null;
    }
    const raw = e.dataTransfer.getData("application/x-part");
    try {
      if (p.running || p.locked) return;
      const data = raw ? JSON.parse(raw) as { id: string; color?: string } : p.draggingPart;
      if (!data || !partById(data.id)) return;
      const w = toWorld(e.clientX, e.clientY);
      const size = canvasSizeFor(partById(data.id));
      p.onDropPart(data.id, w.x - size.w / 2, w.y - size.h / 2, data.color);
    } catch {
      // Ignore external or malformed drag data.
    } finally {
      p.onDropEnd();
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!p.draggingPart || p.running || p.locked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setOver(true);
    setPreviewVisible(true);

    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const size = canvasSizeFor(partById(p.draggingPart.id));
    previewPosition.current = {
      x: e.clientX - r.left - (size.w * p.zoom) / 2,
      y: e.clientY - r.top - (size.h * p.zoom) / 2,
    };
    if (previewFrame.current === null) {
      previewFrame.current = requestAnimationFrame(() => {
        previewFrame.current = null;
        const el = previewRef.current;
        if (el) {
          el.style.transform = `translate3d(${previewPosition.current.x}px, ${previewPosition.current.y}px, 0) scale(${p.zoom})`;
        }
      });
    }
  };

  useEffect(() => () => {
    if (previewFrame.current !== null) cancelAnimationFrame(previewFrame.current);
  }, []);

  const minor = 24 * p.zoom;
  const major = 120 * p.zoom;
  const showMinor = p.showGrid && minor >= 6;
  const showMajor = p.showGrid && major >= 10;
  const gridImages = [
    ...(showMinor
      ? [
          "linear-gradient(to right, var(--grid) 1px, transparent 1px)",
          "linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
        ]
      : []),
    ...(showMajor
      ? [
          "linear-gradient(to right, var(--grid-major) 1px, transparent 1px)",
          "linear-gradient(to bottom, var(--grid-major) 1px, transparent 1px)",
        ]
      : []),
  ];
  const gridSizes = [
    ...(showMinor ? [`${minor}px ${minor}px`, `${minor}px ${minor}px`] : []),
    ...(showMajor ? [`${major}px ${major}px`, `${major}px ${major}px`] : []),
  ];
  const gridPos = gridSizes.map(() => `${p.pan.x}px ${p.pan.y}px`);

  const sideBtn =
    "flex h-11 w-11 items-center justify-center border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition-all hover:border-emerald-500/50 hover:text-[var(--text)]";

  const fromPort = link ? termIndex.get(link.from)?.port : null;
  const previewSize = p.draggingPart ? canvasSizeFor(partById(p.draggingPart.id)) : null;

  /* The selected cable anchors a small horizontal toolbar (colors · size · dots). */
  const popupWire = !p.running && p.selectedWire ? p.wires.find((w) => w.uid === p.selectedWire) : undefined;
  const popupAnchor = useMemo(() => {
    if (!popupWire) return null;
    const pa = termIndex.get(popupWire.a)?.port;
    const pb = termIndex.get(popupWire.b)?.port;
    if (!pa || !pb) return null;
    const mid = wireMidpoint(getWirePoints(popupWire, pa, pb));
    return {
      x: Math.max(112, Math.min(window.innerWidth - 112, p.pan.x + mid.x * p.zoom)),
      y: Math.max(104, p.pan.y + mid.y * p.zoom - 22),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupWire, popupWire?.dots, popupWire?.routeOffset, popupWire?.slack, p.pan.x, p.pan.y, p.zoom, termIndex]);

  return (
    <div
      ref={ref}
      onPointerDownCapture={(e) => {
        onPointerCaptureDown(e);
        /* touch interaction with the drawing area dismisses the library (mobile) */
        if (e.pointerType === "touch") p.onCanvasTouch();
      }}
      className={`canvas-surface relative h-full flex-1 overflow-hidden ${p.running ? "" : "grab-canvas"}`}
      style={{
        touchAction: "none",
        overscrollBehavior: "contain",
        background: "var(--canvas)",
        backgroundImage: gridImages.length ? gridImages.join(",") : "none",
        backgroundSize: gridSizes.join(", "),
        backgroundPosition: gridPos.join(", "),
      }}
      onPointerDown={startPan}
      onDragOver={onDragOver}
      onDragLeave={(e) => {
        if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
        setOver(false);
        setPreviewVisible(false);
      }}
      onDrop={onDrop}
    >
      {over && (
        <div className="pointer-events-none absolute inset-2 z-20 rounded-xl border-2 border-dashed border-emerald-500/60 bg-emerald-500/5" />
      )}

      {p.draggingPart && previewSize && previewVisible && (
        <div
          ref={previewRef}
          className="pointer-events-none absolute left-0 top-0 z-30 flex flex-col items-center will-change-transform"
          style={{
            width: previewSize.w,
            height: previewSize.h,
            transformOrigin: "top left",
            transform: "translate3d(-1000px, -1000px, 0)",
            opacity: 0.85,
            filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.55))",
          }}
          aria-hidden="true"
        >
          <PartGlyph
            part={p.draggingPart.id}
            color={p.draggingPart.color}
            style={{ width: previewSize.w, height: previewSize.h }}
          />
          <span className="rounded bg-[var(--card)]/90 px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">
            {partById(p.draggingPart.id)?.en}
          </span>
        </div>
      )}

      {p.running && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-600/20 px-4 py-1.5 text-[12.5px] font-semibold text-emerald-300 backdrop-blur">
            <span className="ep-blink h-2 w-2 rounded-full bg-emerald-400" />
            Simulation running — trace the live power flow
          </div>
        </div>
      )}

      {link && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-600/25 px-4 py-1.5 text-[12px] font-medium text-sky-100 shadow-lg shadow-sky-900/40 backdrop-blur">
            <span className="ep-blink h-2 w-2 rounded-full bg-sky-300" />
            <Cable size={13} />
            Terminal held
            {termIndex.get(link.from)?.label && (
              <span className="rounded bg-sky-400/20 px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-sky-200">
                {termIndex.get(link.from)?.label}
              </span>
            )}
            — now click the second terminal · Esc cancels
          </div>
        </div>
      )}

      {p.running &&
        (() => {
          const ids = new Set(p.items.map((i) => i.id));
          const hints: string[] = [];
          if ([...ids].some((id) => id === "pb-no")) hints.push("hold green NO = START");
          if ([...ids].some((id) => id === "pb-nc")) hints.push("red NC = STOP");
          if ([...ids].some((id) => id === "estop")) hints.push("click E-Stop to latch");
          if ([...ids].some((id) => id.startsWith("sel-") || id === "selector"))
            hints.push("click selector to switch");
          if ([...ids].some((id) => id === "overload")) hints.push("click overload = TEST trip");
          if ([...ids].some((id) => id.startsWith("mcb-"))) hints.push("click MCB = open poles");
          if (hints.length === 0) return null;
          return (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 lg:block">
              <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--card)]/90 px-4 py-1.5 text-[11px] font-medium text-[var(--muted)] backdrop-blur">
                {hints.map((h) => (
                  <span key={h} className="whitespace-nowrap">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

      {p.items.length === 0 && p.wires.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--panel)]/60 px-10 py-8 text-center backdrop-blur-sm">
            <MousePointer2 size={26} className="text-emerald-400" />
            <p className="max-w-[280px] text-[13px] leading-relaxed text-[var(--muted)]">
              Drag parts from <span className="font-semibold text-emerald-400">Components</span> onto
              the grid, then <span className="font-semibold text-emerald-400">click one terminal</span>{" "}
              (it stays held) and <span className="font-semibold text-emerald-400">click another</span> to
              connect a power cable
            </p>
          </div>
        </div>
      )}

      {/* ===== world ===== */}
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate3d(${p.pan.x}px, ${p.pan.y}px, 0) scale(${p.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* The panel enclosure sits below its routed cables and mounted hardware. */}
        {p.items.filter((item) => item.id === "sd-panel").map((item) => (
          <div
            key={item.uid}
            className="pointer-events-none absolute left-0 top-0"
            style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
          >
            <PartGlyph part={item.id} skin={item.skin} style={{ width: item.w, height: item.h }} />
          </div>
        ))}

        {/* Routed cables sit above component faces; terminals remain the topmost hit targets. */}
        <svg
          className="absolute left-0 top-0 overflow-visible"
          width={2}
          height={2}
          style={{ pointerEvents: "none", zIndex: 2 }}
        >
          <CableLayer
            wires={p.wires}
            terminals={termIndex}
            cleanHardwareUids={cleanHardwareUids}
            selectedWire={p.selectedWire}
            liveWires={p.liveWires}
            wirePhases={p.wirePhases}
            running={p.running}
            locked={p.locked}
            onWirePointerDown={handleWirePointerDown}
            onDotPointerDown={handleDotPointerDown}
            onAddDotPointerDown={handleAddDotPointerDown}
          />

          {/* cable being dragged */}
          {link && fromPort && cursor && (
            <g>
              <path
                d={`M ${fromPort.x} ${fromPort.y} L ${cursor.x} ${cursor.y}`}
                className="wire-line"
                stroke="#05070d"
                strokeWidth={6}
                opacity={0.7}
              />
              <path
                d={`M ${fromPort.x} ${fromPort.y} L ${cursor.x} ${cursor.y}`}
                className="wire-line ep-flow"
                stroke="#34d399"
                strokeWidth={2.6}
                strokeDasharray="7 6"
              />
            </g>
          )}
        </svg>

        {/* components (structure painted behind) */}
        {p.items.filter((item) => item.id !== "sd-panel").sort((a, b) => {
          const sa = STRUCTURAL.has(a.id) ? 0 : 1;
          const sb = STRUCTURAL.has(b.id) ? 0 : 1;
          return sa - sb;
        }).map((item) => {
          const part = partById(item.id);
          const hideHardware = FLOATLESS_CLEAN_PARTS.has(item.id);
          const isFloatless = item.id === "floatless-level";
          const selected = p.selected === item.uid && !p.running;
          const terms = getTerminals(item.id).filter((def) => item.skin !== "starter" || visibleStarterPort(item.id, def.id));
          const powered = p.activeMap.has(item.uid);
          const sized = !!(item.w && item.h);
          const boxW = item.w ?? 96;
          const kind = INTERACT[item.id];
          const interactive = p.running && !!kind;
          const keyboardOperable = interactive && kind !== "moment";
          const pressed =
            p.inputs.pressed.has(item.uid) ||
            ((item.id === "estop" || item.id === "estop-key") && p.inputs.latched.has(item.uid));
          const breakerOn = !p.inputs.off.has(item.uid);
          const switchOn = p.inputs.on.has(item.uid);
          const glyphOn =
            item.id.startsWith("mcb-") ||
            ["dc-breaker", "rcbo2", "rcbo4", "isolator3", "knife"].includes(item.id)
              ? breakerOn
              : CONTACT_SENSORS.has(item.id) || ["sel-onoff", "selector", "sel-102", "key2", "toggle", "cam", "phasesel", "aux-block"].includes(item.id)
                ? switchOn
                : undefined;
          const tripped = p.inputs.tripped.has(item.uid);
          return (
            <div
              key={item.uid}
              data-item
              onPointerDown={(e) => startItem(e, item)}
              role={keyboardOperable ? "button" : undefined}
              tabIndex={keyboardOperable ? 0 : -1}
              onKeyDown={(e) => {
                if (!keyboardOperable || e.repeat || (e.key !== "Enter" && e.key !== " ")) return;
                e.preventDefault();
                p.onInteract(item.uid);
              }}
              title={
                interactive
                  ? kind === "moment"
                    ? "Press & hold to operate"
                    : kind === "cycleLevel"
                      ? "Tap to change water level: low, rising, high, falling"
                    : kind === "probe"
                      ? "Tap to simulate this electrode touching water"
                    : "Click to operate"
                  : undefined
              }
              style={{
                left: item.x,
                top: item.y,
                width: boxW,
                height: item.h,
                cursor: p.locked && !p.running ? "default" : undefined,
              }}
              className={`group absolute flex flex-col items-center rounded-lg ${
                sized ? "" : "w-24 pt-1"
              } transition-shadow ${
                p.running
                  ? interactive
                    ? "cursor-pointer hover:bg-emerald-500/10 hover:ring-2 hover:ring-emerald-400/60"
                    : "cursor-default"
                  : "cursor-pointer " +
                    (selected
                      ? "bg-emerald-500/10 ring-2 ring-emerald-400/80"
                      : "hover:bg-white/[0.03] hover:ring-1 hover:ring-emerald-500/30")
              }`}
            >
              {interactive && (
                <span className="ep-blink pointer-events-none absolute -left-1 -top-1 z-20 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
              )}
              {selected && p.editMode && !p.locked && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    p.onDelete(item.uid);
                  }}
                  className="absolute -right-2.5 -top-2.5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-red-400/50 bg-red-500/90 text-white shadow hover:bg-red-400"
                  title="Delete part"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <PartGlyph
                part={item.id}
                color={item.color}
                running={p.running}
                skin={item.skin}
                label={item.name}
                active={p.running && (powered || wetProbes.has(item.uid) || (item.id === "level-probe" && p.inputs.on.has(item.uid)) || (SOURCE_DISPLAYS.has(item.id) && p.hotItems.has(item.uid)))}
                supplyActive={p.running && p.poweredControllers.has(item.uid)}
                levelStage={p.running ? p.inputs.levels.get(item.uid) ?? 0 : 0}
                contactClosed={p.running && p.closedContacts.has(item.uid)}
                on={glyphOn}
                pressed={pressed}
                tripped={tripped}
                className="pointer-events-none"
                style={
                  sized
                    ? { width: boxW, height: item.h }
                    : { width: 72, height: 72 }
                }
              />
              {(!sized || item.libraryPlaced) && (
                <span className={`${item.libraryPlaced ? "pointer-events-none absolute -bottom-[17px] left-0 right-0 text-[11px] font-medium" : "text-[9.5px]"} max-w-full truncate px-1 text-center leading-tight text-[var(--muted)]`}>
                  {item.name?.trim()
                    ? item.name
                    : p.lang === "ar" && part?.ar
                      ? part.ar
                      : part?.en}
                </span>
              )}

              {/* terminals — small screws always visible, glow when live */}
              {terms.map((def) => {
                const tk = keyOf(item.uid, def.id);
                const dims = termDotStyle(def, item);
                const isFrom = link?.from === tk;
                const isHover = hoverKey === tk;
                const canLink = !!link && !isFrom && parseKey(link.from)[0] !== item.uid;
                const connected = connectedTerminals.has(tk);
                const termMask = p.masks.get(tk) ?? 0;
                const energized = p.running && termMask > 0;
                const energizedColor = phaseColorOf(termMask);
                const face = def.color ?? "#c2ccdc";
                const hitSize = isFloatless
                  ? Math.max(18, Math.min(28, ((item.w ?? 122) * 12) / 64 - 4))
                  : 20;
                return (
                  <div
                    key={def.id}
                    title={
                      p.running
                        ? energized
                          ? `${def.label ?? "Terminal"} — LIVE`
                          : `${def.label ?? "Terminal"} — no current`
                        : def.label
                          ? `${def.label} terminal${connected ? " / cable connected" : ""} — click to wire`
                          : `Terminal${connected ? " / cable connected" : ""} — click to wire`
                    }
                    onPointerDown={(e) => startLink(e, tk)}
                    onPointerEnter={() => {
                      if (linkRef.current) {
                        hoverTerm.current = tk;
                        setHoverKey(tk);
                      }
                    }}
                    onPointerLeave={() => {
                      if (hoverTerm.current === tk) {
                        hoverTerm.current = null;
                        setHoverKey(null);
                      }
                    }}
                    className={`absolute z-30 flex items-center justify-center ${isFloatless ? "" : CONTACT_SENSORS.has(item.id) && !sized ? "h-5 w-[14px]" : "h-5 w-5"}`}
                    style={{
                      left: dims.left,
                      top: dims.top,
                      ...(isFloatless ? { width: hitSize, height: hitSize } : {}),
                      transform: "translate(-50%,-50%)",
                      cursor: p.locked || p.running ? "default" : "crosshair",
                      pointerEvents: p.locked || p.running ? "none" : "auto",
                    }}
                  >
                    {isFloatless ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none h-full w-full rounded-full border-2 transition-all"
                        style={{
                          background: "transparent",
                          opacity: isFrom || isHover || canLink || energized ? 1 : connected ? 0.55 : 0,
                          borderColor: energized ? energizedColor : isFrom || isHover ? "#34d399" : p.running ? "#596674" : "#7dd3fc",
                          boxShadow: energized
                            ? `0 0 10px ${energizedColor}`
                            : isFrom || isHover
                              ? "0 0 12px rgba(52,211,153,0.8)"
                              : connected ? p.running ? "0 0 0 1px #596674" : "0 0 8px rgba(108,198,255,0.55)"
                              : "none",
                        }}
                      />
                    ) : !hideHardware && <span
                      className={`block rounded-full border transition-all ${
                        canLink || isFrom ? "ep-term-pulse" : ""
                      } ${
                        isHover && canLink
                          ? "h-4 w-4"
                          : isFrom
                            ? "h-3.5 w-3.5"
                            : energized
                              ? "h-3 w-3 ep-glow"
                              : connected
                                ? "h-[13px] w-[13px] group-hover:h-4 group-hover:w-4"
                              : "h-[11px] w-[11px] group-hover:h-4 group-hover:w-4"
                      }`}
                        style={{
                          backgroundImage: `radial-gradient(circle at 34% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0) 55%), ${face}`,
                          borderColor: energized ? energizedColor : "#0b1322",
                          boxShadow: energized
                            ? `0 0 0 2px ${energizedColor}88, 0 0 9px ${energizedColor}`
                            : isFrom || isHover
                            ? "0 0 0 3px rgba(52,211,153,0.4), 0 0 10px rgba(52,211,153,0.85)"
                            : connected
                              ? p.running
                                ? "0 0 0 2px rgba(89,102,116,0.9)"
                                : "0 0 0 2px rgba(108,198,255,0.7), 0 0 8px rgba(108,198,255,0.45)"
                            : "0 0 0 1px rgba(11,19,34,0.8)",
                          position: "relative",
                        }}
                    >
                      {/* phillips cross */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, transparent 40%, rgba(8,12,20,0.75) 40%, rgba(8,12,20,0.75) 60%, transparent 60%), linear-gradient(to bottom, transparent 40%, rgba(8,12,20,0.75) 40%, rgba(8,12,20,0.75) 60%, transparent 60%)",
                        }}
                      />
                    </span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Compact horizontal cable toolbar, floating just above the cable midpoint */}
      {popupWire && popupAnchor && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="ep-pop absolute z-50 rounded-2xl border border-emerald-500/50 bg-[var(--panel)]/95 px-2 py-1.5 shadow-2xl shadow-black/55 backdrop-blur"
          style={{
            left: `clamp(104px, ${popupAnchor.x}px, calc(100% - 104px))`,
            top: popupAnchor.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <ColorRow
            current={popupWire.previewColor ?? "#6cc6ff"}
            onPick={(color) => p.onWireColor(popupWire.uid, color)}
            onClose={() => p.onSelectWire(null)}
          />

          <div className="mt-1.5 flex items-center justify-center gap-1">
            {CABLE_SIZES.map((size) => {
              const active = Math.abs((popupWire.thickness ?? 4.5) - size.value) < 0.3;
              return (
                <button
                  key={size.key}
                  onClick={() => p.onWireThickness(popupWire.uid, size.value)}
                  title={`Cable size ${size.key}`}
                  className={`min-w-[26px] rounded-md border px-1.5 py-0.5 text-[10.5px] font-bold transition-colors ${
                    active
                      ? "border-emerald-400 bg-emerald-600/25 text-emerald-300"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {size.key}
                </button>
              );
            })}
            <button
              onClick={() => p.onDeleteWire(popupWire.uid)}
              title="Delete cable"
              className="flex h-6 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              #
            </button>
          </div>

          <div className="mt-1.5 flex items-center justify-center">
            <button
              onClick={() => {
                const pa = termIndex.get(popupWire.a)?.port;
                const pb = termIndex.get(popupWire.b)?.port;
                if (!pa || !pb) return;
                const mid = wireMidpoint(getWirePoints(popupWire, pa, pb));
                p.onAddWireDot(popupWire.uid, {
                  id: `dot-${Math.random().toString(36).slice(2, 9)}`,
                  x: mid.x,
                  y: mid.y,
                });
              }}
              title="Add a draggable dot to this cable"
              className="flex h-6 items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 text-[var(--muted)] transition-colors hover:border-emerald-500/50 hover:text-emerald-300"
            >
              <Plus size={12} />
              <span className="h-2 w-2 rounded-full bg-[var(--muted)]" />
            </button>
          </div>
        </div>
      )}

      {/* right controls */}
      <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col overflow-hidden rounded-lg shadow-lg shadow-black/30">
        <button className={sideBtn} onClick={p.onToggleLock} title={p.locked ? "Unlock canvas" : "Lock layout"}>
          {p.locked ? <Lock size={17} className="text-amber-400" /> : <Unlock size={17} />}
        </button>
        <button className={sideBtn} onClick={p.onToggleGrid} title="Toggle grid">
          <Grid3x3 size={17} className={p.showGrid ? "text-emerald-400" : ""} />
        </button>
        <button className={sideBtn} onClick={p.onZoomIn} title="Zoom in (5%–450%)">
          <Plus size={17} />
        </button>
        <button className={sideBtn} onClick={p.onZoomOut} title="Zoom out (5%–450%)">
          <Minus size={17} />
        </button>
        <button className={sideBtn} onClick={p.onFit} title="Fit to screen">
          <Maximize2 size={16} />
        </button>
      </div>

      {/* status bar */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)]/90 px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] backdrop-blur">
          <span className={`h-1.5 w-1.5 rounded-full ${p.running ? "bg-emerald-400" : p.editMode ? "bg-amber-400" : "bg-sky-400"}`} />
          {p.running ? "RUN" : p.editMode ? "EDIT" : "DESIGN"}
        </span>
        <span className="rounded-md border border-[var(--border)] bg-[var(--card)]/90 px-2.5 py-1 font-mono text-[11px] text-[var(--muted)] backdrop-blur">
          {p.items.length} part{p.items.length === 1 ? "" : "s"}
        </span>
        <span
          className={`hidden items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-[11px] backdrop-blur sm:flex ${
            p.running
              ? "border-sky-500/40 bg-sky-600/15 text-sky-300"
              : "border-[var(--border)] bg-[var(--card)]/90 text-[var(--muted)]"
          }`}
        >
          <Cable size={11} />
          {p.running ? `${liveVisibleWireCount}/${visibleWireCount} live` : `${visibleWireCount} cable${visibleWireCount === 1 ? "" : "s"}`}
        </span>
        <span className="rounded-md border border-[var(--border)] bg-[var(--card)]/90 px-2.5 py-1 font-mono text-[11px] text-[var(--muted)] backdrop-blur">
          {Math.round(p.zoom * 100)}%
        </span>
      </div>
    </div>
  );
}
