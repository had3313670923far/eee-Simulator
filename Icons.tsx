import { memo, type ReactNode } from "react";
import { STARTER_SIZE } from "../data/starDeltaLayout";

export type GlyphProps = {
  active?: boolean;
  running?: boolean;
  supplyActive?: boolean;
  levelStage?: number;
  contactClosed?: boolean;
  color?: string;
  on?: boolean;
  pressed?: boolean;
  tripped?: boolean;
  label?: string;
};

/* Shared gradients / filters (rendered once) */
export function GlyphDefs() {
  const lens = (id: string, a: string, b: string, c: string) => (
    <radialGradient id={id} cx="35%" cy="28%" r="80%">
      <stop offset="0%" stopColor={a} />
      <stop offset="48%" stopColor={b} />
      <stop offset="100%" stopColor={c} />
    </radialGradient>
  );
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        {lens("lg-red", "#fecaca", "#ef4444", "#7f1d1d")}
        {lens("lg-green", "#bbf7d0", "#22c55e", "#14532d")}
        {lens("lg-blue", "#bfdbfe", "#3b82f6", "#1e3a8a")}
        {lens("lg-amber", "#fed7aa", "#f97316", "#9a3412")}
        {lens("lg-yellow", "#fef9c3", "#eab308", "#854d0e")}
        {lens("lg-white", "#ffffff", "#cbd5e1", "#64748b")}
        {lens("lg-cyan", "#cffafe", "#06b6d4", "#155e75")}
        <linearGradient id="g-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="45%" stopColor="#aeb9cc" />
          <stop offset="100%" stopColor="#dbe3ef" />
        </linearGradient>
        <linearGradient id="g-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="g-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1324" />
          <stop offset="100%" stopColor="#131f3a" />
        </linearGradient>
        <linearGradient id="g-copper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6b35b" />
          <stop offset="100%" stopColor="#a85a16" />
        </linearGradient>
        <radialGradient id="lg-brass" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#f7dfaf" />
          <stop offset="52%" stopColor="#d09a45" />
          <stop offset="100%" stopColor="#6e4f1a" />
        </radialGradient>
        <linearGradient id="g-mcb-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcfdfe" />
          <stop offset="100%" stopColor="#d5dbe2" />
        </linearGradient>
        <linearGradient id="g-mcb-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4e6ea" />
          <stop offset="100%" stopColor="#c2c8d0" />
        </linearGradient>
        <linearGradient id="g-mcb-bot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b0b8c2" />
          <stop offset="100%" stopColor="#7c8693" />
        </linearGradient>
        <linearGradient id="g-chamber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3f5f8" />
          <stop offset="100%" stopColor="#c4cbd4" />
        </linearGradient>
        <linearGradient id="g-orange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9e34" />
          <stop offset="100%" stopColor="#dd6c07" />
        </linearGradient>
        <linearGradient id="rr-ivory" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="42%" stopColor="#e9edf0" />
          <stop offset="100%" stopColor="#b8c1cc" />
        </linearGradient>
        <linearGradient id="rr-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f7f7" />
          <stop offset="52%" stopColor="#dce1e5" />
          <stop offset="100%" stopColor="#9aa7b5" />
        </linearGradient>
        <linearGradient id="rr-shadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4b596b" />
          <stop offset="48%" stopColor="#273344" />
          <stop offset="100%" stopColor="#0d1523" />
        </linearGradient>
        <linearGradient id="rr-navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#253f58" />
          <stop offset="50%" stopColor="#11293f" />
          <stop offset="100%" stopColor="#081a2d" />
        </linearGradient>
        <linearGradient id="rr-clear" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e3faff" stopOpacity="0.93" />
          <stop offset="44%" stopColor="#82b7ca" stopOpacity="0.67" />
          <stop offset="100%" stopColor="#24536b" stopOpacity="0.87" />
        </linearGradient>
        <linearGradient id="rr-copper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe5a9" />
          <stop offset="38%" stopColor="#dc9e48" />
          <stop offset="100%" stopColor="#784524" />
        </linearGradient>
        <linearGradient id="rr-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff4b0" />
          <stop offset="48%" stopColor="#f2c342" />
          <stop offset="100%" stopColor="#ba771d" />
        </linearGradient>
        <linearGradient id="hw-ivory" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="48%" stopColor="#e4eaf0" />
          <stop offset="100%" stopColor="#b7c2cf" />
        </linearGradient>
        <linearGradient id="hw-slate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cfdae4" />
          <stop offset="50%" stopColor="#8b9baa" />
          <stop offset="100%" stopColor="#536677" />
        </linearGradient>
        <linearGradient id="hw-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#576677" />
          <stop offset="45%" stopColor="#263849" />
          <stop offset="100%" stopColor="#101c2a" />
        </linearGradient>
        <linearGradient id="hw-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#75bfed" />
          <stop offset="48%" stopColor="#246baf" />
          <stop offset="100%" stopColor="#12365c" />
        </linearGradient>
        <linearGradient id="hw-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9de5aa" />
          <stop offset="48%" stopColor="#2b9460" />
          <stop offset="100%" stopColor="#154c3e" />
        </linearGradient>
        <linearGradient id="hw-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffad99" />
          <stop offset="48%" stopColor="#d33f41" />
          <stop offset="100%" stopColor="#72222f" />
        </linearGradient>
        <linearGradient id="hw-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe6a8" />
          <stop offset="50%" stopColor="#d7922d" />
          <stop offset="100%" stopColor="#855127" />
        </linearGradient>
        <linearGradient id="hw-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff9c0" />
          <stop offset="50%" stopColor="#eccd3e" />
          <stop offset="100%" stopColor="#958024" />
        </linearGradient>
        <linearGradient id="hw-copper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffcf88" />
          <stop offset="48%" stopColor="#bd7238" />
          <stop offset="100%" stopColor="#70442c" />
        </linearGradient>
        <linearGradient id="hw-rubber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#57616b" />
          <stop offset="50%" stopColor="#272f38" />
          <stop offset="100%" stopColor="#0e1823" />
        </linearGradient>
        <linearGradient id="hw-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d2f1fa" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#91b6c8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#234d63" stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id="hw-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03121b" />
          <stop offset="100%" stopColor="#164151" />
        </linearGradient>
        <radialGradient id="hw-white-lens" cx="32%" cy="23%" r="75%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="45%" stopColor="#eff6db" />
          <stop offset="100%" stopColor="#8a9ba2" />
        </radialGradient>
        <pattern id="hw-brush" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 1H4 M0 3H4" stroke="#fff" strokeOpacity="0.14" strokeWidth="0.35" />
        </pattern>
        <filter id="ep-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ---------- primitives ---------- */

export function S({ x, y, r = 2.3 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="url(#g-metal)" stroke="#6b7891" strokeWidth={0.6} />
      <line x1={x - r * 0.6} y1={y} x2={x + r * 0.6} y2={y} stroke="#5b6780" strokeWidth={0.65} />
      <line x1={x} y1={y - r * 0.6} x2={x} y2={y + r * 0.6} stroke="#5b6780" strokeWidth={0.65} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.2} fill="#ffffff" opacity={0.85} />
    </g>
  );
}

/** Phillips (+) metal screw head like real breaker terminals */
export function SPlus({ x, y, r = 2.4, copper }: { x: number; y: number; r?: number; copper?: boolean }) {
  const face = copper ? "url(#lg-brass)" : "url(#g-metal)";
  const edge = copper ? "#5e4517" : "#74839e";
  const slot = copper ? "#3a2c10" : "#6b7891";
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={face} stroke={edge} strokeWidth={0.7} />
      <line x1={x - r * 0.6} y1={y} x2={x + r * 0.6} y2={y} stroke={slot} strokeWidth={0.8} />
      <line x1={x} y1={y - r * 0.6} x2={x} y2={y + r * 0.6} stroke={slot} strokeWidth={0.8} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.22} fill="#fff" opacity={0.7} />
    </g>
  );
}

export function Dot({ x, y, c }: { x: number; y: number; c: string }) {
  return <circle cx={x} cy={y} r={1.9} fill={c} stroke="#0b1220" strokeWidth={0.5} />;
}

export function Lens({
  x,
  y,
  r,
  id,
  solid,
  active,
}: {
  x: number;
  y: number;
  r: number;
  id: string;
  solid: string;
  active?: boolean;
}) {
  return (
    <g>
      {active && <circle className="ep-glow" cx={x} cy={y} r={r + 3.2} fill={solid} opacity={0.22} />}
      <circle cx={x} cy={y} r={r + 2.4} fill="#0b1220" stroke="#475569" strokeWidth={1.1} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <ellipse cx={x - r * 0.34} cy={y - r * 0.4} rx={r * 0.42} ry={r * 0.24} fill="#fff" opacity={0.5} />
    </g>
  );
}

export function HexNut({ x, y, r, fill = "#8fa0b8" }: { x: number; y: number; r: number; fill?: string }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} stroke="#5b6a86" strokeWidth={1} />;
}

