// Native dimensions of the panel artwork. Canvas placement uses the same sizes.
export const STARTER_SIZE: Record<string, { w: number; h: number }> = {
  "sd-panel": { w: 900, h: 970 },
  n: { w: 39, h: 59 },
  "src-3ph": { w: 102, h: 73 },
  term4: { w: 125, h: 79 },
  "neutral-link": { w: 155, h: 56 },
  "mcb-3": { w: 98, h: 156 },
  phasefail: { w: 63, h: 155 },
  "timer-on": { w: 96, h: 156 },
  fuse: { w: 40, h: 154 },
  overload: { w: 118, h: 206 },
  ct1: { w: 99, h: 204 },
  stardelta: { w: 174, h: 110 },
  junction: { w: 54, h: 35 },
  "light-green": { w: 64, h: 94 },
  "light-red": { w: 64, h: 94 },
  "light-orange": { w: 64, h: 94 },
  buzzer: { w: 64, h: 94 },
  "pb-no": { w: 66, h: 108 },
  "pb-nc": { w: 66, h: 108 },
};

// Positions are normalized to a 64x64 grid, then scaled to each device's native size.
// Only the ports whose location differs from the standard catalog need an override.
const STARTER_PORTS: Record<string, Record<string, [number, number]>> = {
  n: { B1: [32, 37] },
  "src-3ph": { B1: [8, 31], B2: [32, 31], B3: [56, 31] },
  term4: {
    T1: [11, 14], T2: [25, 14], T3: [39, 14], T4: [53, 14],
    B1: [11, 48], B2: [25, 48], B3: [39, 48], B4: [53, 48],
  },
  "mcb-3": {
    T1: [15.6, 10], T2: [32, 10], T3: [48.4, 10],
    B1: [15.6, 54], B2: [32, 54], B3: [48.4, 54],
  },
  phasefail: { T1: [18, 6], T2: [46, 6], B1: [22, 58], B2: [42, 58] },
  "timer-on": {
    C1: [18, 6], C2: [46, 6], NC1: [31, 6], NC2: [37, 6],
    A1: [22, 56], A2: [42, 56],
  },
  fuse: { T1: [32, 7], B1: [32, 51] },
  ct1: {
    T1: [19, 11], T2: [32, 11], T3: [45, 11],
    B1: [19, 57], B2: [32, 57], B3: [45, 57],
  },
  stardelta: {
    T1: [12, 11], T2: [12, 32], T3: [12, 53],
    B1: [52, 13], B2: [52, 32], B3: [52, 51],
  },
  "light-green": { B1: [32, 7], B2: [32, 61] },
  "light-red": { B1: [32, 7], B2: [32, 61] },
  "light-orange": { B1: [32, 7], B2: [32, 61] },
  buzzer: { B1: [32, 7], B2: [32, 61] },
  "pb-no": { T1: [32, 7], B1: [32, 61] },
  "pb-nc": { T1: [32, 7], B1: [32, 61] },
};

export function starterPort(part: string, terminal: string): [number, number] | undefined {
  return STARTER_PORTS[part]?.[terminal];
}

export function visibleStarterPort(part: string, terminal: string): boolean {
  if (part === "pb-no" || part === "pb-nc") return terminal === "T1" || terminal === "B1";
  return true;
}