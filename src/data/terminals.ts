import type { Placed } from "../components/Canvas";
import { starterPort } from "./starDeltaLayout";
import { FLOATLESS_PORTS } from "./floatless";

export type TermSide = "top" | "bottom" | "left" | "right";

export type TDef = {
  id: string;
  x: number;
  y: number;
  side: TermSide;
  color?: string;
  label?: string;
};

export type Port = { x: number; y: number; side: TermSide };

/* On-canvas geometry: item card is 96px wide, glyph is 72px (viewBox 64) */
export const ITEM_W = 96;
export const ITEM_H = 88;
const GLYPH = 72;
const VB = 64;
const PAD_X = 12;
const PAD_Y = 4;

const C = {
  R: "#ef4444",
  Y: "#eab308",
  B: "#3b82f6",
  G: "#16a34a",
  N: "#e5e7eb",
};
const PHASE = [C.R, C.Y, C.B, C.G];
const PHASE_L = ["L1", "L2", "L3", "PE"];

const t = (
  id: string,
  x: number,
  y: number,
  side: TermSide,
  color?: string,
  label?: string
): TDef => ({ id, x, y, side, color, label });

/** top+bottom screw terminals for pole devices (MCB / RCCB / contactor) */
function poles(
  n: number,
  mw: number,
  gap: number,
  topY: number,
  botY: number,
  colors: (string | undefined)[] = PHASE,
  labels = PHASE_L
): TDef[] {
  const total = mw * n + gap * (n - 1);
  const x0 = (64 - total) / 2;
  const out: TDef[] = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (mw + gap) + mw / 2;
    const c = colors[i % colors.length];
    const l = labels[i % labels.length];
    out.push(t(`T${i + 1}`, x, topY, "top", c, l));
    out.push(t(`B${i + 1}`, x, botY, "bottom", c, l));
  }
  return out;
}

function topBot(
  xs: number[],
  ty: number,
  by: number,
  colors: (string | undefined)[] = []
): TDef[] {
  const out: TDef[] = [];
  xs.forEach((x, i) => {
    out.push(t(`T${i + 1}`, x, ty, "top", colors[i]));
    out.push(t(`B${i + 1}`, x, by, "bottom", colors[i]));
  });
  return out;
}

function bottomRow(xs: number[], y: number, colors: (string | undefined)[] = []): TDef[] {
  return xs.map((x, i) => t(`B${i + 1}`, x, y, "bottom", colors[i]));
}

function topRow(xs: number[], y: number, colors: (string | undefined)[] = []): TDef[] {
  return xs.map((x, i) => t(`T${i + 1}`, x, y, "top", colors[i]));
}

const sensorContacts = (): TDef[] => [
  t("COM", 18, 58, "bottom", undefined, "COM / common"),
  t("NC", 32, 58, "bottom", undefined, "NC / normally closed"),
  t("NO", 46, 58, "bottom", undefined, "NO / normally open"),
];

