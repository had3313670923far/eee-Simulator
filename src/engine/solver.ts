import type { Placed, Wire } from "../components/Canvas";
import { getTerminals, keyOf } from "../data/terminals";
import { WATER_STAGES } from "../data/floatless";
import { CONTACT_SENSORS } from "../data/sensorContacts";

/* potential bits */
export const L1 = 1;
export const L2 = 2;
export const L3 = 4;
export const NN = 8;
export const PE = 16;
export const P24 = 32;
export const Z24 = 64;
const ENERG = L1 | L2 | L3 | NN | P24 | Z24;

export type Inputs = {
  pressed: Set<string>; // momentary buttons held
  off: Set<string>; // breakers switched OFF / NC sensors opened
  latched: Set<string>; // e-stop latched
  on: Set<string>; // selector switches closed / NO sensors activated
  tripped: Set<string>; // overload tripped
  levels: Map<string, number>; // 0 low, 1 rising, 2 high, 3 falling
};

export const emptyInputs = (): Inputs => ({
  pressed: new Set(),
  off: new Set(),
  latched: new Set(),
  on: new Set(),
  tripped: new Set(),
  levels: new Map(),
});

export type InteractKind = "moment" | "latch" | "toggleOn" | "toggleOff" | "trip" | "cycleLevel" | "probe";
export const INTERACT: Record<string, InteractKind> = {
  "pb-no": "moment",
  "pb-nc": "moment",
  "pb-dual": "moment",
  "pb-green-light": "moment",
  "pb-red-light": "moment",
  "double-pb": "moment",
  joystick: "moment",
  foot: "moment",
  flow: "toggleOn",
  limit: "toggleOn",
  float: "toggleOn",
  "floatless-level": "cycleLevel",
  "level-probe": "probe",
  estop: "latch",
  "estop-key": "latch",
  "sel-onoff": "toggleOn",
  selector: "toggleOn",
  "sel-102": "toggleOn",
  key2: "toggleOn",
  toggle: "toggleOn",
  cam: "toggleOn",
  temp: "toggleOn",
  photo: "toggleOn",
  "prox-ind": "toggleOn",
  "prox-cap": "toggleOn",
  "photo-beam": "toggleOn",
  smoke: "toggleOn",
  reed: "toggleOn",
  pir: "toggleOn",
  encoder: "toggleOn",
  thermocouple: "toggleOn",
  pt100: "toggleOn",
  "pressure-tx": "toggleOn",
  "mcb-1": "toggleOff",
  "mcb-2": "toggleOff",
  "mcb-3": "toggleOff",
  "mcb-4": "toggleOff",
  pressure: "toggleOn",
  overload: "trip",
  rcbo2: "toggleOff",
  rcbo4: "toggleOff",
  "dc-breaker": "toggleOff",
  isolator3: "toggleOff",
  knife: "toggleOff",
  "rcd-40": "trip",
  mpcb: "trip",
  phasesel: "toggleOn",
  "aux-block": "toggleOn",
};