export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export function Screen({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1.5} fill="url(#g-screen)" stroke="#334155" strokeWidth={0.8} />
      <line x1={x + 2} y1={y + 2.4} x2={x + w - 3} y2={y + 2.4} stroke="#22d3ee" strokeWidth={0.7} opacity={0.7} />
    </g>
  );
}

/* ---------- SOURCES ---------- */

function Gen() {
  return (
    <g>
      <rect x={9} y={8} width={46} height={48} rx={5} fill="#e9eef5" stroke="#8fa0b8" strokeWidth={1.2} />
      <rect x={9} y={8} width={46} height={7} rx={5} fill="#f5f8fc" />
      <Screen x={14} y={13} w={21} h={10} />
      <circle cx={39} cy={18} r={2.1} fill="#a855f7" stroke="#6b21a8" />
      <circle cx={45.5} cy={18} r={2.1} fill="#ef4444" stroke="#991b1b" />
      <circle cx={52} cy={18} r={2.1} fill="#22c55e" stroke="#166534" />
      <rect x={14} y={27} width={36} height={12} rx={2} fill="#dbe3ee" stroke="#9aa9c0" />
      <circle cx={20} cy={33} r={3.2} fill="#b9c6d8" stroke="#74839e" />
      <circle cx={31} cy={33} r={3.2} fill="#b9c6d8" stroke="#74839e" />
      <circle cx={42} cy={33} r={3.2} fill="#b9c6d8" stroke="#74839e" />
      <rect x={14} y={42} width={36} height={9} rx={2} fill="#d6dde9" stroke="#9aa9c0" />
      <Dot x={19} y={46.5} c="#ef4444" />
      <Dot x={27} y={46.5} c="#eab308" />
      <Dot x={35} y={46.5} c="#3b82f6" />
      <Dot x={43} y={46.5} c="#16a34a" />
    </g>
  );
}

function GenPhoto() {
  return (
    <g>
      <rect x={8} y={8} width={48} height={48} rx={5} fill="#18233c" stroke="#2c3c63" strokeWidth={1.2} />
      <rect x={8} y={8} width={48} height={12} rx={5} fill="#223052" />
      <rect x={8} y={14} width={48} height={6} fill="#223052" />
      <circle cx={14} cy={14} r={1.6} fill="#f87171" />
      <circle cx={20} cy={14} r={1.6} fill="#fbbf24" />
      <circle cx={26} cy={14} r={1.6} fill="#34d399" />
      <rect x={16} y={26} width={26} height={16} rx={4} fill="#37463a" stroke="#1f2b22" />
      <circle cx={41} cy={34} r={7} fill="#1f2937" stroke="#0b1220" />
      <circle cx={41} cy={34} r={4.4} fill="#475569" />
      <rect x={20} y={20} width={14} height={7} rx={2} fill="#4b5f50" />
      <rect x={14} y={45} width={36} height={7} rx={2} fill="#0f1930" stroke="#27375c" />
      <circle cx={20} cy={48.5} r={1.8} fill="#ef4444" />
      <circle cx={28} cy={48.5} r={1.8} fill="#eab308" />
      <circle cx={36} cy={48.5} r={1.8} fill="#3b82f6" />
      <circle cx={44} cy={48.5} r={1.8} fill="#22c55e" />
    </g>
  );
}

function Src3() {
  return (
    <g>
      <rect x={10} y={8} width={44} height={48} rx={5} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.2} />
      <Screen x={15} y={12} w={34} h={9} />
      <circle cx={19} cy={31} r={7.5} fill="#0b1220" stroke="#475569" />
      <circle cx={19} cy={31} r={5.4} fill="url(#lg-red)" />
      <circle cx={32} cy={31} r={7.5} fill="#0b1220" stroke="#475569" />
      <circle cx={32} cy={31} r={5.4} fill="url(#lg-yellow)" />
      <circle cx={45} cy={31} r={7.5} fill="#0b1220" stroke="#475569" />
      <circle cx={45} cy={31} r={5.4} fill="url(#lg-blue)" />
      <rect x={14} y={43} width={36} height={8} rx={2} fill="#c9f5d6" stroke="#86efac" />
      <Dot x={20} y={47} c="#ef4444" />
      <Dot x={32} y={47} c="#eab308" />
      <Dot x={44} y={47} c="#3b82f6" />
    </g>
  );
}

function RoundPlate({ lens, solid, label }: { lens: string; solid: string; label: string }) {
  return (
    <g>
      <rect x={13} y={8} width={38} height={48} rx={5} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.2} />
      <Lens x={32} y={31} r={11} id={lens} solid={solid} />
      <text x={32} y={31} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={10} fontWeight={700} style={{ fontFamily: MONO }}>
        {label}
      </text>
      <rect x={18} y={47} width={28} height={5} rx={1.5} fill="#d8e0ec" stroke="#a6b4ca" />
    </g>
  );
}

/* ---------- PROTECTION ---------- */

function Mcb({ poles, color, on = true }: { poles: number; color?: string; on?: boolean }) {
  const brand = color || "#f97316";
  const four = poles === 4;
  const mw = four ? 13 : 15;
  const gap = four ? 1 : 1.4;
  const total = mw * poles + gap * (poles - 1);
  const x0 = (64 - total) / 2;
  const rating = poles === 1 ? "C10" : poles === 2 ? "C16" : "C32";
  const yT = on ? 37.6 : 42.6;
  const yB = on ? 43.4 : 48.4;

  const handle = (cx: number) => (
    <g>
      <path
        d={`M ${cx - 5.8} ${yT}
            L ${cx + 5.8} ${yT}
            Q ${cx + 6.8} ${yT} ${cx + 6.8} ${yT + 1.2}
            L ${cx + 7.2} ${yB - 1.4}
            Q ${cx + 7.2} ${yB} ${cx + 6.2} ${yB}
            L ${cx - 6.2} ${yB}
            Q ${cx - 7.2} ${yB} ${cx - 7.2} ${yB - 1.4}
            L ${cx - 6.8} ${yT + 1.2}
            Q ${cx - 6.8} ${yT} ${cx - 5.8} ${yT} Z`}
        fill={brand}
        stroke={on ? "#b85c06" : "#9c4d05"}
        strokeWidth={0.5}
      />
      <path
        d={`M ${cx - 4.6} ${yT + 1} L ${cx + 4.6} ${yT + 1} L ${cx + 5} ${yT + 2.6} L ${cx - 5} ${yT + 2.6} Z`}
        fill="#ffffff"
        opacity={0.32}
      />
    </g>
  );

  return (
    <g>
      {Array.from({ length: poles }).map((_, i) => {
        const x = x0 + i * (mw + gap);
        const cx = x + mw / 2;
        return (
          <g key={i}>
            {/* body */}
            <rect x={x} y={6} width={mw} height={52} rx={2.4} fill="url(#g-mcb-top)" stroke="#a6b0bc" strokeWidth={0.7} />
            {/* brass top screw */}
            <SPlus x={cx} y={12.6} r={3.1} copper />
            {/* rating plate */}
            <rect x={x} y={22} width={mw} height={11.6} fill="url(#g-mcb-mid)" />
            {/* switch chamber */}
            <rect x={x + 0.9} y={33.6} width={mw - 1.8} height={16} rx={2} fill="#8b95a1" stroke="#68717d" strokeWidth={0.5} />
            <rect x={x + 1.5} y={34.2} width={mw - 3} height={14.8} rx={1.6} fill="url(#g-chamber)" />
            {/* contact ring */}
            <circle cx={cx} cy={36} r={1.9} fill="#f7f9fb" stroke="#98a1ac" strokeWidth={0.8} />
            {/* orange toggle */}
            {handle(cx)}
            {/* I slot when OFF */}
            {!on && (
              <g>
                <rect x={cx - 3.4} y={46.9} width={6.8} height={3.2} rx={0.8} fill="#a6afba" stroke="#7c8590" strokeWidth={0.4} />
                <line x1={cx} y1={47.5} x2={cx} y2={49.6} stroke="#39404a" strokeWidth={1} />
              </g>
            )}
            {/* bottom terminal plate + brass screw */}
            <rect x={x} y={49.6} width={mw} height={8.4} fill="url(#g-mcb-bot)" />
            <SPlus x={cx} y={53.6} r={3} copper />
            {/* module seam */}
            {i > 0 && <line x1={x - gap / 2} y1={6.6} x2={x - gap / 2} y2={57.4} stroke="#00000022" strokeWidth={0.5} />}
          </g>
        );
      })}
      {/* continuous orange band */}
      <rect x={x0} y={20} width={total} height={2.2} fill={brand} />
      {/* rating printed on the first module */}
      <text x={x0 + 1.8} y={30.2} fontSize={5.1} fontWeight={800} fill="#3a424d" style={{ fontFamily: MONO }}>
        {rating}
      </text>
    </g>
  );
}