export const TERMINALS: Record<string, TDef[]> = {
  /* ---------- sources ---------- */
  gen: bottomRow([19, 27, 35, 43], 46.5, PHASE),
  "gen-photo": bottomRow([20, 28, 36, 44], 48.5, PHASE),
  "src-3ph": bottomRow([20, 32, 44], 47, [C.R, C.Y, C.B]),
  "src-1ph": [t("B1", 32, 50, "bottom", C.R, "L")],
  "src-110": [t("B1", 32, 50, "bottom", C.R, "AC 110V")],
  n: [t("B1", 32, 50, "bottom", C.B, "N")],
  pe: [t("B1", 32, 50, "bottom", C.G, "PE")],

  /* ---------- protection ---------- */
  "mcb-1": topBot([32], 12.6, 53.6),
  "mcb-2": topBot([23.8, 40.2], 12.6, 53.6),
  "mcb-3": topBot([15.6, 32, 48.4], 12.6, 53.6),
  "mcb-4": topBot([11, 25, 39, 53], 12.6, 53.6),
  mccb3: topBot([15, 32, 49], 15.5, 48, [C.R, C.Y, C.B]),
  mccb4: topBot([12, 25.3, 38.6, 52], 15.5, 48),
  rccb2: poles(2, 12, 2, 14, 50.5, [C.B, C.N], ["N", "N"]),
  rccb4: poles(4, 12, 2, 14, 50.5),
  ebreaker: [
    ...topRow([17, 47], 11),
    ...bottomRow([24, 40], 49.5),
  ],
  spd: [t("T1", 32, 13, "top", C.R, "L"), t("B1", 32, 50.6, "bottom", C.G, "PE")],
  fuse: [t("T1", 32, 13, "top"), t("B1", 32, 51, "bottom")],
  overload: [
    ...topRow([17, 27, 37], 12),
    ...bottomRow([20, 32, 44], 45, PHASE),
    t("NC1", 7.5, 31, "left", undefined, "95"),
    t("NC2", 7.5, 41, "left", undefined, "96"),
    t("NO1", 58, 31, "right", undefined, "97"),
    t("NO2", 58, 41, "right", undefined, "98"),
  ],
  phasefail: [...topRow([18, 46], 13), ...bottomRow([22, 42], 47)],
  phasesel: bottomRow([15, 49], 49),

  /* ---------- contactors / relays ---------- */
  ct1: [
    ...poles(3, 11, 2, 13.6, 49.4),
    t("A1", 60.5, 28, "right", undefined, "A1"),
    t("A2", 60.5, 40, "right", undefined, "A2"),
    t("S13", 4, 26, "left", undefined, "13"),
    t("S14", 4, 34, "left", undefined, "14"),
    t("S11", 4, 42, "left", undefined, "11"),
    t("S12", 4, 49.5, "left", undefined, "12"),
  ],
  ct2: [
    ...poles(2, 11, 2, 13.6, 49.4),
    t("A1", 60.5, 28, "right", undefined, "A1"),
    t("A2", 60.5, 40, "right", undefined, "A2"),
  ],
  ct4: [
    ...poles(4, 11, 2, 13.6, 49.4),
    t("A1", 14, 56.5, "bottom", undefined, "A1"),
    t("A2", 50, 56.5, "bottom", undefined, "A2"),
  ],
  "ct4-pro": [
    ...[12.5, 25.5, 38.5, 51.5].flatMap((x, i) => [
      t(`T${i + 1}`, x, 13.6, "top", undefined, ["13", "23", "11", "21"][i]),
      t(`B${i + 1}`, x, 49.4, "bottom", undefined, ["14", "24", "12", "22"][i]),
    ]),
    t("A1", 14, 56.5, "bottom", undefined, "A1"),
    t("A2", 50, 56.5, "bottom", undefined, "A2"),
  ],
  relay: [
    t("C1", 21.5, 33.5, "top", undefined, "COM"),
    t("C2", 42.5, 33.5, "top", undefined, "NO"),
    t("A1", 21.5, 45.5, "bottom", undefined, "A1"),
    t("A2", 42.5, 45.5, "bottom", undefined, "A2"),
  ],
  "timer-on": [
    t("C1", 18, 12.5, "top", undefined, "NO"),
    t("C2", 46, 12.5, "top", undefined, "NO"),
    t("NC1", 31, 12.5, "top", undefined, "NC"),
    t("NC2", 37, 12.5, "top", undefined, "NC"),
    t("A1", 22, 48.5, "bottom", undefined, "A1"),
    t("A2", 42, 48.5, "bottom", undefined, "A2"),
  ],
  "timer-off": [
    t("C1", 18, 12.5, "top", undefined, "NO"),
    t("C2", 46, 12.5, "top", undefined, "NO"),
    t("A1", 22, 48.5, "bottom", undefined, "A1"),
    t("A2", 42, 48.5, "bottom", undefined, "A2"),
  ],

  /* ---------- automation ---------- */
  logo230: topBot([14.5, 22.5, 30.5, 38.5, 46.5], 16, 48),
  "logo-dm8": topBot([22.5, 30.5, 38.5, 46.5], 16, 48),
  "logo-am2": topBot([24.5, 31.2, 37.9], 16, 48),
  vfd: [
    ...topRow([21, 32, 43], 10, [C.R, C.Y, C.B]),
    ...bottomRow([21, 32, 43], 50.5, [C.R, C.Y, C.B]),
  ],
  psu24: topBot([20, 28, 36, 44], 14, 49.5),

  /* ---------- buttons / switches ---------- */
  "pb-no": topBot([16.5, 47.5], 17.5, 48.5),
  "pb-nc": topBot([16.5, 47.5], 17.5, 48.5),
  "pb-dual": [
    t("T1", 15.5, 17.5, "top", C.G, "NO"),
    t("T2", 49, 19, "top", C.R, "NC"),
    t("B1", 48.5, 48.5, "bottom", undefined, "COM"),
  ],
  estop: topBot([13.5, 50.5], 19.5, 46.5),
  "sel-onoff": topBot([16, 48], 18, 48),
  selector: topBot([16, 48], 18, 48),
  "sel-102": topBot([16, 48], 18, 48),

  /* ---------- sensors ---------- */
  limit: sensorContacts(),
  float: sensorContacts(),
  "floatless-level": FLOATLESS_PORTS.map(({ id, x, y, side, label }) => t(id, x, y, side, undefined, label)),
  "level-probe": [t("T1", 32, 12, "top", undefined, "Electrode lead"), t("B1", 32, 52, "bottom", undefined, "Wet tip")],
  pressure: sensorContacts(),
  temp: sensorContacts(),
  photo: sensorContacts(),

  /* ---------- signaling ---------- */
  "light-green": bottomRow([28, 36], 51.5),
  "light-red": bottomRow([28, 36], 51.5),
  "light-blue": bottomRow([28, 36], 51.5),
  "light-orange": bottomRow([28, 36], 51.5),
  "light-yellow": bottomRow([28, 36], 51.5),
  buzzer: bottomRow([28, 36], 51.5),
  "ind-3ph": bottomRow([28, 36], 50),
  voltmeter: [...topRow([24, 40], 10, [C.R, C.Y]), ...bottomRow([26, 38], 51)],
  voltmeter3: [...topRow([24, 32, 40], 10, PHASE), ...bottomRow([26, 38], 51)],
  ammeter: [...topRow([24, 40], 10, [C.R, C.Y]), ...bottomRow([26, 38], 51)],
  ct: [
    ...topRow([25.7, 38.3], 12),
    ...bottomRow([27, 37], 52),
  ],

  /* ---------- loads ---------- */
  motor3: topRow([22, 28, 34], 13, [C.R, C.Y, C.B]),
  motor1: topRow([22, 34], 13, [C.R, C.B]),
  stardelta: [
    ...topRow([22.5, 30, 37.5], 13, [C.R, C.Y, C.B]),
    ...[22.5, 30, 37.5].map((x, i) => t(`B${i + 1}`, x, 20.2, "bottom", PHASE[i])),
  ],
  "motor-photo": topRow([22, 28, 34], 13, [C.R, C.Y, C.B]),
  pump: [
    t("T1", 18.5, 18, "top"),
    t("B1", 17, 53, "bottom"),
    t("T2", 41, 21, "top"),
  ],
  lamp: bottomRow([28, 36], 53),

  /* ---------- wiring ---------- */
  term1: poles(1, 12.5, 1.5, 19, 45, [undefined], ["1"]),
  term2: poles(2, 12.5, 1.5, 19, 45, [undefined, undefined], ["1", "2"]),
  term3: poles(3, 12.5, 1.5, 19, 45, [undefined, undefined, undefined], ["1", "2", "3"]),
  term4: poles(4, 12.5, 1.5, 19, 45, [undefined, undefined, undefined, undefined], ["1", "2", "3", "4"]),
  "neutral-link": [
    ...topRow([15, 26.3, 37.6, 49], 24.5),
    ...bottomRow([15, 26.3, 37.6, 49], 39.5),
  ],
  "earth-link": [
    ...topRow([15, 26.3, 37.6, 49], 24.5),
    ...bottomRow([15, 26.3, 37.6, 49], 39.5),
  ],
  busbar: [
    ...[19.5, 27.5, 35.5, 43.5].flatMap((y, i) => [
      t(`L${i + 1}`, 19, y, "left", PHASE[i], PHASE_L[i]),
      t(`R${i + 1}`, 45, y, "right", PHASE[i], PHASE_L[i]),
    ]),
  ],
  comb: [
    t("L1", 12, 22.5, "left"),
    t("R1", 52, 22.5, "right"),
    t("B1", 16, 42.5, "bottom"),
    t("B2", 48, 42.5, "bottom"),
  ],
  junction: (
    [
      [45, 32, "right"],
      [38.5, 43.3, "bottom"],
      [25.5, 43.3, "bottom"],
      [19, 32, "left"],
      [25.5, 20.7, "top"],
      [38.5, 20.7, "top"],
    ] as [number, number, TermSide][]
  ).map(([x, y, s], i) => t(`P${i + 1}`, x, y, s)),
  duct: [],
  "duct-wide": [],

  /* ---------- structure (no electrical terminals) ---------- */
  "panel-s": [],
  "panel-m": [],
  "panel-l": [],
  box: [],
  din: [],
  textlabel: [],

  /* ---------- ready-made ---------- */
  ats: [
    t("L1", 15, 24, "left", C.R, "L1"),
    t("L2", 15, 35, "left", C.Y, "L2"),
    t("L3", 15, 46, "left", C.B, "L3"),
    t("R1", 48, 32, "right", C.G, "OUT"),
  ],
};