/* always-closed series poles Tn ↔ Bn */
/* devices whose poles ALWAYS conduct (fuses, plugs, terminals, ready units…) */
const POLE_THROUGH: Record<string, number> = {
  "level-probe": 1,
  "hrc-fuse": 1,
  "fuse-holder": 1,
  softstarter: 3,
  "servo-drive": 3,
  kwh: 2,
  plug3: 3,
  socket3: 3,
  "dol-unit": 3,
  "sd-unit": 3,
  "pump-unit": 3,
  "tb-blue": 1,
  "tb-green": 1,
  "tb-amber": 1,
  "tb-red": 1,
};
/* protective devices that OPEN when switched off or tripped */
const PROT_SWITCH: Record<string, { poles: number; by: "off" | "trip" }> = {
  rcbo2: { poles: 2, by: "off" },
  rcbo4: { poles: 4, by: "off" },
  "rcd-40": { poles: 2, by: "trip" },
  mpcb: { poles: 3, by: "trip" },
  isolator3: { poles: 3, by: "off" },
  knife: { poles: 3, by: "off" },
  "dc-breaker": { poles: 2, by: "off" },
};
/* every terminal shorted together */
const SHORT_ALL = new Set([
  "dist-block",
  "earth-bar",
  "junction",
  "comb",
  "neutral-link",
  "earth-link",
  "rail-bar",
]);
/* two-terminal loads */
const LOAD_2 = new Set([
  "tower", "beacon", "horn", "bell", "pf-meter", "hour-meter", "analog-a", "analog-v",
  "heater", "led-bulb", "tube-light", "solenoid", "electromagnet", "dc-motor",
  "servo-motor", "fan-axial", "conveyor", "elr", "phase-relay", "plc-rack", "hmi",
  "io-module", "eth-switch", "pid",
]);
const LOAD_3 = new Set(["cap-bank", "compressor"]);
const NO_MOMENT = new Set(["pb-no", "pb-green-light", "pb-red-light", "joystick", "foot"]);
const TOGGLE_NO = new Set(["sel-onoff", "selector", "sel-102", "key2", "toggle", "cam"]);
/* converters: when any input terminal is hot, outputs are seeded */
const CONVERTERS: Record<string, { in: string[]; out: [string, number][] }> = {
  transformer: { in: ["T1", "T2"], out: [["B1", L1], ["B2", NN]] },
  ups: { in: ["T1", "T2"], out: [["B1", L1], ["B2", NN]] },
  smps12: { in: ["T1", "T2"], out: [["B1", L1], ["B2", NN]] },
  psu24: {
    in: ["T1", "T2", "T3", "T4"],
    out: [["B1", P24], ["B2", Z24], ["B3", P24], ["B4", Z24]],
  },
  "pv-inverter": { in: ["T1", "T2"], out: [["B1", L1], ["B2", L2], ["B3", L3]] },
};

export type TimerState = {
  energized: boolean;
  on: boolean;
  since: number | null; // when coil became energized (on-delay)
  offSince: number | null; // when coil de-energized (off-delay)
};
export type TimerEnv = Map<string, TimerState>;

export type SolveResult = {
  masks: Map<string, number>;
  onItems: Set<string>;
  hotItems: Set<string>;
  liveWires: Set<string>;
  wirePhases: Map<string, number>;
  coils: Set<string>;
  poweredControllers: Set<string>;
};

const pop = (n: number) => {
  let c = 0;
  while (n) {
    n &= n - 1;
    c++;
  }
  return c;
};

/** two terminal nodes form a powered loop when they carry different lines */
function loopBetween(a: number, b: number) {
  if (!a || !b) return false;
  if (a === b) return false;
  return pop((a | b) & ENERG) >= 2;
}

class DSU {
  m = new Map<string, string>();
  add(k: string) {
    if (!this.m.has(k)) this.m.set(k, k);
  }
  find(k: string): string {
    this.add(k);
    let r = k;
    while (this.m.get(r) !== r) r = this.m.get(r)!;
    let c = k;
    while (this.m.get(c) !== c) {
      const n = this.m.get(c)!;
      this.m.set(c, r);
      c = n;
    }
    return r;
  }
  union(a: string, b: string) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.m.set(ra, rb);
  }
}

type Edge = [string, string];

/* ---------- per-part electrical model ---------- */

function polePairs(n: number): Edge[] {
  return Array.from({ length: n }, (_, i) => [`T${i + 1}`, `B${i + 1}`]);
}