function Mccb({ poles }: { poles: 3 | 4 }) {
  const xs = poles === 3 ? [15, 32, 49] : [12, 25.3, 38.6, 52];
  return (
    <g>
      <rect x={8} y={10} width={48} height={44} rx={5} fill="#232c3e" stroke="#0d1320" strokeWidth={1.4} />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={15.5} r={2.6} fill="#475569" stroke="#0b1220" />
      ))}
      <rect x={16} y={20} width={32} height={8} rx={1.5} fill="#101828" stroke="#334155" />
      <line x1={19} y1={24} x2={45} y2={24} stroke="#22d3ee" strokeWidth={0.8} opacity={0.6} />
      <rect x={27} y={30} width={10} height={12} rx={2} fill="#dc2626" stroke="#7f1d1d" />
      <circle cx={32} cy={36} r={2.4} fill="#fecaca" />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={48} r={2.6} fill="#475569" stroke="#0b1220" />
        </g>
      ))}
      <circle cx={51} cy={40} r={1.8} fill="#22c55e" />
    </g>
  );
}

function Rccb({ poles }: { poles: 2 | 4 }) {
  const mw = 12;
  const gap = 2;
  const total = mw * poles + gap * (poles - 1);
  const x0 = (64 - total) / 2;
  return (
    <g>
      {Array.from({ length: poles }).map((_, i) => {
        const x = x0 + i * (mw + gap);
        return (
          <g key={i}>
            <rect x={x} y={9} width={mw} height={46} rx={2} fill="#eef2f8" stroke="#8fa0b8" />
            <S x={x + mw / 2} y={14} r={2} />
            <rect x={x + 2.6} y={30} width={mw - 5.2} height={12} rx={2} fill="#94a3b8" stroke="#64748b" />
            <S x={x + mw / 2} y={50.5} r={2} />
            <rect x={x} y={46.5} width={mw} height={8.5} rx={2} fill="#e2e8f0" />
          </g>
        );
      })}
      <circle cx={32} cy={22} r={5.4} fill="#cbd5e1" stroke="#64748b" strokeWidth={1.1} />
      <text x={32} y={22.4} textAnchor="middle" dominantBaseline="central" fontSize={7} fontWeight={700} fill="#334155" style={{ fontFamily: MONO }}>
        T
      </text>
    </g>
  );
}

function EBreaker() {
  return (
    <g>
      <rect x={12} y={9} width={40} height={46} rx={4} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.1} />
      <rect x={16} y={13} width={32} height={13} rx={1.5} fill="#0b1220" stroke="#334155" />
      <text x={32} y={20} textAnchor="middle" fontSize={7} fill="#f87171" fontWeight={700} style={{ fontFamily: MONO }}>
        8.8.8.8
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={17 + i * 8.4} y={29} width={6.4} height={6} rx={1} fill={["#ef4444", "#94a3b8", "#94a3b8", "#eab308"][i]} stroke="#64748b" />
      ))}
      <rect x={16} y={38} width={32} height={8} rx={1.5} fill="#d3dceb" />
      <line x1={19} y1={42} x2={45} y2={42} stroke="#8fa0b8" strokeWidth={0.8} strokeDasharray="2 2" />
      <rect x={16} y={47} width={32} height={5} rx={1.5} fill="#c9f5d6" />
      <S x={17} y={11} r={1.4} />
      <S x={47} y={11} r={1.4} />
    </g>
  );
}

function Spd() {
  return (
    <g>
      <rect x={24} y={9} width={16} height={46} rx={3} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.1} />
      <S x={32} y={13} r={2} />
      <rect x={27} y={18} width={10} height={18} rx={1.5} fill="#1f2937" />
      <path d="M32 20 l-3.4 6 h2.6 l-1.4 6 4 -7 h-2.8 z" fill="#facc15" />
      <rect x={27} y={39} width={10} height={7} rx={1.5} fill="#16a34a" />
      <circle cx={32} cy={42.5} r={2.2} fill="#ef4444" stroke="#7f1d1d" />
      <rect x={27} y={48} width={10} height={5} rx={1.5} fill="#d3dceb" />
      <S x={32} y={50.6} r={1.6} />
    </g>
  );
}

function Fuse() {
  return (
    <g>
      <rect x={26} y={9} width={12} height={46} rx={3} fill="#eef2f8" stroke="#8fa0b8" />
      <rect x={26} y={9} width={12} height={7} rx={3} fill="#ef4444" />
      <rect x={26} y={48} width={12} height={7} rx={3} fill="#ef4444" />
      <rect x={27.5} y={18} width={9} height={28} rx={2} fill="#dbeafe" stroke="#93a4c2" />
      <path d="M30 19 v10 l4 4 v12" stroke="#b91c1c" strokeWidth={1} fill="none" />
      <circle cx={32} cy={13} r={1.5} fill="#fecaca" />
      <circle cx={32} cy={51} r={1.5} fill="#fecaca" />
    </g>
  );
}

function Overload({ tripped }: { tripped?: boolean }) {
  return (
    <g>
      {tripped && <circle className="ep-glow" cx={18.5} cy={26.5} r={5.5} fill="#ef4444" opacity={0.35} />}
      {/* NC auxiliary contact 95-96 plate */}
      <rect x={4} y={26} width={8.5} height={18} rx={1.5} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={0.9} />
      <circle cx={7.5} cy={31} r={1.7} fill="#b9c6d8" stroke="#74839e" strokeWidth={0.7} />
      <circle cx={7.5} cy={41} r={1.7} fill={tripped ? "#f87171" : "#b9c6d8"} stroke={tripped ? "#b91c1c" : "#74839e"} strokeWidth={0.7} />
      <text x={8.2} y={27.6} fontSize={3.4} textAnchor="middle" fill="#64748b" style={{ fontFamily: MONO }}>
        95
      </text>
      <text x={8.2} y={47.4} fontSize={3.4} textAnchor="middle" fill="#64748b" style={{ fontFamily: MONO }}>
        96
      </text>
      <rect x={11} y={14} width={42} height={38} rx={4} fill="#cdd6e4" stroke="#7e8da8" strokeWidth={1.1} />
      <Dot x={17} y={12} c="#f97316" />
      <Dot x={27} y={12} c="#f97316" />
      <Dot x={37} y={12} c="#f97316" />
      <circle cx={40} cy={30} r={9} fill="#334155" stroke="#1f293b" />
      <line
        x1={40}
        y1={30}
        x2={tripped ? 34.5 : 46}
        y2={tripped ? 35 : 25}
        stroke={tripped ? "#f87171" : "#e2e8f0"}
        strokeWidth={1.6}
      />
      <rect x={15} y={24} width={7} height={5} rx={1} fill={tripped ? "#ef4444" : "#3b82f6"} stroke={tripped ? "#7f1d1d" : "none"} />
      <rect x={15} y={32} width={7} height={5} rx={1} fill="#f97316" />
      <rect x={15} y={42} width={34} height={6} rx={1.5} fill="#b9c6d8" />
      <Dot x={20} y={45} c="#16a34a" />
      <Dot x={32} y={45} c="#16a34a" />
      <Dot x={44} y={45} c="#16a34a" />
    </g>
  );
}

function PhaseFail() {
  return (
    <g>
      <rect x={14} y={10} width={36} height={44} rx={4} fill="#eef2f8" stroke="#8fa0b8" />
      <rect x={18} y={14} width={28} height={12} rx={1.5} fill="#0b1220" />
      <circle cx={24} cy={20} r={2.4} fill="#ef4444" />
      <circle cx={32} cy={20} r={2.4} fill="#eab308" />
      <circle cx={40} cy={20} r={2.4} fill="#3b82f6" />
      <rect x={19} y={30} width={26} height={10} rx={2} fill="#d3dceb" />
      <circle cx={25} cy={35} r={2.2} fill="#22c55e" />
      <circle cx={39} cy={35} r={2.2} fill="#ef4444" />
      <S x={18} y={13} r={1.5} />
      <S x={46} y={13} r={1.5} />
      <rect x={18} y={44} width={28} height={6} rx={1.5} fill="#c9f5d6" />
    </g>
  );
}

function PhaseSelector() {
  return (
    <g>
      <rect x={10} y={10} width={44} height={44} rx={4} fill="#1f2937" stroke="#0b1220" strokeWidth={1.2} />
      <rect x={15} y={14} width={34} height={9} rx={1.5} fill="#0b1220" stroke="#334155" />
      <line x1={18} y1={18.5} x2={34} y2={18.5} stroke="#22d3ee" strokeWidth={0.8} />
      <circle cx={32} cy={35} r={11} fill="#374151" stroke="#111827" strokeWidth={1.4} />
      <circle cx={32} cy={35} r={8} fill="#1f2937" />
      <line x1={32} y1={35} x2={39} y2={29} stroke="#f8fafc" strokeWidth={2} />
      <circle cx={32} cy={35} r={1.8} fill="#94a3b8" />
      <S x={15} y={49} r={1.6} />
      <S x={49} y={49} r={1.6} />
    </g>
  );
}

/* ---------- CONTACTORS / RELAYS ---------- */