/* ---------------- extra library terminals ---------------- */

const side = (id: string, x: number, y: number, s: TermSide, color?: string, label?: string): TDef =>
  t(id, x, y, s, color, label);

Object.assign(TERMINALS, {
  /* sources */
  solar: [side("B1", 20, 54, "bottom", C.R, "+"), side("B2", 44, 54, "bottom", C.B, "−")],
  battery: [side("B1", 26, 53, "bottom", C.R, "+"), side("B2", 38, 53, "bottom", C.B, "−")],
  "dc-source": [side("P", 32, 36, "bottom", C.R, "+"), side("N", 32, 52, "bottom", C.B, "−")],
  grid: bottomRow([22, 32, 42], 47, [C.R, C.Y, C.B]),
  "cap-bank": topRow([18, 32, 46], 12, [C.R, C.Y, C.B]),
  ups: [...topRow([18.5, 47.5], 14.5), ...bottomRow([18.5, 47.5], 49.5)],
  transformer: [...topRow([22, 42], 13), ...bottomRow([22, 42], 51)],
  "pv-inverter": [
    ...topRow([18.5, 47.5], 14.5, [C.R, C.B]),
    ...bottomRow([18.5, 33, 47.5], 49.5, [C.R, C.Y, C.B]),
  ],

  /* protection */
  rcbo2: topBot([25.2, 38.8], 12.6, 53.6, [C.R, C.B]),
  rcbo4: topBot([11.6, 25.2, 38.8, 52.4], 12.6, 53.6),
  mpcb: topBot([18.5, 33, 47.5], 14.5, 49.5, [C.R, C.Y, C.B]),
  isolator3: topBot([16, 32, 48], 15, 50, [C.R, C.Y, C.B]),
  knife: topBot([16, 32, 48], 15, 50, [C.R, C.Y, C.B]),
  "hrc-fuse": [side("T1", 14, 28, "top"), side("B1", 14, 48, "bottom")],
  "fuse-holder": [side("T1", 18, 30, "top"), side("B1", 18, 42, "bottom")],
  "dc-breaker": poles(2, 11, 2, 13.5, 50.6),
  elr: bottomRow([22.5, 43.5], 49.5),
  "phase-relay": bottomRow([22.5, 43.5], 49.5),

  /* contactors / relays */
  "aux-block": [
    t("T1", 22, 13, "top", undefined, "13 NO"),
    t("T2", 42, 13, "top", undefined, "21 NC"),
    t("B1", 18, 51, "bottom", undefined, "14 NO"),
    t("B2", 27.3, 51, "bottom", undefined, "22 NC"),
    t("B3", 36.6, 51, "bottom", undefined, "33 NO"),
    t("B4", 46, 51, "bottom", undefined, "34 NO"),
  ],
  ssr: [
    side("T1", 32, 12, "top"),
    side("B1", 32, 52, "bottom"),
    side("A1", 9, 15, "left", C.R, "+"),
    side("A2", 9, 26, "left", C.B, "−"),
  ],
  relay8: [
    ...[18, 27.4, 36.8, 46].map((x, i) => t(`T${i + 1}`, x, 13, "top", undefined, ["COM1", "NC1", "NO1", "NC2"][i])),
    ...[18, 27.4, 36.8, 46].map((x, i) => t(`B${i + 1}`, x, 51, "bottom", undefined, ["A1", "A2", "COM2", "NO2"][i])),
  ],
  "relay-socket": [
    ...[18, 27.4, 36.8, 46].map((x, i) => t(`T${i + 1}`, x, 14, "top", undefined, `Pin ${i + 1}`)),
    ...[18, 27.4, 36.8, 46].map((x, i) => t(`B${i + 1}`, x, 50, "bottom", undefined, `Pin ${i + 5}`)),
  ],
  flasher: [
    t("T1", 22.5, 14.5, "top", undefined, "13 NO"),
    t("T2", 43.5, 14.5, "top", undefined, "14 NO"),
    t("B1", 22.5, 49.5, "bottom", undefined, "A1"),
    t("B2", 43.5, 49.5, "bottom", undefined, "A2"),
  ],
  "cap-contactor": TERMINALS.ct2,
  "mini-contactor": TERMINALS.ct1,
  interlock: [],

  /* automation */
  softstarter: topBot([17.5, 33, 48.5], 14.5, 49.5, [C.R, C.Y, C.B]),
  "servo-drive": topBot([17.5, 33, 48.5], 14.5, 49.5, [C.R, C.Y, C.B]),
  pid: bottomRow([20, 28], 46),
  hmi: bottomRow([20, 44], 44),
  "plc-rack": bottomRow([23, 42], 44),
  "safety-relay": [
    t("T1", 20.5, 14.5, "top", undefined, "13 NO"),
    t("T2", 45.5, 14.5, "top", undefined, "14 NO"),
    t("B1", 20.5, 49.5, "bottom", undefined, "A1"),
    t("B2", 45.5, 49.5, "bottom", undefined, "A2"),
  ],
  "io-module": [
    ...topRow([20.5, 28.8, 37.1, 45.4], 14.5),
    ...bottomRow([20.5, 28.8, 37.1, 45.4], 49.5),
  ],
  "eth-switch": [side("B1", 24, 40, "bottom"), side("B2", 40, 40, "bottom")],
  smps12: [...topRow([20.5, 45.5], 14.5), ...bottomRow([20.5, 45.5], 49.5)],

  /* buttons / switches */
  "pb-green-light": topBot([32], 17.5, 48.5),
  "pb-red-light": topBot([32], 17.5, 48.5),
  "double-pb": [
    side("T1", 22, 16, "top", C.G, "NO"),
    side("T2", 42, 16, "top", C.R, "NC"),
    side("B1", 49, 49, "bottom", undefined, "COM"),
  ],
  key2: topBot([32], 18, 48),
  toggle: topBot([32], 24, 45),
  cam: topBot([32], 13, 51),
  joystick: bottomRow([16, 48], 48),
  foot: bottomRow([16, 48], 51),
  "estop-key": [side("B1", 12, 47, "bottom"), side("B2", 34, 47, "bottom"), side("B3", 41, 47, "bottom"), side("B4", 51, 47, "bottom")],

  /* sensors */
  "prox-ind": sensorContacts(),
  "prox-cap": sensorContacts(),
  "photo-beam": sensorContacts(),
  encoder: sensorContacts(),
  thermocouple: sensorContacts(),
  pt100: sensorContacts(),
  "pressure-tx": sensorContacts(),
  flow: sensorContacts(),
  smoke: sensorContacts(),
  reed: sensorContacts(),
  pir: sensorContacts(),

  /* signaling */
  tower: bottomRow([29, 35], 52),
  beacon: bottomRow([28, 36], 51),
  horn: bottomRow([18, 26], 47),
  bell: bottomRow([24, 40], 52),
  kwh: [...topRow([22, 42], 12), ...bottomRow([22, 42], 48)],
  "pf-meter": bottomRow([24, 40], 50),
  "hour-meter": bottomRow([24, 40], 50),
  "analog-a": bottomRow([22, 42], 51),
  "analog-v": bottomRow([22, 42], 51),

  /* loads */
  "dc-motor": topRow([24, 38], 13, [C.R, C.B]),
  "servo-motor": bottomRow([20, 27, 34], 50),
  "fan-axial": bottomRow([20, 44], 53),
  compressor: bottomRow([15, 22, 29], 55, [C.R, C.Y, C.B]),
  conveyor: bottomRow([14, 50], 55),
  heater: [side("T1", 15, 15, "top"), side("B1", 49, 49, "bottom")],
  "led-bulb": bottomRow([28, 36], 50),
  "tube-light": [side("B1", 7, 47, "bottom", C.R), side("B2", 57, 47, "bottom", C.B)],
  solenoid: bottomRow([26, 38], 52),
  electromagnet: bottomRow([22, 42], 55),

  /* wiring */
  term6: poles(
    6,
    9,
    1.4,
    14,
    50,
    [undefined, undefined, undefined, undefined, undefined, undefined],
    ["1", "2", "3", "4", "5", "6"]
  ),
  term12: poles(12, 4, 1.4, 14, 48),
  "dist-block": [...topRow([14, 24, 34, 44, 52], 24), ...bottomRow([14, 24, 34, 44, 52], 40)],
  "earth-bar": [...topRow([15, 25, 35, 45, 52], 24.5), ...bottomRow([15, 25, 35, 45, 52], 38)],
  "end-bracket": [],
  plug3: [...topRow([22, 32, 42], 9, [C.R, C.Y, C.B]), ...bottomRow([22, 32, 42], 48)],
  socket3: [...topRow([22, 32, 42], 16), ...bottomRow([22, 32, 42], 48)],
  gland: [],

  /* structure */
  cabinet: [],
  subplate: [],
  "vent-fan": [],
  insulator: [],
  warning: [],
  blanking: [],

  /* ready units */
  ats2: TERMINALS.ats,
  "dol-unit": topBot([13, 28, 43], 11, 50, [C.R, C.Y, C.B]),
  "sd-unit": topBot([13, 28, 43], 11, 50, [C.R, C.Y, C.B]),
  "db-unit": [],
  "pump-unit": topBot([13, 28, 43], 11, 50, [C.R, C.Y, C.B]),

  /* distribution board parts */
  "rcd-40": topBot([18, 46], 13, 51),
  "rail-bar": Array.from({ length: 12 }, (_, i) =>
    side(`T${i + 1}`, 5 + i * (54 / 11), 32, "top")
  ),
  "tb-blue": [side("T1", 32, 12, "top", C.B, "N"), side("B1", 32, 52, "bottom", C.B, "N")],
  "tb-green": [side("T1", 32, 12, "top", C.G, "PE"), side("B1", 32, 52, "bottom", C.G, "PE")],
  "tb-amber": [side("T1", 32, 12, "top", "#f59e0b"), side("B1", 32, 52, "bottom", "#f59e0b")],
  "tb-red": [side("T1", 32, 12, "top", C.R, "L"), side("B1", 32, 52, "bottom", C.R, "L")],
  "dist-panel": [],
} satisfies Record<string, TDef[]>);

