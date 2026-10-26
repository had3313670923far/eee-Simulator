import { memo, type PointerEvent as ReactPointerEvent } from "react";
import type { Wire, WireDot } from "./Canvas";
import { phaseColorOf, roundedPath, type Port } from "../data/terminals";
import { getWirePoints, longestSegmentMidpoint } from "../utils/wireRouting";

export type CableDot = { id: string; x: number; y: number };

type Props = {
  wires: Wire[];
  terminals: ReadonlyMap<string, { uid: string; port: Port }>;
  cleanHardwareUids: ReadonlySet<string>;
  selectedWire: string | null;
  liveWires: ReadonlySet<string>;
  wirePhases: ReadonlyMap<string, number>;
  running: boolean;
  locked: boolean;
  onWirePointerDown: (e: ReactPointerEvent<SVGElement>, wire: Wire) => void;
  onDotPointerDown: (e: ReactPointerEvent<SVGElement>, wire: Wire, dot: WireDot) => void;
  onAddDotPointerDown: (e: ReactPointerEvent<SVGElement>, wire: Wire, dot: CableDot) => void;
};

// Viewport pan/zoom only transforms this SVG. It doesn't rebuild every cable path.
function CableLayer({
  wires, terminals, cleanHardwareUids, selectedWire, liveWires,
  wirePhases, running, locked, onWirePointerDown, onDotPointerDown, onAddDotPointerDown,
}: Props) {
  const ordered = [...wires].sort((a, b) => Number(a.uid === selectedWire) - Number(b.uid === selectedWire));

  return (
    <>
      {ordered.map((wire) => {
        if (wire.hidden) return null;
        const pa = terminals.get(wire.a)?.port;
        const pb = terminals.get(wire.b)?.port;
        if (!pa || !pb) return null;
        const points = getWirePoints(wire, pa, pb);
        const path = roundedPath(points, 8);
        const phase = wirePhases.get(wire.uid) ?? 0;
        const selected = selectedWire === wire.uid;
        const live = liveWires.has(wire.uid);
        const thickness = Math.max(2, Math.min(10, wire.thickness ?? 4.5));
        const color = running
          ? live ? phaseColorOf(phase) : "#2f3540"
          : wire.previewColor ?? "#6cc6ff";

        return (
          <g key={wire.uid}>
            <path
              d={path}
              className="wire-line"
              stroke="#071320"
              strokeWidth={thickness + (selected ? 5.5 : 3.9)}
              opacity={running && !live ? 0.6 : 0.95}
            />
            <path
              d={path}
              className="wire-line"
              stroke={running && !live ? "#3a404c" : color}
              strokeWidth={thickness + (selected ? 1.1 : 0)}
              opacity={running && !live ? 0.95 : live ? 1 : 0.97}
              style={live ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined}
            />
            {(!running || live) && (
              <path d={path} className="wire-line" stroke="#ffffff" strokeWidth={thickness * 0.28} opacity={0.4} />
            )}
            {live && (
              <path d={path} className="wire-line ep-flow" stroke="#ffffff" strokeWidth={2} strokeDasharray="3 11" opacity={0.95} />
            )}
            <path
              d={path}
              className="wire-hit"
              style={{
                pointerEvents: running ? "none" : "stroke",
                strokeWidth: Math.max(thickness + 8, selected ? 16 : 12),
                cursor: locked ? "pointer" : "move",
              }}
              onPointerDown={(e) => onWirePointerDown(e, wire)}
            />
            {/* A ferrule at each terminal shows where the conductor is clamped. */}
            {[pa, pb].map((port, index) => {
              const terminal = terminals.get(index === 0 ? wire.a : wire.b);
              if (terminal && cleanHardwareUids.has(terminal.uid)) return null;
              return (
                <g key={index} style={{ pointerEvents: "none" }}>
                  <circle
                    cx={port.x} cy={port.y}
                    r={Math.max(6.3, thickness / 2 + 3)}
                    fill="#081522" stroke={selected && !running ? "#34d399" : color}
                    strokeWidth={2.1}
                  />
                  <circle cx={port.x} cy={port.y} r={3.5} fill={running && !live ? "#596371" : "#dcecf2"} stroke="#526778" strokeWidth={0.8} />
                  <path
                    d={`M${port.x - 1.7} ${port.y} H${port.x + 1.7} M${port.x} ${port.y - 1.7} V${port.y + 1.7}`}
                    stroke="#304a59" strokeWidth={0.8}
                  />
                </g>
              );
            })}
            {/* Dot handles: each can be dragged in any direction. */}
            {selected && !running && (wire.dots ?? []).map((dot) => (
              <g
                key={dot.id}
                onPointerDown={(e) => onDotPointerDown(e, wire, dot)}
                style={{ pointerEvents: "all", cursor: locked ? "pointer" : "move" }}
              >
                <title>Drag this dot to bend the cable in any direction</title>
                <circle cx={dot.x} cy={dot.y} r={11} fill="#0e2935" stroke="#50d5ab" strokeWidth={2} />
                <circle cx={dot.x} cy={dot.y} r={4.2} fill="#dcfff2" />
                {[[-7, 0], [7, 0], [0, -7], [0, 7]].map(([dx, dy], i) => (
                  <circle key={i} cx={dot.x + dx} cy={dot.y + dy} r={1.3} fill="#8ff0d6" />
                ))}
              </g>
            ))}

            {/* Dashed handle on the longest run: drag it out to add a new dot. */}
            {selected && !running && (() => {
              const { at } = longestSegmentMidpoint(points);
              return (
                <g
                  onPointerDown={(e) => onAddDotPointerDown(e, wire, { id: `dot-${Math.random().toString(36).slice(2, 9)}`, x: at.x, y: at.y })}
                  style={{ pointerEvents: "all", cursor: locked ? "pointer" : "crosshair" }}
                >
                  <title>Drag this dot to add a bend, then move it anywhere</title>
                  <circle cx={at.x} cy={at.y} r={8} fill="#0e2935" stroke="#50d5ab" strokeWidth={1.8} strokeDasharray="3 3" />
                  <path
                    d={`M${at.x - 3.4} ${at.y} H${at.x + 3.4} M${at.x} ${at.y - 3.4} V${at.y + 3.4}`}
                    stroke="#8ff0d6" strokeWidth={1.3} strokeLinecap="round"
                  />
                </g>
              );
            })()}
          </g>
        );
      })}
    </>
  );
}

export default memo(CableLayer);