function model(
  item: Placed,
  inp: Inputs,
  coilsOn: Set<string>,
  timers: TimerEnv
): { edges: Edge[]; coils: Edge[]; sources: [string, number][] } {
  const id = item.id;
  const u = item.uid;
  const edges: Edge[] = [];
  const coils: Edge[] = [];
  const sources: [string, number][] = [];
  const k = (t: string) => keyOf(u, t);
  const connect = (a: string, b: string) => edges.push([k(a), k(b)]);
  const connectAll = (terms: string[]) => {
    for (let i = 1; i < terms.length; i++) connect(terms[0], terms[i]);
  };

  const pressed = inp.pressed.has(u);
  const off = inp.off.has(u);
  const latched = inp.latched.has(u);
  const on = inp.on.has(u);
  const tripped = inp.tripped.has(u);

  /* ---- sources ---- */
  if (id === "gen" || id === "gen-photo") {
    sources.push(["B1", L1], ["B2", L2], ["B3", L3], ["B4", NN]);
  } else if (id === "src-3ph") {
    sources.push(["B1", L1], ["B2", L2], ["B3", L3]);
  } else if (id === "src-1ph") {
    sources.push(["B1", L1]);
  } else if (id === "src-110") {
    sources.push(["B1", L1]);
  } else if (id === "n") {
    sources.push(["B1", NN]);
  } else if (id === "pe") {
    sources.push(["B1", PE]);
  } else if (id === "ats" || id === "ats2") {
    sources.push(["R1", L1]);
  } else if (id === "solar" || id === "battery") {
    sources.push(["B1", L1], ["B2", NN]);
  } else if (id === "dc-source") {
    sources.push(["P", L1], ["N", NN]);
  } else if (id === "grid") {
    sources.push(["B1", L1], ["B2", L2], ["B3", L3]);
  }

  /* generic series poles */
  if (POLE_THROUGH[id]) {
    polePairs(POLE_THROUGH[id]).forEach(([a, b]) => connect(a, b));
  }
  if (id === "dc-breaker" && !off) {
    polePairs(2).forEach(([a, b]) => connect(a, b));
  }
  if (SHORT_ALL.has(id)) {
    const all = getTerminals(id).map((d) => d.id);
    connectAll(all);
  }

  /* ---- static breakers / pass-through ---- */
  if (id.startsWith("mcb-")) {
    const n = Number(id.slice(-1));
    if (!off) polePairs(n).forEach(([a, b]) => connect(a, b));
  } else if (PROT_SWITCH[id]) {
    const sw = PROT_SWITCH[id];
    const open = sw.by === "trip" ? tripped : off;
    if (!open) polePairs(sw.poles).forEach(([a, b]) => connect(a, b));
  } else if (id === "mccb3") {
    polePairs(3).forEach(([a, b]) => connect(a, b));
  } else if (id === "mccb4") {
    polePairs(4).forEach(([a, b]) => connect(a, b));
  } else if (id === "rccb2") {
    polePairs(2).forEach(([a, b]) => connect(a, b));
  } else if (id === "rccb4") {
    polePairs(4).forEach(([a, b]) => connect(a, b));
  } else if (id === "ebreaker" || id === "phasefail") {
    connect("T1", "B1");
    connect("T2", "B2");
  } else if (id === "fuse") {
    connect("T1", "B1");
  } else if (id === "vfd") {
    polePairs(3).forEach(([a, b]) => connect(a, b));
  } else if (id === "ct") {
    connect("T1", "B1");
    connect("T2", "B2");
  }

  /* ---- terminals / buswork ---- */
  if (id.startsWith("term")) {
    const count = /^term(\d+)$/.exec(id)?.[1];
    if (count) polePairs(Number(count)).forEach(([a, b]) => connect(a, b));
  } else if (id === "neutral-link" || id === "earth-link") {
    connectAll(["T1", "T2", "T3", "T4", "B1", "B2", "B3", "B4"]);
  } else if (id === "comb" || id === "junction") {
    const t = getTerminals(id).map((d) => d.id);
    connectAll(t);
  } else if (id === "busbar") {
    for (let i = 1; i <= 4; i++) connect(`L${i}`, `R${i}`);
  }

  /* ---- push buttons & switches ---- */
  if (NO_MOMENT.has(id)) {
    if (pressed) connect("T1", "B1");
  } else if (id === "pb-nc") {
    if (!pressed) connect("T1", "B1");
  } else if (id === "pb-dual" || id === "double-pb") {
    if (pressed) connect("B1", "T1");
    else connect("B1", "T2");
  } else if (id === "estop") {
    if (!latched) {
      connect("T1", "B1");
      connect("T2", "B2");
    }
  } else if (id === "estop-key") {
    if (!latched) connect("B1", "B2");
  } else if (TOGGLE_NO.has(id)) {
    if (on) connect("T1", "B1");
  } else if (CONTACT_SENSORS.has(id)) {
    // Dry changeover outputs; triggering the sensor moves COM from NC to NO.
    connect("COM", on ? "NO" : "NC");
  } else if (id === "phasesel") {
    if (on) connect("B1", "B2");
  } else if (id === "aux-block") {
    // Standalone auxiliary block: two NO channels and one NC channel.
    if (on) {
      connect("T1", "B1");
      connect("B3", "B4");
    } else {
      connect("T2", "B2");
    }
  }

  if (id === "floatless-level") {
    // Dry relay contacts: NC controls filling, NO controls drainage.
    connect("COM", timers.get(u)?.on ? "NO" : "NC");
  }

  /* ---- overload relay: power poles always through, NC 95-96 unless tripped ---- */
  if (id === "overload") {
    polePairs(3).forEach(([a, b]) => connect(a, b));
    if (!tripped) connect("NC1", "NC2");
    else connect("NO1", "NO2");
  }

  /* ---- contactors ---- */
  const ct3 = id === "ct1" || id === "ct4" || id === "mini-contactor";
  const ct2n = id === "ct2" || id === "cap-contactor";
  if (id === "ct4-pro") {
    coils.push(["A1", "A2"]);
    if (coilsOn.has(u)) {
      connect("T1", "B1");
      connect("T2", "B2");
    } else {
      connect("T3", "B3");
      connect("T4", "B4");
    }
  } else if (ct3 || ct2n) {
    coils.push(["A1", "A2"]);
    if (coilsOn.has(u)) {
      const n = ct2n ? 2 : id === "ct1" || id === "mini-contactor" ? 3 : 4;
      polePairs(n).forEach(([a, b]) => connect(a, b));
      if (id === "ct1" || id === "mini-contactor") connect("S13", "S14");
    } else if (id === "ct1" || id === "mini-contactor") {
      connect("S11", "S12");
    }
  } else if (id === "relay") {
    coils.push(["A1", "A2"]);
    if (coilsOn.has(u)) connect("C1", "C2");
  } else if (id === "relay8") {
    coils.push(["B1", "B2"]);
    if (coilsOn.has(u)) {
      connect("T1", "T3"); // COM1 to NO1
      connect("B3", "B4"); // COM2 to NO2
    } else {
      connect("T1", "T2"); // COM1 to NC1
      connect("B3", "T4"); // COM2 to NC2
    }
  } else if (id === "safety-relay") {
    coils.push(["B1", "B2"]);
    if (coilsOn.has(u)) connect("T1", "T2");
  } else if (id === "ssr") {
    coils.push(["A1", "A2"]);
    if (coilsOn.has(u)) connect("T1", "B1");
  } else if (id === "flasher") {
    coils.push(["B1", "B2"]);
    if (timers.get(u)?.on) connect("T1", "T2");
  } else if (id === "timer-on" || id === "timer-off") {
    coils.push(["A1", "A2"]);
    const st = timers.get(u);
    if (st?.on) connect("C1", "C2");
    else if (id === "timer-on") connect("NC1", "NC2");
  }

  return { edges, coils, sources };
}