function Contactor({ poles, active, dark }: { poles: number; active?: boolean; dark?: boolean }) {
  const mw = 11;
  const gap = 2;
  const total = mw * poles + gap * (poles - 1);
  const x0 = (64 - total) / 2;
  const phase = ["#ef4444", "#eab308", "#3b82f6", "#16a34a"];
  const body = dark ? "#2c364b" : "#e9eef5";
  const edge = dark ? "#141c2e" : "#8fa0b8";
  const plate = dark ? "#1f283c" : "#f8fafc";
  const plateEdge = dark ? "#3a4663" : "#a6b4ca";
  return (
    <g>
      {poles === 3 && (
        <g>
          {/* auxiliary contact block (13-14 NO, 11-12 NC) */}
          <rect x={4.5} y={19} width={7.5} height={33} rx={1.5} fill={plate} stroke={plateEdge} strokeWidth={0.9} />
          {[26, 34, 42, 49.5].map((y, i) => (
            <g key={y}>
              <circle cx={8.3} cy={y} r={1.7} fill={dark ? "#3a4663" : "#b9c6d8"} stroke={plateEdge} strokeWidth={0.7} />
              <text x={8.3} y={i < 2 ? y - 3.4 : y - 3.4} fontSize={3.4} textAnchor="middle" fill={dark ? "#8ea0c0" : "#64748b"} style={{ fontFamily: MONO }}>
                {["13", "14", "11", "12"][i]}
              </text>
            </g>
          ))}
          {/* coil block A1/A2 */}
          <rect x={51} y={21} width={9} height={22} rx={1.5} fill={plate} stroke={plateEdge} strokeWidth={0.9} />
          <circle cx={59} cy={28} r={1.8} fill={dark ? "#3a4663" : "#b9c6d8"} stroke={plateEdge} strokeWidth={0.7} />
          <circle cx={59} cy={40} r={1.8} fill={dark ? "#3a4663" : "#b9c6d8"} stroke={plateEdge} strokeWidth={0.7} />
          <text x={55.5} y={34.6} fontSize={3.6} textAnchor="middle" fill={active ? "#22c55e" : dark ? "#8ea0c0" : "#64748b"} style={{ fontFamily: MONO }}>
            A1
          </text>
          <text x={55.5} y={47} fontSize={3.6} textAnchor="middle" fill={active ? "#22c55e" : dark ? "#8ea0c0" : "#64748b"} style={{ fontFamily: MONO }}>
            A2
          </text>
        </g>
      )}
      {poles === 2 && (
        <g>
          <rect x={51} y={21} width={9} height={22} rx={1.5} fill={plate} stroke={plateEdge} strokeWidth={0.9} />
          <circle cx={59} cy={28} r={1.8} fill={dark ? "#3a4663" : "#b9c6d8"} stroke={plateEdge} strokeWidth={0.7} />
          <circle cx={59} cy={40} r={1.8} fill={dark ? "#3a4663" : "#b9c6d8"} stroke={plateEdge} strokeWidth={0.7} />
        </g>
      )}
      {poles === 4 && (
        <g>
          <circle cx={14} cy={56.5} r={1.9} fill={dark ? "#3a4663" : "#b9c6d8"} stroke={plateEdge} />
          <circle cx={50} cy={56.5} r={1.9} fill={dark ? "#3a4663" : "#b9c6d8"} stroke={plateEdge} />
        </g>
      )}
      {Array.from({ length: poles }).map((_, i) => {
        const x = x0 + i * (mw + gap);
        return (
          <g key={i}>
            <rect x={x} y={10} width={mw} height={44} rx={2} fill={body} stroke={edge} />
            <rect x={x} y={10} width={mw} height={7} rx={2} fill={dark ? "#35415a" : "#f4f7fb"} />
            <rect x={x} y={10} width={mw} height={2} fill={phase[i % 4]} />
            <S x={x + mw / 2} y={13.6} r={1.9} />
            <rect x={x + 1.4} y={24} width={mw - 2.8} height={11} rx={1} fill={plate} stroke={plateEdge} />
            {active && <circle className="ep-glow" cx={x + mw / 2} cy={29.5} r={2} fill="#22c55e" />}
            <rect x={x} y={45} width={mw} height={9} rx={2} fill={dark ? "#1c2536" : "#c9f5d6"} />
            <S x={x + mw / 2} y={49.4} r={1.9} />
          </g>
        );
      })}
      <rect x={x0 + total / 2 - 4} y={40} width={8} height={3.4} rx={1} fill={active ? "#22c55e" : "#60a5fa"} stroke={active ? "#15803d" : "#2563eb"} />
    </g>
  );
}

function Relay({ active }: GlyphProps) {
  return (
    <g>
      <rect x={18} y={30} width={28} height={19} rx={2.5} fill="#d2dae8" stroke="#8fa0b8" />
      <S x={21.5} y={33.5} r={1.7} />
      <S x={42.5} y={33.5} r={1.7} />
      <S x={21.5} y={45.5} r={1.7} />
      <S x={42.5} y={45.5} r={1.7} />
      <rect x={20} y={12} width={24} height={22} rx={2.5} fill="#f8fafc" stroke="#8fa0b8" strokeWidth={1.1} />
      <rect x={22.5} y={14.5} width={8} height={5} rx={1} fill="#f59e0b" stroke="#b45309" />
      <rect x={33.5} y={14.5} width={8} height={5} rx={1} fill="#f59e0b" stroke="#b45309" />
      <circle className={active ? "ep-glow" : undefined} cx={26} cy={24} r={2} fill={active ? "#22c55e" : "#94a3b8"} />
      <circle cx={38} cy={24} r={2} fill="#ef4444" />
      <rect x={24} y={27.5} width={16} height={4} rx={1} fill="#e2e8f0" />
    </g>
  );
}

function Timer({ mode, active }: { mode: "ON" | "OFF"; active?: boolean }) {
  return (
    <g>
      <rect x={14} y={10} width={36} height={44} rx={4} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.1} />
      <rect x={18} y={13} width={28} height={12} rx={1.5} fill="#0b1220" stroke="#334155" />
      <text x={32} y={19.5} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={mode === "ON" ? "#4ade80" : "#f87171"} style={{ fontFamily: MONO }}>
        {mode === "ON" ? "ON  05s" : "OFF 10s"}
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={18 + i * 7.2} y={28} width={5.6} height={5.4} rx={1} fill={["#22c55e", "#ef4444", "#94a3b8", "#94a3b8"][i]} stroke="#64748b" />
      ))}
      <circle className={active ? "ep-glow" : undefined} cx={22} cy={39} r={2.2} fill={active ? "#22c55e" : "#cbd5e1"} stroke="#64748b" />
      <rect x={28} y={36.5} width={18} height={6} rx={1.5} fill="#d3dceb" />
      <S x={18} y={12.5} r={1.4} />
      <S x={46} y={12.5} r={1.4} />
      <rect x={18} y={46} width={28} height={5} rx={1.5} fill="#c9f5d6" />
    </g>
  );
}

/* ---------- AUTOMATION ---------- */

function LogoBody({ w, screen, label, extra }: { w: number; screen: boolean; label: string; extra?: ReactNode }) {
  const x = (64 - w) / 2;
  const termCount = Math.max(3, Math.round(w / 9));
  return (
    <g>
      <rect x={x} y={12} width={w} height={40} rx={3.5} fill="#2a3449" stroke="#11192b" strokeWidth={1.2} />
      {Array.from({ length: termCount }).map((_, i) => (
        <rect key={`t${i}`} x={x + 4 + i * ((w - 8) / termCount)} y={13.5} width={5} height={5} rx={1} fill="#475569" stroke="#1f2937" />
      ))}
      {Array.from({ length: termCount }).map((_, i) => (
        <rect key={`b${i}`} x={x + 4 + i * ((w - 8) / termCount)} y={45.5} width={5} height={5} rx={1} fill="#475569" stroke="#1f2937" />
      ))}
      {screen ? (
        <g>
          <rect x={x + 5} y={21} width={w * 0.46} height={11} rx={1.5} fill="#04121a" stroke="#155e75" />
          <text x={x + 5 + (w * 0.46) / 2} y={26.5} textAnchor="middle" fontSize={5.6} fontWeight={700} fill="#22d3ee" style={{ fontFamily: MONO }}>
            LOGO!
          </text>
        </g>
      ) : (
        <rect x={x + 5} y={21} width={w * 0.4} height={10} rx={1.5} fill="#222d42" stroke="#3a4663" />
      )}
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <rect key={`k${r}${c}`} x={x + w - 16 + c * 7.5} y={21 + r * 7} width={5.6} height={5.6} rx={1.2} fill="#3a4663" stroke="#1f2937" />
        ))
      )}
      <circle cx={x + 9} cy={38} r={1.7} fill="#22c55e" />
      {extra}
      <text x={x + w / 2} y={40} textAnchor="middle" fontSize={5.6} fill="#8ea0c0" style={{ fontFamily: MONO }}>
        {label}
      </text>
    </g>
  );
}

function Vfd() {
  return (
    <g>
      <rect x={12} y={9} width={40} height={46} rx={4} fill="#1c2536" stroke="#0b1220" strokeWidth={1.2} />
      <rect x={16} y={13} width={32} height={11} rx={1.5} fill="#04121a" stroke="#155e75" />
      <text x={32} y={19} textAnchor="middle" fontSize={7} fontWeight={700} fill="#22d3ee" style={{ fontFamily: MONO }}>
        50.0Hz
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={16 + i * 8.4} y={27} width={6.4} height={5} rx={1} fill="#3a4663" stroke="#1f2937" />
      ))}
      <circle cx={25} cy={41} r={7} fill="#16a34a" stroke="#065f46" />
      <line x1={25} y1={41} x2={29.5} y2={37} stroke="#fff" strokeWidth={1.4} />
      <rect x={36} y={36} width={12} height={9} rx={1.5} fill="#222d42" />
      <rect x={15} y={48} width={34} height={5} rx={1.5} fill="#14532d" />
      <Dot x={21} y={50.5} c="#4ade80" />
      <Dot x={32} y={50.5} c="#4ade80" />
      <Dot x={43} y={50.5} c="#4ade80" />
    </g>
  );
}

