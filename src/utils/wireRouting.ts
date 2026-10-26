import type { Wire } from "../components/Canvas";
import { routeWire, type Port } from "../data/terminals";

export type WirePoint = { x: number; y: number };

const close = (a: number, b: number) => Math.abs(a - b) < 0.1;

function simplify(points: WirePoint[]): WirePoint[] {
  const clean: WirePoint[] = [];
  for (const point of points) {
    const previous = clean[clean.length - 1];
    if (!previous || !close(point.x, previous.x) || !close(point.y, previous.y)) {
      clean.push(point);
    }
  }
  for (let i = clean.length - 2; i > 0; i--) {
    const before = clean[i - 1];
    const point = clean[i];
    const after = clean[i + 1];
    if ((close(before.x, point.x) && close(point.x, after.x)) ||
        (close(before.y, point.y) && close(point.y, after.y))) {
      clean.splice(i, 1);
    }
  }
  return clean;
}

const SIDE_DIR: Record<Port["side"], WirePoint> = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function basePoints(wire: Wire, start: Port, end: Port): WirePoint[] {
  const dots = wire.dots ?? [];
  if (dots.length) {
    // Free control dots: short stubs leave each terminal in its own direction.
    const stub = 16;
    const sa = SIDE_DIR[start.side];
    const ea = SIDE_DIR[end.side];
    return simplify([
      { ...start },
      { x: start.x + sa.x * stub, y: start.y + sa.y * stub },
      ...dots.map((dot) => ({ x: dot.x, y: dot.y })),
      { x: end.x + ea.x * stub, y: end.y + ea.y * stub },
      { ...end },
    ]);
  }
  const via = wire.via?.map((point, index) => {
    if (wire.routeMode === "row") return { x: index === 0 ? start.x : end.x, y: point.y };
    if (wire.routeMode === "column") return { x: point.x, y: index === 0 ? start.y : end.y };
    return point;
  });
  return via?.length ? [start, ...via, end] : routeWire(start, end);
}

/** A cable's middle may be moved, but both ends always remain on their terminal screws. */
export function getWirePoints(wire: Wire, start: Port, end: Port): WirePoint[] {
  const base = basePoints(wire, start, end);
  const dx = wire.routeOffset?.x ?? 0;
  const dy = wire.routeOffset?.y ?? 0;
  let points = base;

  if (dx || dy) {
    // A straight cable needs an explicit jog, otherwise moving it along its own
    // axis would simplify back into the same line and appear not to move.
    const middle = base.length > 2
      ? base.slice(1, -1)
      : close(start.x, end.x)
        ? [
            { x: start.x + (dx ? 0 : 22), y: (start.y + end.y) / 2 - 14 },
            { x: end.x + (dx ? 0 : 22), y: (start.y + end.y) / 2 + 14 },
          ]
        : [
            { x: (start.x + end.x) / 2 - 14, y: start.y + (dy ? 0 : 22) },
            { x: (start.x + end.x) / 2 + 14, y: end.y + (dy ? 0 : 22) },
          ];
    const moved = middle.map((point) => ({ x: point.x + dx, y: point.y + dy }));
    const first = moved[0];
    const last = moved[moved.length - 1];
    const startElbow = start.side === "left" || start.side === "right"
      ? { x: first.x, y: start.y }
      : { x: start.x, y: first.y };
    const endElbow = end.side === "left" || end.side === "right"
      ? { x: last.x, y: end.y }
      : { x: end.x, y: last.y };
    points = simplify([start, startElbow, ...moved, endElbow, end]);
  }

  const slack = Math.max(0, wire.slack ?? 0);
  if (slack > 0 && points.length > 1) {
    // Insert a rectangular detour into the longest exposed segment.
    let longest = 0;
    let segment = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const length = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
      if (length > longest) {
        longest = length;
        segment = i;
      }
    }
    if (longest > 2) {
      const a = points[segment];
      const b = points[segment + 1];
      const along = Math.min(26, longest * 0.28);
      const vx = (b.x - a.x) / longest;
      const vy = (b.y - a.y) / longest;
      const before = { x: (a.x + b.x) / 2 - vx * along, y: (a.y + b.y) / 2 - vy * along };
      const after = { x: (a.x + b.x) / 2 + vx * along, y: (a.y + b.y) / 2 + vy * along };
      const normal = close(a.x, b.x) ? { x: slack, y: 0 } : { x: 0, y: slack };
      points = simplify([
        ...points.slice(0, segment + 1),
        before,
        { x: before.x + normal.x, y: before.y + normal.y },
        { x: after.x + normal.x, y: after.y + normal.y },
        after,
        ...points.slice(segment + 1),
      ]);
    }
  }

  return simplify(points);
}

export function wireLength(points: readonly WirePoint[]): number {
  return points.slice(1).reduce((length, point, i) =>
    length + Math.hypot(point.x - points[i].x, point.y - points[i].y), 0);
}

export function wireMidpoint(points: readonly WirePoint[]): WirePoint {
  const half = wireLength(points) / 2;
  let passed = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (passed + length >= half && length) {
      const t = (half - passed) / length;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    passed += length;
  }
  return points[0] ?? { x: 0, y: 0 };
}

/** Middle of the longest straight run — the best spot to add a new dot. */
export function longestSegmentMidpoint(points: readonly WirePoint[]): { at: WirePoint; segment: number } {
  let longest = 0;
  let segment = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const length = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    if (length > longest) {
      longest = length;
      segment = i;
    }
  }
  const a = points[segment];
  const b = points[segment + 1] ?? a;
  return { at: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, segment };
}