export function getTerminals(partId: string): TDef[] {
  return TERMINALS[partId] ?? [];
}

/** glyph display rect for an item (custom-sized parts fill their whole box) */
export function itemRect(item: Placed) {
  if (item.w && item.h) {
    return { x: item.x, y: item.y, w: item.w, h: item.h };
  }
  return { x: item.x + PAD_X, y: item.y + PAD_Y, w: GLYPH, h: GLYPH };
}

/** Convert glyph-space terminal coords to world canvas coords */
export function termPos(item: Placed, def: TDef): Port {
  const override = item.skin === "starter" ? starterPort(item.id, def.id) : undefined;
  if (override && item.w && item.h) {
    return {
      x: item.x + (override[0] / VB) * item.w,
      y: item.y + (override[1] / VB) * item.h,
      side: def.side,
    };
  }
  if (item.w && item.h) {
    return {
      x: item.x + (def.x / VB) * item.w,
      y: item.y + (def.y / VB) * item.h,
      side: def.side,
    };
  }
  return {
    x: item.x + PAD_X + (def.x / VB) * GLYPH,
    y: item.y + PAD_Y + (def.y / VB) * GLYPH,
    side: def.side,
  };
}

export function termDotStyle(def: TDef, item?: Placed) {
  const override = item?.skin === "starter" ? starterPort(item.id, def.id) : undefined;
  if (override && item?.w && item.h) {
    return { left: (override[0] / VB) * item.w, top: (override[1] / VB) * item.h };
  }
  if (item?.w && item.h) {
    return { left: (def.x / VB) * item.w, top: (def.y / VB) * item.h };
  }
  return {
    left: PAD_X + (def.x / VB) * GLYPH,
    top: PAD_Y + (def.y / VB) * GLYPH,
  };
}