function Psu() {
  return (
    <g>
      <rect x={14} y={10} width={36} height={44} rx={4} fill="#232d42" stroke="#0d1424" strokeWidth={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={17 + i * 8} y={12} width={6} height={5} rx={1} fill="#475569" />
      ))}
      <rect x={18} y={20} width={28} height={11} rx={1.5} fill="#1a0606" stroke="#7f1d1d" />
      <text x={32} y={26} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#f87171" style={{ fontFamily: MONO }}>
        24V
      </text>
      <rect x={18} y={34} width={28} height={9} rx={1.5} fill="#2f3b55" />
      <line x1={21} y1={38.5} x2={43} y2={38.5} stroke="#5b6b8c" strokeWidth={0.8} strokeDasharray="2 2" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={17 + i * 8} y={47} width={6} height={5} rx={1} fill="#475569" />
      ))}
    </g>
  );
}

/* ---------- BUTTONS / SWITCHES ---------- */

function PB({
  lens,
  solid,
  dual,
  pressed,
}: {
  lens: string;
  solid: string;
  dual?: [string, string, string, string];
  pressed?: boolean;
}) {
  if (dual) {
    return (
      <g>
        <rect x={11} y={13} width={42} height={40} rx={6} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.2} />
        <g transform={pressed ? "translate(0 1.6)" : undefined}>
          <Lens x={24} y={31} r={8.5} id={dual[0]} solid={dual[1]} />
          <Lens x={40} y={31} r={8.5} id={dual[2]} solid={dual[3]} />
        </g>
        <circle cx={49} cy={19} r={2.2} fill="#ef4444" stroke="#991b1b" />
        <S x={15.5} y={17.5} r={1.6} />
        <S x={48.5} y={48.5} r={1.6} />
      </g>
    );
  }
  return (
    <g>
      <rect x={12} y={13} width={40} height={40} rx={6} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.2} />
      <g transform={pressed ? "translate(0 2)" : undefined}>
        <Lens x={32} y={32} r={12} id={lens} solid={solid} />
      </g>
      {pressed && <circle className="ep-glow" cx={32} cy={34} r={13} fill={solid} opacity={0.25} />}
      <S x={16.5} y={17.5} r={1.7} />
      <S x={47.5} y={17.5} r={1.7} />
      <S x={16.5} y={48.5} r={1.7} />
      <S x={47.5} y={48.5} r={1.7} />
    </g>
  );
}

function EStop({ pressed }: { pressed?: boolean }) {
  return (
    <g>
      <rect x={9} y={15} width={46} height={36} rx={6} fill={pressed ? "#a16207" : "#facc15"} stroke="#ca8a04" strokeWidth={1.2} />
      <path d="M20 23 a13 13 0 0 1 9 -4" fill="none" stroke="#a16207" strokeWidth={1.4} />
      <path d="M44 41 a13 13 0 0 1 -9 4" fill="none" stroke="#a16207" strokeWidth={1.4} />
      <circle cx={32} cy={33} r={15} fill={pressed ? "#a16207" : "#eab308"} stroke="#7f1d1d" strokeWidth={pressed ? 2 : 1.4} />
      <g transform={pressed ? "translate(0 3)" : undefined}>
        <circle cx={32} cy={33} r={11} fill="url(#lg-red)" stroke="#7f1d1d" />
        <ellipse cx={28} cy={29} rx={4} ry={2.4} fill="#fff" opacity={0.35} />
      </g>
      {pressed && <circle className="ep-glow" cx={32} cy={36} r={12} fill="#ef4444" opacity={0.3} />}
      <S x={13.5} y={19.5} r={1.6} />
      <S x={50.5} y={19.5} r={1.6} />
      <S x={13.5} y={46.5} r={1.6} />
      <S x={50.5} y={46.5} r={1.6} />
    </g>
  );
}

function Selector({ variant = 1, on }: { variant?: 1 | 2 | 3; on?: boolean }) {
  const plate = variant === 2 ? "#cbd5e1" : "#eef2f8";
  const r = variant === 3 ? 13 : variant === 2 ? 11 : 10;
  const base = variant === 3 ? 42 : variant === 2 ? 35 : 28;
  const angle = on ? -base : base;
  const rad = (angle * Math.PI) / 180;
  return (
    <g>
      <rect x={11} y={13} width={42} height={40} rx={6} fill={plate} stroke="#8fa0b8" strokeWidth={1.2} />
      {variant === 3 && [0, 1, 2].map((i) => <circle key={i} cx={22 + i * 10} cy={20} r={1.3} fill="#64748b" />)}
      <circle cx={32} cy={33} r={r + 2} fill="#0b1220" stroke="#475569" />
      <circle cx={32} cy={33} r={r} fill="#374151" stroke="#111827" />
      <line x1={32} y1={33} x2={32 + Math.sin(rad) * (r - 2)} y2={33 - Math.cos(rad) * (r - 2)} stroke="#f8fafc" strokeWidth={2.2} />
      <circle cx={32} cy={33} r={2} fill="#94a3b8" />
      {variant === 1 && (
        <text x={32} y={47} textAnchor="middle" fontSize={6.5} fill="#475569" fontWeight={700} style={{ fontFamily: MONO }}>
          I / O
        </text>
      )}
      {variant === 3 && (
        <text x={32} y={47} textAnchor="middle" fontSize={6.5} fill="#475569" fontWeight={700} style={{ fontFamily: MONO }}>
          1 - 0 - 2
        </text>
      )}
    </g>
  );
}

/* ---------- SENSORS ---------- */

function Limit() {
  return (
    <g>
      <line x1={27} y1={19} x2={15} y2={11} stroke="#475569" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={13} cy={10} r={4.2} fill="#94a3b8" stroke="#475569" strokeWidth={1.4} />
      <rect x={20} y={17} width={15} height={9} rx={2} fill="#3b82f6" stroke="#1e40af" />
      <rect x={18} y={26} width={28} height={19} rx={3} fill="#cdd6e4" stroke="#7e8da8" />
      <rect x={18} y={26} width={28} height={5} fill="#b6c2d6" />
      <circle cx={25} cy={37} r={2.6} fill="#f97316" stroke="#9a3412" />
      <circle cx={39} cy={37} r={2.6} fill="#16a34a" stroke="#14532d" />
      <text x={25} y={44} textAnchor="middle" fontSize={4.6} fill="#475569" style={{ fontFamily: MONO }}>
        NO
      </text>
      <text x={39} y={44} textAnchor="middle" fontSize={4.6} fill="#475569" style={{ fontFamily: MONO }}>
        NC
      </text>
    </g>
  );
}

function Float() {
  return (
    <g>
      <line x1={32} y1={7} x2={32} y2={20} stroke="#475569" strokeWidth={1.6} />
      <circle cx={32} cy={23} r={4.4} fill="#ef4444" stroke="#991b1b" />
      <rect x={19} y={29} width={26} height={15} rx={5} fill="#2563eb" stroke="#1e40af" />
      <rect x={19} y={29} width={26} height={5} rx={2.5} fill="#3b82f6" />
      <line x1={32} y1={44} x2={32} y2={52} stroke="#475569" strokeWidth={1.6} />
      <rect x={27} y={50} width={10} height={4} rx={1.5} fill="#94a3b8" />
    </g>
  );
}

function Gauge({ cap, bodyC }: { cap: string; bodyC: string }) {
  return (
    <g>
      <rect x={18} y={29} width={28} height={19} rx={3} fill={bodyC} stroke="#0b1220" />
      <circle cx={25} cy={42} r={2.4} fill="#f97316" />
      <circle cx={39} cy={42} r={2.4} fill="#16a34a" />
      <circle cx={32} cy={22} r={11.5} fill={cap === "#ef4444" ? "#7f1d1d" : "#0b1220"} stroke="#475569" strokeWidth={1.5} />
      <circle cx={32} cy={22} r={8.6} fill="#f8fafc" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (-22 + i * 11) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1={32 + Math.sin(a) * 6.4}
            y1={22 - Math.cos(a) * 6.4}
            x2={32 + Math.sin(a) * 7.6}
            y2={22 - Math.cos(a) * 7.6}
            stroke="#475569"
            strokeWidth={0.8}
          />
        );
      })}
      <line x1={32} y1={22} x2={36.5} y2={17.5} stroke="#dc2626" strokeWidth={1.3} />
      <circle cx={32} cy={22} r={1.4} fill="#334155" />
    </g>
  );
}

