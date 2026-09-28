// Switching sensors have a dry changeover contact. A level electrode is a
// passive probe, so it retains its separate sensing lead instead of a relay.
export const CONTACT_SENSOR_IDS = [
  "limit", "float", "pressure", "temp", "photo", "prox-ind", "prox-cap",
  "photo-beam", "encoder", "thermocouple", "pt100", "pressure-tx",
  "flow", "smoke", "reed", "pir",
] as const;

export const CONTACT_SENSORS: ReadonlySet<string> = new Set(CONTACT_SENSOR_IDS);

// Old designs and examples used T1/B1 or B1/B2. Remap only those sensor
// endpoints; all other device IDs and wires stay unchanged.
const aliases: Record<string, Record<string, string>> = {
  limit: { T1: "COM", B1: "NO", B2: "NC" },
  float: { T1: "COM", B1: "NO" },
  flow: { T1: "COM", B1: "NO" },
  pressure: { B1: "COM", B2: "NC" },
  thermocouple: { T1: "COM", T2: "NO" },
  pt100: { T1: "COM", T2: "NO" },
};

for (const id of CONTACT_SENSOR_IDS) {
  if (!aliases[id]) aliases[id] = { B1: "COM", B2: "NO" };
}

export function normalizeSensorWires<T extends { a: string; b: string }>(
  items: readonly { uid: string; id: string }[],
  wires: readonly T[],
): T[] {
  const types = new Map(items.map(({ uid, id }) => [uid, id]));
  const canonical = (key: string) => {
    const separator = key.lastIndexOf("::");
    if (separator < 0) return key;
    const uid = key.slice(0, separator);
    const port = key.slice(separator + 2);
    const mapped = aliases[types.get(uid) ?? ""]?.[port];
    return mapped ? `${uid}::${mapped}` : key;
  };
  return wires.map((wire) => ({ ...wire, a: canonical(wire.a), b: canonical(wire.b) }));
}