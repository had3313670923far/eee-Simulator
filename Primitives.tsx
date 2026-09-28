import type { ReactNode } from "react";
import { SPlus } from "../Icons";

const FONT = "Arial, Helvetica, sans-serif";

export const PHASE = ["#ed5d60", "#f3cb55", "#4f9af2", "#4fbc78"];

export function Ink({
  x, y, children, size = 4.2, color = "#435566", weight = 700, anchor = "middle",
}: {
  x: number; y: number; children: ReactNode; size?: number;
  color?: string; weight?: number; anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor} style={{ fontFamily: FONT }}>
      {children}
    </text>
  );
}

export type Tone = "ivory" | "slate" | "dark" | "blue" | "green" | "red" | "amber" | "rubber" | "copper";

export function Housing({
  x, y, w, h, tone = "ivory", children, radius = 3,
}: { x: number; y: number; w: number; h: number; tone?: Tone; children?: ReactNode; radius?: number }) {
  const dark = tone === "dark" || tone === "rubber" || tone === "blue";
  return (
    <g>
      <rect x={x + 0.8} y={y + 1.4} width={w} height={h} rx={radius} fill="#07101c" opacity="0.45" />
      <rect x={x} y={y} width={w} height={h} rx={radius} fill={`url(#hw-${tone})`} stroke={dark ? "#162c43" : "#8295a6"} strokeWidth="1.1" />
      <path d={`M${x + 2.8} ${y + 1.3} H${x + w - 2.8}`} stroke="#fff" opacity={dark ? 0.3 : 0.76} strokeWidth="0.85" />
      <path d={`M${x + w - 1.2} ${y + 2.8} V${y + h - 3}`} stroke="#0b1724" opacity="0.22" strokeWidth="0.8" />
      {children}
    </g>
  );
}

export function Screw({ x, y, r = 2.1, copper = false, dark = false }: { x: number; y: number; r?: number; copper?: boolean; dark?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1.3} fill={dark ? "#111e2b" : "#94a3b2"} stroke={dark ? "#647689" : "#687b8c"} strokeWidth="0.65" />
      <SPlus x={x} y={y} r={r} copper={copper} />
    </g>
  );
}

export function Pin({ x, y, color, label, copper = false, dark = false, r = 1.9 }: { x: number; y: number; color?: string; label?: string; copper?: boolean; dark?: boolean; r?: number }) {
  return (
    <g>
      {label && <Ink x={x} y={y - r - 2.9} size={2.9} color={dark ? "#d3e2e9" : "#4f5e6d"}>{label}</Ink>}
      <Screw x={x} y={y} r={r} copper={copper} dark={dark} />
      {color && <circle cx={x + r + 1.2} cy={y + r + 0.6} r="0.85" fill={color} />}
    </g>
  );
}

export function Led({ x, y, active, color = "#4bd78b", r = 1.8 }: { x: number; y: number; active?: boolean; color?: string; r?: number }) {
  return (
    <g>
      {active && <circle cx={x} cy={y} r={r + 2.4} opacity="0.23" fill={color} className="ep-glow" />}
      <circle cx={x} cy={y} r={r + 0.55} fill="#172331" stroke="#93a3af" strokeWidth="0.5" />
      <circle cx={x} cy={y} r={r} fill={active ? color : "#788895"} />
      <circle cx={x - 0.45} cy={y - 0.55} r="0.5" fill="#fff" opacity={active ? 0.92 : 0.4} />
    </g>
  );
}

export function Display({ x, y, w, h, text, active, color = "#92ecca", sub }: { x: number; y: number; w: number; h: number; text: string; active?: boolean; color?: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1.5" fill="#1b3140" stroke="#849eaa" strokeWidth="0.7" />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx="0.8" fill="url(#hw-screen)" />
      <Ink x={x + w / 2} y={y + h * 0.66} size={Math.min(6.5, h * 0.53)} color={active ? color : "#658383"} weight={700}>{text}</Ink>
      {sub && <Ink x={x + w / 2} y={y + h - 0.4} size={2.7} color={active ? "#a8dfcf" : "#54716e"}>{sub}</Ink>}
      <path d={`M${x + 2} ${y + 1.5} H${x + w - 3}`} stroke="#fff" opacity="0.2" strokeWidth="0.5" />
    </g>
  );
}