function PhotoSensor({ on }: GlyphProps) {
  return (
    <g>
      <rect x={25} y={9} width={3} height={10} fill="#475569" />
      <rect x={19} y={17} width={18} height={16} rx={3} fill="#2563eb" stroke="#1e40af" />
      <circle cx={28} cy={25} r={5} fill="#0b1220" stroke="#155e75" />
      <circle className={on ? "ep-glow" : undefined} cx={28} cy={25} r={3} fill={on ? "#facc15" : "#6b7280"} />
      <rect x={20} y={33} width={24} height={14} rx={3} fill="#cdd6e4" stroke="#7e8da8" />
      <circle cx={27} cy={42} r={2.4} fill="#f97316" />
      <circle cx={39} cy={42} r={2.4} fill="#16a34a" />
    </g>
  );
}

/* ---------- SIGNALING ---------- */

function PilotLight({ lens, solid, active }: { lens: string; solid: string; active?: boolean }) {
  return (
    <g>
      <HexNut x={32} y={33} r={16} />
      <Lens x={32} y={32} r={10.5} id={lens} solid={solid} active={active} />
      <rect x={27} y={45} width={10} height={6} rx={1.5} fill="#64748b" stroke="#475569" />
      <line x1={29} y1={48} x2={35} y2={48} stroke="#475569" strokeWidth={1} />
    </g>
  );
}

function Buzzer({ active }: GlyphProps) {
  return (
    <g>
      <HexNut x={32} y={32} r={16} fill="#5b6a82" />
      <circle cx={32} cy={31} r={13} fill="#111827" stroke="#0b1220" />
      {[9, 6.2, 3.4].map((r) => (
        <circle key={r} cx={32} cy={31} r={r} fill="none" stroke="#4b5563" strokeWidth={1.1} />
      ))}
      <circle cx={32} cy={31} r={1.8} fill="#0b1220" />
      {active &&
        [0, 1].map((i) => (
          <path
            key={i}
            className="ep-glow"
            d={`M${47 + i * 3} ${25 + i * 3} q4 3 0 6`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth={1.6}
          />
        ))}
      <rect x={27} y={45} width={10} height={6} rx={1.5} fill="#475569" />
    </g>
  );
}

function Ind3Ph() {
  return (
    <g>
      <rect x={10} y={16} width={44} height={32} rx={4} fill="#1f2937" stroke="#0b1220" strokeWidth={1.2} />
      <circle cx={19} cy={26} r={5} fill="#0b1220" stroke="#475569" />
      <circle cx={19} cy={26} r={3.4} fill="url(#lg-red)" />
      <circle cx={32} cy={26} r={5} fill="#0b1220" stroke="#475569" />
      <circle cx={32} cy={26} r={3.4} fill="url(#lg-yellow)" />
      <circle cx={45} cy={26} r={5} fill="#0b1220" stroke="#475569" />
      <circle cx={45} cy={26} r={3.4} fill="url(#lg-blue)" />
      <rect x={15} y={36} width={34} height={7} rx={1.5} fill="#374151" />
      <line x1={19} y1={39.5} x2={45} y2={39.5} stroke="#6b7280" strokeWidth={0.7} strokeDasharray="2 2" />
      <rect x={20} y={48} width={24} height={4} rx={1.5} fill="#475569" />
    </g>
  );
}

function Meter({ three, kind }: { three?: boolean; kind: "V" | "A" }) {
  const cols = three ? ["#ef4444", "#eab308", "#3b82f6"] : ["#ef4444", "#eab308"];
  return (
    <g>
      {cols.map((c, i) => (
        <circle key={i} cx={24 + i * (three ? 8 : 16)} cy={10} r={2.4} fill={c} stroke="#0b1220" />
      ))}
      <rect x={15} y={13} width={34} height={kind === "A" ? 34 : 40} rx={4} fill="#1f2937" stroke="#0b1220" strokeWidth={1.2} />
      <rect x={19} y={17} width={26} height={12} rx={1.5} fill="#04140f" stroke="#14532d" />
      <text x={32} y={23.5} textAnchor="middle" fontSize={8} fontWeight={700} fill="#4ade80" style={{ fontFamily: MONO }}>
        {kind === "V" ? (three ? "380V" : "220V") : "12.5A"}
      </text>
      {kind === "A" ? (
        <circle cx={32} cy={38} r={6} fill="#f97316" stroke="#9a3412" />
      ) : (
        <rect x={20} y={33} width={24} height={8} rx={2} fill="#374151" />
      )}
      <rect x={19} y={45} width={26} height={5} rx={1.5} fill="#111827" />
    </g>
  );
}

function Ct() {
  return (
    <g>
      <rect x={24} y={9} width={3.4} height={9} fill="#64748b" />
      <rect x={36.6} y={9} width={3.4} height={9} fill="#64748b" />
      <circle cx={25.7} cy={12} r={2.2} fill="#b9c6d8" stroke="#64748b" />
      <circle cx={38.3} cy={12} r={2.2} fill="#b9c6d8" stroke="#64748b" />
      <circle cx={32} cy={37} r={15} fill="url(#g-copper)" stroke="#7c3f10" strokeWidth={1.2} />
      <circle cx={32} cy={37} r={7.5} fill="#0b1322" />
      <circle cx={32} cy={37} r={7.5} fill="none" stroke="#7c3f10" strokeWidth={1} />
    </g>
  );
}

/* ---------- LOADS ---------- */

function Motor({
  body,
  dark,
  terms,
  active,
  detailed,
}: {
  body: string;
  dark: string;
  terms: string[];
  active?: boolean;
  detailed?: boolean;
}) {
  return (
    <g>
      <rect x={15} y={45} width={9} height={4.5} rx={1} fill={dark} />
      <rect x={37} y={45} width={9} height={4.5} rx={1} fill={dark} />
      <rect x={20} y={13} width={16} height={9} rx={2} fill={dark} />
      {terms.map((c, i) => {
        const step = 12 / Math.max(1, terms.length - 1);
        return <circle key={i} cx={22 + (terms.length === 1 ? 6 : i * step)} cy={13} r={2.3} fill={c} stroke="#0b1220" />;
      })}
      <rect x={11} y={21} width={33} height={25} rx={4.5} fill={body} stroke={dark} strokeWidth={1.2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={14} y1={26 + i * 4} x2={41} y2={26 + i * 4} stroke={dark} strokeWidth={0.7} opacity={0.5} />
      ))}
      <rect x={15} y={27} width={13} height={7} rx={1} fill={detailed ? "#f1f5f9" : "#dbe3ee"} stroke={dark} />
      {detailed && (
        <g>
          <line x1={17} y1={30} x2={26} y2={30} stroke="#94a3b8" strokeWidth={0.7} />
          <line x1={17} y1={32.5} x2={24} y2={32.5} stroke="#94a3b8" strokeWidth={0.7} />
        </g>
      )}
      <circle cx={45} cy={33.5} r={10.5} fill="#1f2937" stroke="#0b1220" strokeWidth={1.2} />
      <circle cx={45} cy={33.5} r={8} fill="#3b475c" />
      <g className={active ? "ep-rotor" : undefined}>
        {[0, 120, 240].map((a) => (
          <ellipse key={a} cx={45} cy={28.4} rx={2.1} ry={4.8} fill="#0b1220" transform={`rotate(${a} 45 33.5)`} />
        ))}
      </g>
      <circle cx={45} cy={33.5} r={2.1} fill={dark} />
    </g>
  );
}