export const keyOf = (uid: string, id: string) => `${uid}::${id}`;
export const parseKey = (k: string): [string, string] => {
  const i = k.indexOf("::");
  return [k.slice(0, i), k.slice(i + 2)];
};

/* ---------------- wire routing (orthogonal / manhattan) ---------------- */

const DIR: Record<TermSide, { x: number; y: number }> = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const isVertical = (s: TermSide) => s === "top" || s === "bottom";

export function routeWire(a: Port, b: Port): { x: number; y: number }[] {
  const STUB = 22;
  const da = DIR[a.side];
  const db = DIR[b.side];
  const p1 = { x: a.x + da.x * STUB, y: a.y + da.y * STUB };
  const p2 = { x: b.x + db.x * STUB, y: b.y + db.y * STUB };
  let pts: { x: number; y: number }[] = [];

  if (isVertical(a.side) && isVertical(b.side)) {
    if (Math.abs(a.x - b.x) < 1) {
      pts = [{ x: a.x, y: a.y }, { x: b.x, y: b.y }];
    } else {
      const my = (p1.y + p2.y) / 2;
      pts = [{ ...a }, { x: a.x, y: my }, { x: b.x, y: my }, { ...b }];
    }
  } else if (!isVertical(a.side) && !isVertical(b.side)) {
    if (Math.abs(a.y - b.y) < 1) {
      pts = [{ ...a }, { ...b }];
    } else {
      const mx = (p1.x + p2.x) / 2;
      pts = [{ ...a }, { x: mx, y: a.y }, { x: mx, y: b.y }, { ...b }];
    }
  } else if (isVertical(a.side)) {
    pts = [{ ...a }, p1, { x: p2.x, y: p1.y }, p2, { ...b }];
  } else {
    pts = [{ ...a }, p1, { x: p1.x, y: p2.y }, p2, { ...b }];
  }

  const clean: { x: number; y: number }[] = [];
  for (const p of pts) {
    const last = clean[clean.length - 1];
    if (!last || Math.abs(last.x - p.x) > 0.4 || Math.abs(last.y - p.y) > 0.4) {
      clean.push(p);
    }
  }
  return clean;
}

