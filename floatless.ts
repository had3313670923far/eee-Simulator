// Functional virtual labels, not a manufacturer's numbered socket pinout.
// The passive electrode has a lead, not a dry relay output.
export const FLOATLESS_CLEAN_PARTS = new Set(["level-probe"]);

export const FLOATLESS_PORTS = [
  { id: "S0", x: 13, y: 10, side: "top", label: "S0 / AC 0V" },
  { id: "S1", x: 25, y: 10, side: "top", label: "S1 / AC 110V" },
  { id: "E1", x: 37, y: 10, side: "top", label: "E1 / High probe" },
  { id: "E2", x: 50, y: 10, side: "top", label: "E2 / Low probe" },
  { id: "E3", x: 13, y: 55, side: "bottom", label: "E3 / Grounded common" },
  { id: "COM", x: 25, y: 55, side: "bottom", label: "COM / Relay feed" },
  { id: "NC", x: 37, y: 55, side: "bottom", label: "NC / Supply pump" },
  { id: "NO", x: 50, y: 55, side: "bottom", label: "NO / Drain pump" },
] as const;

export const WATER_STAGES = ["LOW", "RISING", "HIGH", "FALLING"] as const;

export const nextWaterStage = (stage: number) => (stage + 1) % WATER_STAGES.length;