function StarDelta({ active }: GlyphProps) {
  return (
    <g>
      <rect x={15} y={46} width={9} height={4} rx={1} fill="#1e3a8a" />
      <rect x={38} y={46} width={9} height={4} rx={1} fill="#1e3a8a" />
      <rect x={18} y={9} width={24} height={13} rx={2} fill="#b91c1c" stroke="#7f1d1d" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}${c}`} cx={22.5 + c * 7.5} cy={13 + r * 3.6} r={1.5} fill={["#ef4444", "#eab308", "#3b82f6"][c]} />
        ))
      )}
      <rect x={12} y={23} width={33} height={24} rx={4.5} fill="#2563eb" stroke="#1e3a8a" strokeWidth={1.2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={15} y1={28 + i * 4} x2={42} y2={28 + i * 4} stroke="#1e3a8a" strokeWidth={0.7} />
      ))}
      <circle cx={46} cy={35} r={9.5} fill="#1f2937" stroke="#0b1220" />
      <g className={active ? "ep-rotor" : undefined}>
        {[0, 120, 240].map((a) => (
          <ellipse key={a} cx={46} cy={30.4} rx={1.9} ry={4.2} fill="#0b1220" transform={`rotate(${a} 46 35)`} />
        ))}
      </g>
      <circle cx={46} cy={35} r={2} fill="#1e3a8a" />
    </g>
  );
}

function Pump({ active }: GlyphProps) {
  return (
    <g>
      <rect x={14} y={19} width={9} height={8} rx={1.5} fill="#1e3a8a" />
      <circle cx={20} cy={38} r={13} fill="#1d4ed8" stroke="#17338a" strokeWidth={1.4} />
      <path d="M20 38 a7 7 0 0 1 7 -7 a9 9 0 0 1 4 10" fill="none" stroke="#93c5fd" strokeWidth={1.6} />
      <circle cx={20} cy={38} r={3} fill="#17338a" />
      <rect x={12} y={49} width={10} height={4} rx={1} fill="#17338a" />
      <rect x={29} y={26} width={24} height={21} rx={9} fill="#64748b" stroke="#334155" strokeWidth={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={32} y1={30 + i * 4} x2={50} y2={30 + i * 4} stroke="#475569" strokeWidth={0.8} />
      ))}
      <rect x={36} y={21} width={10} height={6} rx={1.5} fill="#334155" />
      <circle cx={53} cy={36.5} r={8.5} fill="#111827" stroke="#0b1220" />
      <g className={active ? "ep-rotor-fast" : undefined}>
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={a} cx={53} cy={31.8} rx={1.6} ry={3.8} fill="#475569" transform={`rotate(${a} 53 36.5)`} />
        ))}
      </g>
    </g>
  );
}

function Lamp({ active }: GlyphProps) {
  return (
    <g>
      {active && <circle className="ep-glow" cx={32} cy={28} r={15} fill="#fde68a" opacity={0.3} />}
      <path
        d="M32 12 a11 11 0 0 1 7 19 q-3 3 -3 6 h-8 q0 -3 -3 -6 a11 11 0 0 1 7 -19 z"
        fill={active ? "#fef9c3" : "rgba(255,251,220,0.35)"}
        stroke="#94a3b8"
        strokeWidth={1.2}
      />
      <path d="M28 33 h8 M30 36 h4" stroke="#64748b" strokeWidth={1} fill="none" />
      <path d="M29 30 v-5 l3 4 l3 -4 v5" fill="none" stroke={active ? "#d97706" : "#94a3b8"} strokeWidth={1.1} />
      <rect x={26.5} y={40} width={11} height={4} rx={1} fill="url(#g-metal)" stroke="#74839e" />
      <rect x={26} y={44} width={12} height={3} rx={1} fill="#aeb9cc" stroke="#74839e" />
      <rect x={26} y={47.5} width={12} height={4.5} rx={1.2} fill="#94a3b8" stroke="#64748b" />
      <line x1={27} y1={45.4} x2={37} y2={45.4} stroke="#64748b" strokeWidth={0.8} />
      <line x1={27} y1={49} x2={37} y2={49} stroke="#64748b" strokeWidth={0.8} />
    </g>
  );
}

/* ---------- WIRING ---------- */

function Terminal({ n }: { n: number }) {
  const mw = 12.5;
  const gap = 1.5;
  const total = mw * n + gap * (n - 1);
  const x0 = (64 - total) / 2;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + i * (mw + gap);
        return (
          <g key={i}>
            <rect x={x} y={15} width={mw} height={34} rx={2} fill="#c2ccdc" stroke="#7e8da8" strokeWidth={1} />
            <rect x={x} y={15} width={mw} height={6} rx={2} fill="#dfe6f0" />
            <circle cx={x + mw / 2} cy={19} r={1.9} fill="#0b1322" />
            <S x={x + mw / 2} y={32} r={2.6} />
            <circle cx={x + mw / 2} cy={45} r={1.9} fill="#0b1322" />
            <line x1={x} y1={24} x2={x + mw} y2={24} stroke="#94a3b8" strokeWidth={0.8} />
            <line x1={x} y1={40} x2={x + mw} y2={40} stroke="#94a3b8" strokeWidth={0.8} />
          </g>
        );
      })}
    </g>
  );
}

function LinkBar({ c1, c2, stripe }: { c1: string; c2: string; stripe: string }) {
  return (
    <g>
      <rect x={9} y={21} width={46} height={22} rx={4} fill={c1} stroke={c2} strokeWidth={1.2} />
      <rect x={9} y={29} width={46} height={6} fill={stripe} opacity={0.85} />
      {[15, 26.3, 37.6, 49].map((x) => (
        <circle key={x} cx={x} cy={24.5} r={2.4} fill="#dfe6f0" stroke="#64748b" />
      ))}
      {[15, 26.3, 37.6, 49].map((x) => (
        <circle key={x} cy={39.5} cx={x} r={2.4} fill="#dfe6f0" stroke="#64748b" />
      ))}
    </g>
  );
}

function Busbar() {
  const cols = ["#ef4444", "#eab308", "#3b82f6", "#16a34a"];
  return (
    <g>
      <rect x={8} y={13} width={48} height={38} rx={4} fill="#1f2937" stroke="#0b1220" />
      {cols.map((c, i) => (
        <g key={c}>
          <rect x={13} y={17 + i * 8} width={42} height={5} rx={1} fill={c} />
          {[19, 32, 45].map((x) => (
            <circle key={x} cx={x} cy={19.5 + i * 8} r={1.7} fill="#0b1322" />
          ))}
        </g>
      ))}
    </g>
  );
}

function Comb() {
  return (
    <g>
      <rect x={10} y={20} width={44} height={5} rx={1.5} fill="url(#g-copper)" stroke="#a85a16" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={12 + i * 5} y={25} width={2.4} height={16} fill="#d9903f" stroke="#a85a16" strokeWidth={0.5} />
      ))}
      <rect x={10} y={41} width={44} height={3} rx={1.5} fill="url(#g-copper)" />
    </g>
  );
}

function Junction() {
  return (
    <g>
      <circle cx={32} cy={32} r={18} fill="#334155" stroke="#1e293b" strokeWidth={2} />
      <circle cx={32} cy={32} r={13} fill="#1e293b" stroke="#475569" />
      <S x={32} y={32} r={3.4} />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <circle key={a} cx={32 + Math.cos(rad) * 13} cy={32 + Math.sin(rad) * 13} r={1.4} fill="#64748b" />;
      })}
    </g>
  );
}

function Duct({ wide }: { wide?: boolean }) {
  const h = wide ? 38 : 24;
  const y = wide ? 13 : 20;
  return (
    <g>
      <rect x={8} y={y} width={48} height={h} rx={2.5} fill="#9aa7bb" stroke="#64748b" strokeWidth={1.1} />
      <rect x={11} y={y + 3} width={42} height={h - 6} fill="#7b8aa3" />
      <line x1={32} y1={y + 3} x2={32} y2={y + h - 3} stroke="#9aa7bb" strokeWidth={1.4} />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <rect x={13.5 + i * 5.2} y={y + 5} width={2.2} height={h - 10} fill="#5b6a86" />
          <rect x={34.5 + i * 2.2} y={y + 5} width={1.6} height={h - 10} fill="#5b6a86" />
        </g>
      ))}
    </g>
  );
}

/* ---------- STRUCTURE ---------- */

function Panel({ w }: { w: number }) {
  const x0 = (64 - w) / 2;
  const orange = Math.max(10, w * 0.3);
  return (
    <g>
      <rect x={x0} y={12} width={w} height={40} rx={2} fill="#f97316" stroke="#c2410c" strokeWidth={1.2} />
      <rect x={x0} y={12} width={w - orange} height={40} rx={2} fill="#f8fafc" stroke="#c2410c" />
      <line x1={x0 + w - orange} y1={12} x2={x0 + w - orange} y2={52} stroke="#c2410c" strokeWidth={1} />
      {[20, 32, 44].map((y) => (
        <line key={y} x1={x0 + w - orange + 3} y1={y} x2={x0 + w - 4} y2={y} stroke="#c2410c" strokeWidth={1.6} strokeDasharray="3 2" />
      ))}
      <circle cx={x0 + w - orange / 2} cy={32} r={2.4} fill="#c2410c" />
    </g>
  );
}

function BreakerBox() {
  return (
    <g>
      <rect x={8} y={12} width={48} height={40} rx={3} fill="#a7b3c7" stroke="#64748b" strokeWidth={1.2} />
      <rect x={8} y={12} width={48} height={9} rx={3} fill="#c3cede" />
      <S x={12} y={16.5} r={1.7} />
      <S x={52} y={16.5} r={1.7} />
      <rect x={12} y={25} width={40} height={5} fill="#dfe6f0" stroke="#94a3b8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={14 + i * 6.4} y={32} width={5} height={13} rx={1} fill="#eef2f8" stroke="#94a3b8" />
          <rect x={15 + i * 6.4} y={35} width={3} height={5} rx={0.8} fill={["#ef4444", "#eab308", "#3b82f6"][i % 3]} />
        </g>
      ))}
      <rect x={12} y={47} width={40} height={3} fill="#8fa0b8" />
    </g>
  );
}

function DinRail() {
  return (
    <g>
      <rect x={8} y={23} width={48} height={18} rx={2} fill="url(#g-metal)" stroke="#74839e" />
      <rect x={8} y={23} width={48} height={5} fill="#eef2f8" />
      <rect x={8} y={36} width={48} height={5} fill="#aeb9cc" />
      <rect x={8} y={28} width={48} height={8} fill="#cdd6e4" />
      {[18, 32, 46].map((x) => (
        <ellipse key={x} cx={x} cy={32} rx={3} ry={2} fill="#5b6a86" />
      ))}
      <ellipse cx={11} cy={32} rx={1.8} ry={2.4} fill="#74839e" />
      <ellipse cx={53} cy={32} rx={1.8} ry={2.4} fill="#74839e" />
    </g>
  );
}

function TextLabel() {
  return (
    <g>
      <rect x={8} y={20} width={48} height={24} rx={3} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.2} />
      <text x={32} y={33} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#334155">
        Label
      </text>
    </g>
  );
}

/* ---------- READY-MADE ---------- */

function Ats() {
  return (
    <g>
      <rect x={8} y={8} width={48} height={48} rx={4} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.2} />
      <rect x={8} y={8} width={48} height={9} rx={4} fill="#dfe6f0" />
      <text x={32} y={12.8} textAnchor="middle" fontSize={6.5} fontWeight={700} fill="#334155" style={{ fontFamily: MONO }}>
        ATS
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={12} y={20 + i * 11} width={12} height={8} rx={1.5} fill="#d3dceb" stroke="#8fa0b8" />
          <circle cx={15} cy={24 + i * 11} r={1.8} fill={["#ef4444", "#eab308", "#3b82f6"][i]} />
          <line x1={24} y1={24 + i * 11} x2={31} y2={32} stroke="#64748b" strokeWidth={1.2} />
        </g>
      ))}
      <circle cx={33} cy={32} r={5} fill="#fff" stroke="#475569" />
      <path d="M33 28 v5 M33 33 l3.5 3.5" stroke="#16a34a" strokeWidth={1.4} fill="none" />
      <line x1={38} y1={32} x2={45} y2={32} stroke="#475569" strokeWidth={1.2} />
      <Lens x={48} y={32} r={5} id="lg-green" solid="#22c55e" />
      <rect x={12} y={50} width={40} height={3.5} rx={1} fill="#c9f5d6" />
    </g>
  );
}

/* ---------- registry ---------- */

export const GLYPHS: Record<string, (p: GlyphProps) => ReactNode> = {
  /* sources */
  gen: () => <Gen />,
  "gen-photo": () => <GenPhoto />,
  "src-3ph": () => <Src3 />,
  "src-1ph": () => <RoundPlate lens="lg-red" solid="#ef4444" label="1Φ" />,
  n: () => <RoundPlate lens="lg-blue" solid="#3b82f6" label="N" />,
  pe: () => <RoundPlate lens="lg-green" solid="#22c55e" label="PE" />,
  /* protection */
  "mcb-1": (p) => <Mcb poles={1} color={p.color} on={p.on} />,
  "mcb-2": (p) => <Mcb poles={2} color={p.color} on={p.on} />,
  "mcb-3": (p) => <Mcb poles={3} color={p.color} on={p.on} />,
  "mcb-4": (p) => <Mcb poles={4} color={p.color} on={p.on} />,
  mccb3: () => <Mccb poles={3} />,
  mccb4: () => <Mccb poles={4} />,
  rccb2: () => <Rccb poles={2} />,
  rccb4: () => <Rccb poles={4} />,
  ebreaker: () => <EBreaker />,
  spd: () => <Spd />,
  fuse: () => <Fuse />,
  overload: (p) => <Overload tripped={p.tripped} />,
  phasefail: () => <PhaseFail />,
  phasesel: () => <PhaseSelector />,
  /* contactors */
  ct1: (p) => <Contactor poles={3} active={p.active} />,
  ct2: (p) => <Contactor poles={2} active={p.active} />,
  ct4: (p) => <Contactor poles={4} active={p.active} />,
  "ct4-pro": (p) => <Contactor poles={4} active={p.active} dark />,
  relay: (p) => <Relay active={p.active} />,
  "timer-on": (p) => <Timer mode="ON" active={p.active} />,
  "timer-off": (p) => <Timer mode="OFF" active={p.active} />,
  /* automation */
  logo230: () => <LogoBody w={48} screen label="230RCI" />,
  "logo-dm8": () => <LogoBody w={32} screen={false} label="DM8 24" />,
  "logo-am2": () => <LogoBody w={28} screen={false} label="AM2" />,
  vfd: () => <Vfd />,
  psu24: () => <Psu />,
  /* buttons */
  "pb-no": (p) => <PB lens="lg-green" solid="#22c55e" pressed={p.pressed} />,
  "pb-nc": (p) => <PB lens="lg-red" solid="#ef4444" pressed={p.pressed} />,
  "pb-dual": (p) => (
    <PB
      lens=""
      solid=""
      dual={["lg-green", "#22c55e", "lg-blue", "#3b82f6"]}
      pressed={p.pressed}
    />
  ),
  estop: (p) => <EStop pressed={p.pressed} />,
  "sel-onoff": (p) => <Selector variant={1} on={p.on} />,
  selector: (p) => <Selector variant={2} on={p.on} />,
  "sel-102": (p) => <Selector variant={3} on={p.on} />,
  /* sensors */
  limit: () => <Limit />,
  float: () => <Float />,
  pressure: () => <Gauge cap="#0b1220" bodyC="#1f2937" />,
  temp: () => <Gauge cap="#ef4444" bodyC="#7f1d1d" />,
  photo: (p) => <PhotoSensor on={p.on} />,
  /* signaling */
  "light-green": (p) => <PilotLight lens="lg-green" solid="#22c55e" active={p.active} />,
  "light-red": (p) => <PilotLight lens="lg-red" solid="#ef4444" active={p.active} />,
  "light-blue": (p) => <PilotLight lens="lg-blue" solid="#3b82f6" active={p.active} />,
  "light-orange": (p) => <PilotLight lens="lg-amber" solid="#f97316" active={p.active} />,
  "light-yellow": (p) => <PilotLight lens="lg-yellow" solid="#eab308" active={p.active} />,
  buzzer: (p) => <Buzzer active={p.active} />,
  "ind-3ph": () => <Ind3Ph />,
  voltmeter: () => <Meter kind="V" />,
  voltmeter3: () => <Meter three kind="V" />,
  ct: () => <Ct />,
  ammeter: () => <Meter kind="A" />,
  /* loads */
  motor3: (p) => <Motor body="#16a34a" dark="#14532d" terms={["#ef4444", "#eab308", "#3b82f6"]} active={p.active} />,
  motor1: (p) => <Motor body="#c2611b" dark="#7c3f10" terms={["#ef4444", "#3b82f6"]} active={p.active} />,
  stardelta: (p) => <StarDelta active={p.active} />,
  "motor-photo": (p) => <Motor body="#15803d" dark="#0f3d20" terms={["#ef4444", "#eab308", "#3b82f6"]} active={p.active} detailed />,
  pump: (p) => <Pump active={p.active} />,
  lamp: (p) => <Lamp active={p.active} />,
  /* wiring */
  term1: () => <Terminal n={1} />,
  term2: () => <Terminal n={2} />,
  term3: () => <Terminal n={3} />,
  term4: () => <Terminal n={4} />,
  "neutral-link": () => <LinkBar c1="#2563eb" c2="#1e3a8a" stripe="#93c5fd" />,
  "earth-link": () => <LinkBar c1="#16a34a" c2="#14532d" stripe="#facc15" />,
  busbar: () => <Busbar />,
  comb: () => <Comb />,
  junction: () => <Junction />,
  duct: () => <Duct />,
  "duct-wide": () => <Duct wide />,
  /* structure */
  "panel-s": () => <Panel w={30} />,
  "panel-m": () => <Panel w={40} />,
  "panel-l": () => <Panel w={52} />,
  box: () => <BreakerBox />,
  din: () => <DinRail />,
  textlabel: () => <TextLabel />,
  /* units */
  ats: () => <Ats />,
};

/** register additional glyph packs (IconsExtra) */
export function registerGlyphs(extra: Record<string, (p: GlyphProps) => ReactNode>) {
  Object.assign(GLYPHS, extra);
}

export const PartGlyph = memo(function PartGlyph({
  part,
  active,
  running,
  supplyActive,
  levelStage,
  contactClosed,
  color,
  on,
  pressed,
  tripped,
  skin,
  label,
  className,
  style,
}: {
  part: string;
  active?: boolean;
  running?: boolean;
  supplyActive?: boolean;
  levelStage?: number;
  contactClosed?: boolean;
  color?: string;
  on?: boolean;
  pressed?: boolean;
  tripped?: boolean;
  skin?: "starter";
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const fn = (skin && GLYPHS[`${skin}:${part}`]) || GLYPHS[part] || GLYPHS.gen;
  const native = skin === "starter" ? STARTER_SIZE[part] : undefined;
  return (
    <svg viewBox={native ? `0 0 ${native.w} ${native.h}` : "0 0 64 64"} className={className} style={style} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {fn({ active, running, supplyActive, levelStage, contactClosed, color, on, pressed, tripped, label })}
    </svg>
  );
}, (a, b) =>
  a.part === b.part &&
  a.active === b.active &&
  a.running === b.running &&
  a.supplyActive === b.supplyActive &&
  a.levelStage === b.levelStage &&
  a.contactClosed === b.contactClosed &&
  a.color === b.color &&
  a.on === b.on &&
  a.pressed === b.pressed &&
  a.tripped === b.tripped &&
  a.skin === b.skin &&
  a.label === b.label &&
  a.className === b.className &&
  a.style?.width === b.style?.width &&
  a.style?.height === b.style?.height
);