export function solve(
  items: Placed[],
  wires: Wire[],
  inp: Inputs,
  timers: TimerEnv,
  now: number,
  previouslyEnergized: ReadonlySet<string> = new Set()
): SolveResult {
  const allKeys = new Set<string>();
  items.forEach((it) => getTerminals(it.id).forEach((d) => allKeys.add(keyOf(it.uid, d.id))));
  wires.forEach((w) => {
    allKeys.add(w.a);
    allKeys.add(w.b);
  });

  // Keep coil state between frames so a NO auxiliary can seal in a contactor.
  let coilsOn = new Set(previouslyEnergized);
  let masks = new Map<string, number>();
  let lastDsu: DSU | null = null;
  const wireEdges: Edge[] = wires.map((w) => [w.a, w.b]);
  const wiredPorts = new Set(wires.flatMap((wire) => [wire.a, wire.b]));

  for (let iter = 0; iter < 40; iter++) {
    const dsu = new DSU();
    lastDsu = dsu;
    allKeys.forEach((k2) => dsu.add(k2));
    const seedComp = new Map<string, number>();
    const seed = (key: string, bit: number) => {
      const r = dsu.find(key);
      seedComp.set(r, (seedComp.get(r) ?? 0) | bit);
    };

    /* wires */
    wireEdges.forEach(([a, b]) => dsu.union(a, b));

    /* component contacts & coils */
    const coilPairs: { uid: string; a: string; b: string }[] = [];
    items.forEach((it) => {
      const m = model(it, inp, coilsOn, timers);
      m.edges.forEach(([a, b]) => dsu.union(a, b));
      m.sources.forEach(([t, bit]) => seed(keyOf(it.uid, t), bit));
      m.coils.forEach(([a, b]) =>
        coilPairs.push({ uid: it.uid, a: keyOf(it.uid, a), b: keyOf(it.uid, b) })
      );
    });

    /* component masks: merge seeds inside each connected component */
    const compMask = new Map<string, number>();
    seedComp.forEach((bit, r0) => {
      const r = dsu.find(r0);
      compMask.set(r, (compMask.get(r) ?? 0) | bit);
    });

    /* converters (transformer / inverter / UPS / PSU): hot input → outputs */
    for (let p = 0; p < 5; p++) {
      let changed = false;
      items.forEach((it) => {
        const conv = CONVERTERS[it.id];
        if (!conv) return;
        const hotIn = conv.in.some(
          (t) => (compMask.get(dsu.find(keyOf(it.uid, t))) ?? 0) & ENERG
        );
        if (hotIn) {
          conv.out.forEach(([t, bit]) => {
            const r = dsu.find(keyOf(it.uid, t));
            const cur = compMask.get(r) ?? 0;
            if (!(cur & bit)) {
              compMask.set(r, cur | bit);
              changed = true;
            }
          });
        }
      });
      if (!changed) break;
    }

    const newMasks = new Map<string, number>();
    allKeys.forEach((k2) => newMasks.set(k2, compMask.get(dsu.find(k2)) ?? 0));
    masks = newMasks;

    let levelChanged = false;
    items.forEach((item) => {
      if (item.id !== "floatless-level") return;
      const port = (id: string) => keyOf(item.uid, id);
      const supplied = loopBetween(masks.get(port("S0")) ?? 0, masks.get(port("S1")) ?? 0);
      // The longest E3 electrode must be grounded. E1/E2 need separate probe leads.
      const grounded = !!((masks.get(port("E3")) ?? 0) & PE);
      const probesWired = wiredPorts.has(port("E1")) && wiredPorts.has(port("E2"));
      const stage = (inp.levels.get(item.uid) ?? 0) % WATER_STAGES.length;
      const previous = timers.get(item.uid)?.on ?? false;
      const next = supplied && grounded && probesWired && (stage === 2 || (stage !== 0 && previous));
      if (next !== previous) levelChanged = true;
      timers.set(item.uid, { energized: supplied, on: next, since: null, offSince: null });
    });

    /* evaluate coils */
    const newCoils = new Set<string>();
    coilPairs.forEach(({ uid, a, b }) => {
      if (loopBetween(masks.get(a) ?? 0, masks.get(b) ?? 0)) newCoils.add(uid);
    });

    let same = newCoils.size === coilsOn.size;
    if (same) newCoils.forEach((u) => (!coilsOn.has(u) ? (same = false) : null));
    coilsOn = newCoils;
    if (same && !levelChanged && iter > 0) break;
  }

  /* timers update once from the converged potentials (state persists across ticks) */
  items.forEach((it) => {
    if (it.id !== "timer-on" && it.id !== "timer-off") return;
    const en = loopBetween(
      masks.get(keyOf(it.uid, "A1")) ?? 0,
      masks.get(keyOf(it.uid, "A2")) ?? 0
    );
    let st = timers.get(it.uid);
    if (!st) {
      st = { energized: false, on: false, since: null, offSince: null };
      timers.set(it.uid, st);
    }
    if (it.id === "timer-on") {
      if (en) {
        if (st.since == null) st.since = now;
        st.on = now - st.since >= 2500;
      } else {
        st.since = null;
        st.on = false;
      }
    } else {
      if (en) {
        st.offSince = null;
        st.on = true;
      } else {
        if (st.on && st.offSince == null) st.offSince = now;
        if (st.offSince != null) st.on = now - st.offSince < 2500;
      }
    }
    st.energized = en;
  });

  /* flasher relay: toggles continuously while its coil is powered */
  items.forEach((it) => {
    if (it.id !== "flasher") return;
    const en = loopBetween(masks.get(keyOf(it.uid, "B1")) ?? 0, masks.get(keyOf(it.uid, "B2")) ?? 0);
    let st = timers.get(it.uid);
    if (!st) {
      st = { energized: false, on: false, since: null, offSince: null };
      timers.set(it.uid, st);
    }
    st.energized = en;
    st.on = en ? Math.floor(now / 550) % 2 === 0 : false;
  });

  /* -------- evaluate loads / outputs -------- */
  const onItems = new Set<string>(coilsOn);
  const poweredControllers = new Set<string>();
  const hotItems = new Set<string>();
  const m = (u: string, t: string) => masks.get(keyOf(u, t)) ?? 0;
  const distinctPair = (a: number, b: number) => loopBetween(a, b);

  items.forEach((it) => {
    const id = it.id;
    const terms = getTerminals(id);
    const anyHot = terms.some((d) => m(it.uid, d.id) & ENERG);
    if (anyHot) hotItems.add(it.uid);
    if (id === "floatless-level") {
      if (loopBetween(m(it.uid, "S0"), m(it.uid, "S1"))) poweredControllers.add(it.uid);
      if (timers.get(it.uid)?.on) onItems.add(it.uid);
    }

    /* generic two-terminal loads */
    if (LOAD_2.has(id) && terms.length >= 2) {
      if (loopBetween(m(it.uid, terms[0].id), m(it.uid, terms[1].id))) onItems.add(it.uid);
    }
    /* generic three-phase loads */
    if (LOAD_3.has(id) && terms.length >= 3) {
      const union = terms.slice(0, 3).reduce((acc, d) => acc | m(it.uid, d.id), 0);
      if ((union & L1) && (union & L2) && (union & L3)) onItems.add(it.uid);
    }

    if (id === "motor3" || id === "stardelta" || id === "motor-photo") {
      const a = m(it.uid, "T1");
      const b = m(it.uid, "T2");
      const c = m(it.uid, "T3");
      const threePhases = !!(a && b && c && ((a | b | c) & L1) && ((a | b | c) & L2) && ((a | b | c) & L3));
      if (id !== "stardelta") {
        if (threePhases) onItems.add(it.uid);
      } else {
        // Six-lead motors run only when the winding ends have a star point or delta feed.
        const ends = ["B1", "B2", "B3"].map((term) => keyOf(it.uid, term));
        const starPoint = lastDsu !== null && lastDsu.find(ends[0]) === lastDsu.find(ends[1]) && lastDsu.find(ends[1]) === lastDsu.find(ends[2]);
        const deltaFeed = ends.every((term) => !!((masks.get(term) ?? 0) & (L1 | L2 | L3)));
        if (threePhases && (starPoint || deltaFeed)) onItems.add(it.uid);
      }
    } else if (id === "motor1") {
      if (distinctPair(m(it.uid, "T1"), m(it.uid, "T2"))) onItems.add(it.uid);
    } else if (id === "pump") {
      const v = [m(it.uid, "T1"), m(it.uid, "T2"), m(it.uid, "B1")].filter((x) => x);
      if (v.length >= 2 && pop((v[0] | v[1]) & ENERG) >= 2) onItems.add(it.uid);
    } else if (
      id === "lamp" ||
      id.startsWith("light-") ||
      id === "buzzer" ||
      id === "ind-3ph"
    ) {
      const bs = ["B1", "B2"];
      if (distinctPair(m(it.uid, bs[0]), m(it.uid, bs[1]))) onItems.add(it.uid);
    } else if (id === "voltmeter" || id === "voltmeter3" || id === "ammeter" || id === "kwh") {
      if (anyHot) onItems.add(it.uid);
    } else if (
      id === "vfd" ||
      id === "psu24" ||
      id === "smps12" ||
      id === "ups" ||
      id === "transformer" ||
      id === "softstarter" ||
      id === "servo-drive" ||
      id === "pv-inverter" ||
      id === "rcd-40" ||
      id === "rcbo2" ||
      id === "rcbo4"
    ) {
      if (anyHot) onItems.add(it.uid);
    } else if (id === "logo230" || id === "logo-dm8" || id === "logo-am2") {
      if (anyHot) onItems.add(it.uid);
    }
  });

  const liveWires = new Set<string>();
  const wirePhases = new Map<string, number>();
  wires.forEach((w) => {
    const m = (masks.get(w.a) ?? 0) | (masks.get(w.b) ?? 0);
    if (m & ENERG) {
      liveWires.add(w.uid);
      wirePhases.set(w.uid, m);
    }
  });

  return { masks, onItems, hotItems, liveWires, wirePhases, coils: coilsOn, poweredControllers };
}