export function pointsToPath(pts: { x: number; y: number }[]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}

/** manhattan polyline with smooth rounded corners (like real panel wiring) */
export function roundedPath(pts: { x: number; y: number }[], radius = 7): string {
  if (pts.length < 3) return pointsToPath(pts);
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const vIn = { x: Math.sign(p1.x - p0.x), y: Math.sign(p1.y - p0.y) };
    const vOut = { x: Math.sign(p2.x - p1.x), y: Math.sign(p2.y - p1.y) };
    const lenIn = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const lenOut = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const r = Math.min(radius, lenIn / 2, lenOut / 2);
    const a = { x: p1.x - vIn.x * r, y: p1.y - vIn.y * r };
    const b = { x: p1.x + vOut.x * r, y: p1.y + vOut.y * r };
    d += ` L ${a.x.toFixed(1)} ${a.y.toFixed(1)}`;
    d += ` Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

/** wire color for a potential mask during simulation (3-phase + N convention) */
export function phaseColorOf(mask: number): string {
  if (mask & 1) return "#ef4444"; // L1 red
  if (mask & 2) return "#f5c518"; // L2 yellow
  if (mask & 4) return "#3b82f6"; // L3 blue
  if (mask & 32) return "#fb923c"; // +24V orange
  if (mask & 8 || mask & 64) return "#bfe6ff"; // N / 0V bluish-white
  if (mask & 16) return "#22c55e"; // PE green
  return "#6cc6ff";
}

export const SOURCE_PARTS = new Set([
  "gen",
  "gen-photo",
  "src-3ph",
  "src-1ph",
  "n",
  "pe",
  "ats",
]);

export const WIRE_COLORS = [
  "#6cc6ff",
  "#cbd5e1",
  "#ef4444",
  "#eab308",
  "#3b82f6",
  "#16a34a",
  "#f97316",
  "#a855f7",
  "#111827",
];