export function Lens({ x, y, r, tint = "green", active }: { x: number; y: number; r: number; tint?: "green" | "red" | "blue" | "amber" | "yellow" | "white"; active?: boolean }) {
  const color = { green: "#42d277", red: "#f05a54", blue: "#489eff", amber: "#f6ad45", yellow: "#f0dd4f", white: "#f3f9ea" }[tint];
  const fill = tint === "white" ? "url(#hw-white-lens)" : `url(#hw-${tint})`;
  return (
    <g>
      {active && <circle cx={x} cy={y} r={r + 3.5} fill={color} opacity="0.25" className="ep-glow" />}
      <circle cx={x} cy={y} r={r + 2} fill="url(#g-metal)" stroke="#55697a" strokeWidth="0.95" />
      <circle cx={x} cy={y} r={r + 0.4} fill="#182b3b" />
      <circle cx={x} cy={y} r={r - 0.6} fill={fill} opacity={active ? 1 : 0.85} />
      <ellipse cx={x - r * 0.27} cy={y - r * 0.42} rx={r * 0.43} ry={r * 0.22} fill="#fff" opacity="0.55" />
      <path d={`M${x - r * 0.63} ${y + r * 0.42} Q${x} ${y + r * 0.88} ${x + r * 0.65} ${y + r * 0.42}`} stroke="#051b2a" opacity="0.27" strokeWidth="0.8" fill="none" />
    </g>
  );
}

export function FanBlades({ x, y, r, active, color = "#8193a2" }: { x: number; y: number; r: number; active?: boolean; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 2} fill="#1b2b38" stroke="#728597" strokeWidth="0.8" />
      <g className={active ? "ep-rotor-fast" : undefined} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={`M${x} ${y} Q${x - r * 0.1} ${y - r * 0.9} ${x + r * 0.55} ${y - r * 0.83} Q${x + r * 0.73} ${y - r * 0.17} ${x} ${y} Z`} transform={`rotate(${a} ${x} ${y})`} fill={color} stroke="#233a4e" strokeWidth="0.4" />
        ))}
      </g>
      <circle cx={x} cy={y} r={r * 0.18} fill="url(#g-metal)" stroke="#4d6474" strokeWidth="0.6" />
    </g>
  );
}

export function MeterFace({ x, y, r, active, label = "A" }: { x: number; y: number; r: number; active?: boolean; label?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 2} fill="url(#g-metal)" stroke="#718493" strokeWidth="1" />
      <circle cx={x} cy={y} r={r} fill="#f4f5ef" stroke="#8d9da4" strokeWidth="0.8" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = (Math.PI * (0.85 + i * 0.215));
        const x1 = x + Math.cos(a) * r * 0.68;
        const y1 = y + Math.sin(a) * r * 0.68;
        const x2 = x + Math.cos(a) * r * 0.83;
        const y2 = y + Math.sin(a) * r * 0.83;
        return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#3a4c59" strokeWidth="0.7" />;
      })}
      <path d={`M${x} ${y} L${x + (active ? r * 0.55 : -r * 0.5)} ${y - (active ? r * 0.43 : r * 0.45)}`} stroke="#dc4241" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={x} cy={y} r="1.1" fill="#324555" />
      <Ink x={x} y={y + r * 0.58} size={r * 0.46} color="#324758">{label}</Ink>
    </g>
  );
}

export function Foot({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} h8 l2 3 h-12 z`} fill="url(#hw-dark)" stroke="#263747" strokeWidth="0.7" />;
}