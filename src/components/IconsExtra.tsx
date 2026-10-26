import type { ReactNode } from "react";
import {
  Dot,
  GLYPHS,
  HexNut,
  Lens,
  MONO,
  S,
  SPlus,
  Screen,
  registerGlyphs,
  type GlyphProps,
} from "./Icons";

/* ------------------------------------------------------------------ */
/* generic builders                                                    */
/* ------------------------------------------------------------------ */

function Term(n: number, yT = 14, yB = 50, mw = 9, fill = "#c2ccdc") {
  const gap = 1.4;
  const total = mw * n + gap * (n - 1);
  const x0 = (64 - total) / 2;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + i * (mw + gap);
        return (
          <g key={i}>
            <rect x={x} y={15} width={mw} height={34} rx={1.6} fill={fill} stroke="#7e8da8" strokeWidth={0.9} />
            <circle cx={x + mw / 2} cy={yT} r={1.8} fill="#0b1322" />
            <S x={x + mw / 2} y={yB} r={1.9} />
          </g>
        );
      })}
    </g>
  );
}

function DinBox({
  w = 44,
  label,
  screenText,
  dark = true,
  knobs = 0,
  leds = [] as string[],
  buttons = 0,
  termTop = 0,
  termBot = 0,
  accent,
}: {
  w?: number;
  label?: string;
  screenText?: string;
  dark?: boolean;
  knobs?: number;
  leds?: string[];
  buttons?: number;
  termTop?: number;
  termBot?: number;
  accent?: string;
}) {
  const x = (64 - w) / 2;
  const body = dark ? "#2a3449" : "#e9eef5";
  const edge = dark ? "#11192b" : "#8fa0b8";
  const termY = (n: number, top: boolean) => {
    const out: ReactNode[] = [];
    const mw = Math.min(7, (w - 10) / n);
    const gap = n > 1 ? (w - 8 - mw * n) / (n - 1) : 0;
    for (let i = 0; i < n; i++) {
      const cx = x + 5 + mw / 2 + i * (mw + gap);
      out.push(
        <rect key={`${top}-${i}`} x={cx - 2.6} y={top ? 12 : 47} width={5.2} height={5} rx={1} fill="#475569" stroke="#1f2937" />
      );
    }
    return out;
  };
  return (
    <g>
      <rect x={x} y={12} width={w} height={40} rx={3.4} fill={body} stroke={edge} strokeWidth={1.1} />
      {termY(termTop, true)}
      {termY(termBot, false)}
      {screenText !== undefined && (
        <g>
          <rect x={x + 5} y={19} width={w - 10} height={11} rx={1.5} fill="#04121a" stroke="#155e75" />
          <text x={x + w / 2} y={25.2} textAnchor="middle" fontSize={6.4} fontWeight={700} fill="#22d3ee" style={{ fontFamily: MONO }}>
            {screenText}
          </text>
        </g>
      )}
      {Array.from({ length: knobs }).map((_, i) => {
        const kx = x + 11 + i * 13;
        return (
          <g key={i}>
            <circle cx={kx} cy={37} r={5.4} fill="#1f2937" stroke="#0b1220" />
            <line x1={kx} y1={37} x2={kx + 3.4} y2={33.6} stroke="#e2e8f0" strokeWidth={1.3} />
          </g>
        );
      })}
      {leds.map((c, i) => (
        <Dot key={i} x={x + w - 7 - i * 6} y={37} c={c} />
      ))}
      {Array.from({ length: buttons }).map((_, i) => (
        <rect key={i} x={x + 7 + i * 8} y={35} width={6} height={5} rx={1} fill="#3a4663" stroke="#1f2937" />
      ))}
      {label && (
        <text x={x + w / 2} y={screenText !== undefined ? 42 : 30} textAnchor="middle" fontSize={5.6} fontWeight={700} fill={accent ?? (dark ? "#9fb2d6" : "#475569")} style={{ fontFamily: MONO }}>
          {label}
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* SOURCES                                                            */
/* ------------------------------------------------------------------ */

function Solar() {
  return (
    <g>
      <rect x={9} y={16} width={46} height={28} rx={2.5} fill="#1d4ed8" stroke="#172554" strokeWidth={1.2} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={11 + c * 11} y={18 + r * 8} width={9.6} height={6.6} fill={((r + c) % 2 ? "#2563eb" : "#3b82f6")} stroke="#1e3a8a" strokeWidth={0.5} />
        ))
      )}
      <line x1={24} y1={44} x2={28} y2={52} stroke="#64748b" strokeWidth={2.4} />
      <line x1={40} y1={44} x2={36} y2={52} stroke="#64748b" strokeWidth={2.4} />
      <line x1={24} y1={52} x2={40} y2={52} stroke="#64748b" strokeWidth={2.4} />
      <circle cx={20} cy={54} r={2} fill="#ef4444" stroke="#991b1b" />
      <circle cx={44} cy={54} r={2} fill="#3b82f6" stroke="#1e40af" />
    </g>
  );
}

function Battery() {
  return (
    <g>
      <rect x={10} y={20} width={44} height={28} rx={4} fill="#15803d" stroke="#052e16" strokeWidth={1.2} />
      <rect x={10} y={20} width={44} height={7} rx={4} fill="#16a34a" />
      <text x={32} y={24.8} textAnchor="middle" fontSize={5.4} fontWeight={700} fill="#dcfce7" style={{ fontFamily: MONO }}>
        48V DC
      </text>
      <path d="M18 35 h6 v-4 l8 8 h-6 v4 z" fill="#bbf7d0" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={38} y={30 + i * 5} width={10} height={3} rx={1} fill="#86efac" opacity={1 - i * 0.25} />
      ))}
      <rect x={22} y={48} width={8} height={5} rx={1.5} fill="#94a3b8" />
      <rect x={34} y={48} width={8} height={5} rx={1.5} fill="#94a3b8" />
      <circle cx={26} cy={52} r={1.9} fill="#ef4444" stroke="#991b1b" />
      <circle cx={38} cy={52} r={1.9} fill="#3b82f6" stroke="#1e40af" />
    </g>
  );
}

function Transformer() {
  return (
    <g>
      <S x={22} y={13} r={2} />
      <S x={42} y={13} r={2} />
      <rect x={12} y={16} width={40} height={32} rx={3} fill="#e2e8f0" stroke="#94a3b8" />
      <rect x={17} y={20} width={12} height={24} rx={5} fill="none" stroke="#b91c1c" strokeWidth={2} />
      <rect x={35} y={20} width={12} height={24} rx={5} fill="none" stroke="#1d4ed8" strokeWidth={2} />
      <line x1={29} y1={20} x2={35} y2={20} stroke="#64748b" strokeWidth={2} />
      <line x1={29} y1={44} x2={35} y2={44} stroke="#64748b" strokeWidth={2} />
      <text x={23} y={34} textAnchor="middle" fontSize={4.6} fill="#b91c1c" style={{ fontFamily: MONO }}>
        P
      </text>
      <text x={41} y={34} textAnchor="middle" fontSize={4.6} fill="#1d4ed8" style={{ fontFamily: MONO }}>
        S
      </text>
      <S x={22} y={51} r={2} />
      <S x={42} y={51} r={2} />
    </g>
  );
}

function DcSource() {
  return (
    <g>
      <rect x={13} y={8} width={38} height={48} rx={5} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.2} />
      <circle cx={32} cy={26} r={9} fill="#0b1220" stroke="#475569" />
      <text x={32} y={26.5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f87171" style={{ fontFamily: MONO }}>
        +
      </text>
      <circle cx={32} cy={42} r={9} fill="#0b1220" stroke="#475569" />
      <text x={32} y={42.5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#60a5fa" style={{ fontFamily: MONO }}>
        −
      </text>
    </g>
  );
}

function GridPole() {
  return (
    <g>
      <line x1={16} y1={10} x2={48} y2={10} stroke="#475569" strokeWidth={2} />
      <line x1={20} y1={10} x2={20} y2={16} stroke="#94a3b8" strokeWidth={1.4} />
      <line x1={44} y1={10} x2={44} y2={16} stroke="#94a3b8" strokeWidth={1.4} />
      <rect x={24} y={15} width={16} height={11} rx={2} fill="#64748b" stroke="#334155" />
      <circle cx={28} cy={20.5} r={1.4} fill="#94a3b8" />
      <circle cx={36} cy={20.5} r={1.4} fill="#94a3b8" />
      <rect x={27} y={26} width={10} height={3} fill="#475569" />
      <line x1={32} y1={29} x2={32} y2={54} stroke="#7c5a36" strokeWidth={3.4} />
      <line x1={24} y1={40} x2={40} y2={40} stroke="#7c5a36" strokeWidth={2.6} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={22 + i * 10} y1={10} x2={22 + i * 10} y2={44} stroke={["#ef4444", "#eab308", "#3b82f6"][i]} strokeWidth={1.3} />
          <circle cx={22 + i * 10} cy={47} r={2.3} fill={["#ef4444", "#eab308", "#3b82f6"][i]} stroke="#0b1220" />
        </g>
      ))}
    </g>
  );
}

function CapBank() {
  const cols = ["#ef4444", "#eab308", "#3b82f6"];
  return (
    <g>
      {cols.map((c, i) => {
        const x = 13 + i * 14;
        return (
          <g key={i}>
            <circle cx={x + 5} cy={12} r={2} fill={c} stroke="#0b1220" />
            <line x1={x + 5} y1={14} x2={x + 5} y2={20} stroke="#64748b" strokeWidth={1.4} />
            <rect x={x} y={20} width={10} height={28} rx={3} fill="#94a3b8" stroke="#475569" />
            <ellipse cx={x + 5} cy={20} rx={5} ry={2.2} fill="#cbd5e1" stroke="#64748b" />
            <ellipse cx={x + 5} cy={48} rx={5} ry={2.2} fill="#64748b" />
          </g>
        );
      })}
      <text x={32} y={57} textAnchor="middle" fontSize={5} fill="#94a3b8" style={{ fontFamily: MONO }}>
        kVAr
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* PROTECTION                                                         */
/* ------------------------------------------------------------------ */

function Rcbo(n: number, on = true) {
  const mw = 12;
  const gap = 1.6;
  const total = mw * n + gap * (n - 1);
  const x0 = (64 - total) / 2;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + i * (mw + gap);
        const cx = x + mw / 2;
        return (
          <g key={i}>
            <rect x={x} y={6} width={mw} height={52} rx={2.2} fill="url(#g-mcb-top)" stroke="#a6b0bc" strokeWidth={0.7} />
            <SPlus x={cx} y={12.6} r={2.6} copper />
            {i === 0 ? (
              <g>
                <rect x={x + 1.6} y={22} width={mw - 3.2} height={11} rx={1.6} fill="url(#g-mcb-mid)" />
                <rect x={x + 2.4} y={23.4} width={mw - 4.8} height={8} rx={1.6} fill={on ? "#ef4444" : "#94a3b8"} stroke="#7f1d1d" strokeWidth={0.4} />
                <text x={cx} y={29.2} textAnchor="middle" fontSize={4.6} fontWeight={800} fill="#fff" style={{ fontFamily: MONO }}>
                  T
                </text>
              </g>
            ) : (
              <rect x={x + 1.6} y={22} width={mw - 3.2} height={11} rx={1.6} fill="url(#g-mcb-mid)" />
            )}
            {/* chamber */}
            <rect x={x + 0.9} y={33.6} width={mw - 1.8} height={16} rx={2} fill="#8b95a1" stroke="#68717d" strokeWidth={0.5} />
            <rect x={x + 1.5} y={34.2} width={mw - 3} height={14.8} rx={1.6} fill="url(#g-chamber)" />
            <circle cx={cx} cy={36} r={1.8} fill="#f7f9fb" stroke="#98a1ac" strokeWidth={0.8} />
            <rect
              x={cx - 5}
              y={on ? 37.8 : 42.8}
              width={10}
              height={5.6}
              rx={1.2}
              fill="#f97316"
              stroke="#b85c06"
              strokeWidth={0.4}
            />
            {!on && (
              <g>
                <rect x={cx - 3} y={46.9} width={6} height={3.2} rx={0.8} fill="#a6afba" />
                <line x1={cx} y1={47.5} x2={cx} y2={49.6} stroke="#39404a" strokeWidth={0.9} />
              </g>
            )}
            <rect x={x} y={49.6} width={mw} height={8.4} fill="url(#g-mcb-bot)" />
            <SPlus x={cx} y={53.6} r={2.6} copper />
            {i > 0 && <line x1={x - gap / 2} y1={6.6} x2={x - gap / 2} y2={57.4} stroke="#00000022" strokeWidth={0.5} />}
          </g>
        );
      })}
      <rect x={x0} y={20} width={total} height={2.2} fill="#f97316" />
    </g>
  );
}

function Knife({ n, open }: { n: number; open?: boolean }) {
  const xs = n === 3 ? [16, 32, 48] : [22, 42];
  return (
    <g>
      <rect x={8} y={10} width={48} height={44} rx={4} fill="#eef2f8" stroke="#8fa0b8" />
      {xs.map((x, i) => (
        <g key={i}>
          <S x={x} y={15} r={2} />
          <circle cx={x} cy={26} r={2.6} fill="#b9c6d8" stroke="#64748b" />
          <circle cx={x} cy={42} r={2.6} fill="#b9c6d8" stroke="#64748b" />
          <line
            x1={x}
            y1={26}
            x2={open ? x + 8 : x}
            y2={open ? 34 : 42}
            stroke={open ? "#ef4444" : "#7c5a36"}
            strokeWidth={2.6}
            strokeLinecap="round"
          />
          <S x={x} y={50} r={2} />
        </g>
      ))}
    </g>
  );
}

function HrcFuse({ holder }: { holder?: boolean }) {
  return (
    <g>
      {holder && (
        <g>
          <rect x={12} y={30} width={40} height={16} rx={3} fill="#cbd5e1" stroke="#64748b" />
          <circle cx={18} cy={38} r={3} fill="#94a3b8" stroke="#475569" />
          <circle cx={46} cy={38} r={3} fill="#94a3b8" stroke="#475569" />
          <circle cx={40} cy={16} r={1.6} fill="#f87171" />
        </g>
      )}
      <rect x={14} y={holder ? 22 : 24} width={36} height={holder ? 12 : 16} rx={6} fill="#e2e8f0" stroke="#64748b" strokeWidth={1.1} />
      <rect x={10} y={holder ? 23 : 26} width={8} height={holder ? 10 : 12} rx={2} fill="#f59e0b" stroke="#b45309" />
      <rect x={46} y={holder ? 23 : 26} width={8} height={holder ? 10 : 12} rx={2} fill="#f59e0b" stroke="#b45309" />
      <line x1={20} y1={holder ? 28 : 32} x2={44} y2={holder ? 28 : 32} stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="2 2" />
      <S x={14} y={holder ? 42 : 48} r={2} />
      <S x={50} y={holder ? 42 : 48} r={2} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* CONTACTORS / RELAYS                                                */
/* ------------------------------------------------------------------ */

function Ssr() {
  return (
    <g>
      <rect x={12} y={10} width={40} height={44} rx={3} fill="#334155" stroke="#0b1220" strokeWidth={1.2} />
      {[15, 26, 37, 48].map((y) => (
        <g key={y}>
          <rect x={9} y={y - 3} width={6} height={6} rx={1} fill="#94a3b8" stroke="#475569" />
          <rect x={49} y={y - 3} width={6} height={6} rx={1} fill="#94a3b8" stroke="#475569" />
        </g>
      ))}
      <rect x={26} y={20} width={12} height={20} rx={2} fill="#0f172a" stroke="#155e75" />
      <text x={32} y={27} textAnchor="middle" fontSize={5} fontWeight={700} fill="#22d3ee" style={{ fontFamily: MONO }}>
        SSR
      </text>
      <circle cx={32} cy={35} r={2} fill="#22c55e" />
    </g>
  );
}

function IceCube() {
  return (
    <g>
      <rect x={16} y={12} width={32} height={28} rx={3} fill="#f1f5f9" stroke="#64748b" />
      <rect x={16} y={12} width={32} height={7} rx={3} fill="#dbe3ee" />
      <text x={32} y={17} textAnchor="middle" fontSize={5.4} fontWeight={700} fill="#334155" style={{ fontFamily: MONO }}>
        24VDC
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={19 + i * 7} y={31} width={4} height={6} fill="#94a3b8" />
      ))}
      <rect x={19} y={40} width={26} height={6} rx={1.5} fill="#0b1220" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={20 + i * 5.2} y={46} width={3} height={6} fill="#64748b" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={20 + i * 5.2} y={52} width={3} height={3} fill="#475569" />
      ))}
    </g>
  );
}

function OctalBase() {
  return (
    <g>
      <rect x={12} y={10} width={40} height={44} rx={4} fill="#1f2937" stroke="#0b1220" />
      {[0, 1, 2, 3].map((i) => (
        <g key={`t${i}`}>
          <S x={18 + i * 9.4} y={14} r={1.8} />
          <S x={18 + i * 9.4} y={50} r={1.8} />
        </g>
      ))}
      <circle cx={32} cy={32} r={11} fill="#0b1220" stroke="#475569" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={32 + Math.cos(a) * 7} cy={32 + Math.sin(a) * 7} r={1.1} fill="#94a3b8" />;
      })}
    </g>
  );
}

function AuxBlock() {
  return (
    <g>
      <rect x={14} y={16} width={36} height={32} rx={3} fill="#f1f5f9" stroke="#8fa0b8" />
      <text x={32} y={24} textAnchor="middle" fontSize={5} fontWeight={700} fill="#16a34a" style={{ fontFamily: MONO }}>
        13-14 NO
      </text>
      <text x={32} y={41} textAnchor="middle" fontSize={5} fontWeight={700} fill="#dc2626" style={{ fontFamily: MONO }}>
        11-12 NC
      </text>
      {[22, 42].map((x) => (
        <S key={x} x={x} y={13} r={1.8} />
      ))}
      {[18, 27.3, 36.6, 46].map((x) => (
        <S key={x} x={x} y={51} r={1.8} />
      ))}
    </g>
  );
}

function Interlock() {
  return (
    <g>
      <rect x={20} y={14} width={24} height={36} rx={3} fill="#fbbf24" stroke="#b45309" />
      <path d="M26 22 l12 12 M38 22 l-12 12" stroke="#7c2d12" strokeWidth={2} />
      <text x={32} y={46} textAnchor="middle" fontSize={5} fontWeight={700} fill="#7c2d12" style={{ fontFamily: MONO }}>
        INT
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* AUTOMATION                                                         */
/* ------------------------------------------------------------------ */

function Hmi() {
  return (
    <g>
      <rect x={8} y={12} width={48} height={40} rx={4} fill="#1e293b" stroke="#0b1220" strokeWidth={1.2} />
      <rect x={12} y={16} width={40} height={22} rx={2} fill="#04121a" stroke="#155e75" />
      <rect x={15} y={19} width={20} height={2.4} fill="#22d3ee" opacity={0.8} />
      <rect x={15} y={24} width={28} height={2} fill="#164e63" />
      <rect x={15} y={29} width={14} height={2} fill="#164e63" />
      <circle cx={44} cy={27} r={4} fill="#22c55e" opacity={0.85} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={13 + i * 8} y={41} width={6} height={6} rx={1.2} fill="#334155" stroke="#0b1220" />
      ))}
    </g>
  );
}

function PlcRack() {
  return (
    <g>
      <rect x={7} y={14} width={50} height={36} rx={3} fill="#d3dceb" stroke="#7e8da8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={10 + i * 9.4} y={18} width={7.6} height={20} rx={1.2} fill={i === 0 ? "#16a34a" : i === 4 ? "#ef4444" : "#475569"} stroke="#1e293b" />
          <circle cx={13.8 + i * 9.4} cy={21.5} r={1.1} fill="#bbf7d0" />
          {[0, 1, 2].map((j) => (
            <rect key={j} x={11.6 + i * 9.4} y={40} width={4.4} height={4} fill="#94a3b8" />
          ))}
        </g>
      ))}
      <rect x={10} y={45} width={44} height={3} rx={1} fill="#7e8da8" />
    </g>
  );
}

function EthSwitch({ active }: GlyphProps) {
  return (
    <g>
      <rect x={8} y={22} width={48} height={22} rx={3} fill="#1e293b" stroke="#0b1220" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={11 + i * 12} y={26} width={9} height={9} rx={1} fill="#0b1220" stroke="#334155" />
          <rect x={13 + i * 12} y={29} width={5} height={2} fill="#475569" />
          <circle className={active ? "ep-glow" : undefined} cx={13 + i * 12} cy={40} r={1.1} fill="#22c55e" />
          <circle cx={18 + i * 12} cy={40} r={1.1} fill="#facc15" />
        </g>
      ))}
    </g>
  );
}

function Pid() {
  return (
    <g>
      <rect x={11} y={11} width={42} height={42} rx={4} fill="#eef2f8" stroke="#8fa0b8" />
      <Screen x={15} y={15} w={34} h={11} />
      <text x={32} y={22.6} textAnchor="middle" fontSize={6.4} fontWeight={700} fill="#ef4444" style={{ fontFamily: MONO }}>
        85.0°C
      </text>
      <rect x={15} y={29} width={10} height={9} rx={2} fill="#3b82f6" stroke="#1e40af" />
      <rect x={27} y={29} width={10} height={9} rx={2} fill="#ef4444" stroke="#991b1b" />
      <text x={20} y={35} textAnchor="middle" fontSize={6} fill="#fff">▲</text>
      <text x={32} y={35} textAnchor="middle" fontSize={6} fill="#fff">▼</text>
      <rect x={39} y={29} width={10} height={9} rx={2} fill="#94a3b8" />
      <rect x={15} y={41} width={34} height={8} rx={1.5} fill="#d3dceb" />
      <circle cx={20} cy={45} r={1.8} fill="#22c55e" />
      <circle cx={28} cy={45} r={1.8} fill="#ef4444" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* BUTTONS / SWITCHES                                                 */
/* ------------------------------------------------------------------ */

function LitPB({ solid, lens, pressed }: { solid: string; lens: string; pressed?: boolean }) {
  return (
    <g>
      <rect x={12} y={13} width={40} height={40} rx={6} fill="#eef2f8" stroke="#8fa0b8" strokeWidth={1.2} />
      <g transform={pressed ? "translate(0 2)" : undefined}>
        <Lens x={32} y={32} r={12} id={lens} solid={solid} active={pressed} />
      </g>
      <S x={16.5} y={17.5} r={1.7} />
      <S x={47.5} y={17.5} r={1.7} />
      <S x={16.5} y={48.5} r={1.7} />
      <S x={47.5} y={48.5} r={1.7} />
    </g>
  );
}

function DoublePB({ pressed }: { pressed?: boolean }) {
  return (
    <g>
      <rect x={9} y={13} width={46} height={40} rx={6} fill="#eef2f8" stroke="#8fa0b8" />
      <rect x={13} y={17} width={18} height={32} rx={4} fill="#dbe3ee" stroke="#94a3b8" />
      <rect x={33} y={17} width={18} height={32} rx={4} fill="#dbe3ee" stroke="#94a3b8" />
      <g transform={pressed ? "translate(0 1.6)" : undefined}>
        <Lens x={22} y={29} r={7.4} id="lg-green" solid="#22c55e" />
        <Lens x={42} y={29} r={7.4} id="lg-red" solid="#ef4444" />
      </g>
      <text x={22} y={42} textAnchor="middle" fontSize={5.5} fontWeight={700} fill="#15803d">I</text>
      <text x={42} y={42} textAnchor="middle" fontSize={5.5} fontWeight={700} fill="#b91c1c">O</text>
      <S x={15} y={49} r={1.5} />
      <S x={49} y={49} r={1.5} />
    </g>
  );
}

function KeySwitch({ three, on }: { three?: boolean; on?: boolean }) {
  const ang = on ? (three ? 40 : -38) : three ? -40 : 38;
  const rad = (ang * Math.PI) / 180;
  return (
    <g>
      <rect x={11} y={13} width={42} height={40} rx={6} fill="#eef2f8" stroke="#8fa0b8" />
      <circle cx={32} cy={33} r={12} fill="#0b1220" stroke="#475569" />
      <circle cx={32} cy={33} r={8} fill={on ? "#14532d" : "#334155"} />
      <line
        x1={32}
        y1={33}
        x2={32 + Math.sin(rad) * 7}
        y2={33 - Math.cos(rad) * 7}
        stroke="#fbbf24"
        strokeWidth={2.2}
      />
      <circle cx={32} cy={33} r={1.8} fill="#fbbf24" />
      <text x={32} y={47} textAnchor="middle" fontSize={5.4} fill="#475569" fontWeight={700} style={{ fontFamily: MONO }}>
        {three ? "1-0-2" : "I / O"}
      </text>
    </g>
  );
}

function Joystick() {
  return (
    <g>
      <rect x={12} y={26} width={40} height={26} rx={5} fill="#334155" stroke="#0b1220" />
      <circle cx={32} cy={38} r={9} fill="#0b1220" stroke="#475569" />
      <line x1={32} y1={38} x2={38} y2={22} stroke="#94a3b8" strokeWidth={3.4} strokeLinecap="round" />
      <circle cx={39} cy={20} r={4} fill="#ef4444" stroke="#7f1d1d" />
      <path d="M25 33 q7 3 14 0" fill="none" stroke="#64748b" strokeWidth={1.2} strokeDasharray="2 2" />
      <S x={16} y={48} r={1.6} />
      <S x={48} y={48} r={1.6} />
    </g>
  );
}

function FootSwitch() {
  return (
    <g>
      <rect x={10} y={34} width={44} height={16} rx={4} fill="#475569" stroke="#1e293b" />
      <path d="M14 34 q8 -18 18 -18 q10 0 18 18 z" fill="#64748b" stroke="#334155" />
      <rect x={24} y={22} width={16} height={8} rx={3} fill="#ef4444" stroke="#7f1d1d" />
      <line x1={16} y1={44} x2={48} y2={44} stroke="#1e293b" strokeWidth={1.2} />
      <circle cx={16} cy={51} r={1.8} fill="#94a3b8" />
      <circle cx={48} cy={51} r={1.8} fill="#94a3b8" />
    </g>
  );
}

function Toggle({ on }: { on?: boolean }) {
  return (
    <g>
      <rect x={14} y={20} width={36} height={28} rx={5} fill="#eef2f8" stroke="#8fa0b8" />
      <circle cx={22} cy={42} r={2.4} fill="#b9c6d8" stroke="#64748b" />
      <circle cx={42} cy={42} r={2.4} fill="#b9c6d8" stroke="#64748b" />
      <circle cx={22} cy={26} r={2.4} fill="#b9c6d8" stroke="#64748b" />
      <circle cx={42} cy={26} r={2.4} fill={on ? "#22c55e" : "#b9c6d8"} />
      <line
        x1={22}
        y1={40}
        x2={on ? 40 : 24}
        y2={on ? 28 : 28}
        stroke={on ? "#22c55e" : "#64748b"}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </g>
  );
}

function CamSwitch({ on }: { on?: boolean }) {
  return (
    <g>
      <rect x={16} y={9} width={32} height={46} rx={3} fill="#eef2f8" stroke="#8fa0b8" />
      <S x={20} y={13} r={1.7} />
      <S x={44} y={13} r={1.7} />
      <circle cx={32} cy={28} r={9} fill="#334155" stroke="#0b1220" />
      <line x1={32} y1={28} x2={on ? 38 : 26} y2={on ? 22 : 22} stroke="#f8fafc" strokeWidth={2} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={20 + (i % 2) * 18} y={40 + Math.floor(i / 2) * 6} width={8} height={4} rx={1} fill="#cbd5e1" />
      ))}
    </g>
  );
}

function EStopKey() {
  return (
    <g>
      <rect x={8} y={16} width={30} height={34} rx={6} fill="#facc15" stroke="#ca8a04" />
      <circle cx={23} cy={33} r={12} fill="url(#lg-red)" stroke="#7f1d1d" />
      <rect x={36} y={22} width={20} height={22} rx={3} fill="#eef2f8" stroke="#8fa0b8" />
      <circle cx={46} cy={31} r={6} fill="#0b1220" stroke="#475569" />
      <line x1={46} y1={31} x2={50} y2={27} stroke="#fbbf24" strokeWidth={1.8} />
      <S x={12} y={46} r={1.5} />
      <S x={34} y={46} r={1.5} />
      <circle cx={41} cy={46} r={1.6} fill="#94a3b8" />
      <circle cx={51} cy={46} r={1.6} fill="#94a3b8" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* SENSORS                                                            */
/* ------------------------------------------------------------------ */

function Proximity({ c, sym }: { c: string; sym: string }) {
  return (
    <g>
      <rect x={14} y={10} width={26} height={26} rx={4} fill={c} stroke="#0b1220" />
      <circle cx={34} cy={23} r={7} fill="#0b1220" stroke="#334155" />
      <circle cx={34} cy={23} r={3.4} fill="#facc15" />
      <rect x={18} y={36} width={20} height={14} rx={2} fill="#cdd6e4" stroke="#7e8da8" />
      <circle cx={24} cy={43} r={2.2} fill="#f97316" />
      <circle cx={36} cy={43} r={2.2} fill="#16a34a" />
      <text x={23} y={26} textAnchor="middle" fontSize={7} fontWeight={700} fill="#fff" style={{ fontFamily: MONO }}>
        {sym}
      </text>
    </g>
  );
}

function PhotoPair({ active }: GlyphProps) {
  return (
    <g>
      <rect x={8} y={18} width={14} height={22} rx={2} fill="#1d4ed8" stroke="#172554" />
      <rect x={42} y={18} width={14} height={22} rx={2} fill="#334155" stroke="#0b1220" />
      <circle cx={15} cy={24} r={2.6} fill="#facc15" />
      <circle cx={49} cy={24} r={2.6} fill="#0b1220" stroke="#64748b" />
      <line x1={18} y1={30} x2={42} y2={30} stroke="#facc15" strokeWidth={1} strokeDasharray="3 3" className={active ? "ep-glow" : undefined} />
      <rect x={10} y={40} width={10} height={10} rx={2} fill="#cdd6e4" />
      <rect x={44} y={40} width={10} height={10} rx={2} fill="#cdd6e4" />
      <circle cx={15} cy={48} r={2} fill="#16a34a" />
      <circle cx={49} cy={48} r={2} fill="#f97316" />
    </g>
  );
}

function Encoder({ active }: GlyphProps) {
  return (
    <g>
      <rect x={16} y={16} width={32} height={32} rx={5} fill="#334155" stroke="#0b1220" />
      <circle cx={32} cy={32} r={11} fill="#0b1220" stroke="#475569" />
      <g className={active ? "ep-rotor-fast" : undefined}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <rect
              key={i}
              x={31.4}
              y={23}
              width={1.4}
              height={4}
              fill={active && i % 2 ? "#22d3ee" : "#155e75"}
              transform={`rotate(${(a * 180) / Math.PI} 32 32)`}
            />
          );
        })}
      </g>
      <circle cx={32} cy={32} r={2.4} fill="#22d3ee" />
      <rect x={27} y={48} width={10} height={6} fill="#94a3b8" />
      <circle cx={29} cy={53} r={1.5} fill="#16a34a" />
      <circle cx={35} cy={53} r={1.5} fill="#f97316" />
    </g>
  );
}

function Probe() {
  return (
    <g>
      <rect x={24} y={8} width={16} height={10} rx={2} fill="#cdd6e4" stroke="#7e8da8" />
      <rect x={26} y={18} width={12} height={8} fill="#94a3b8" />
      <line x1={32} y1={26} x2={32} y2={50} stroke="#b9c6d8" strokeWidth={3} />
      <circle cx={32} cy={52} r={3.4} fill="#ef4444" stroke="#991b1b" />
      <circle cx={24} cy={13} r={1.6} fill="#ef4444" />
      <circle cx={40} cy={13} r={1.6} fill="#3b82f6" />
    </g>
  );
}

function PressTx() {
  return (
    <g>
      <circle cx={32} cy={22} r={12} fill="#f8fafc" stroke="#64748b" />
      <line x1={32} y1={22} x2={38} y2={16} stroke="#334155" strokeWidth={1.4} />
      <text x={32} y={29} textAnchor="middle" fontSize={4.6} fill="#64748b" style={{ fontFamily: MONO }}>
        bar
      </text>
      <rect x={24} y={34} width={16} height={6} rx={1.5} fill="#64748b" />
      <rect x={20} y={40} width={24} height={10} rx={2} fill="#cdd6e4" stroke="#7e8da8" />
      <circle cx={27} cy={46} r={2} fill="#16a34a" />
      <circle cx={37} cy={46} r={2} fill="#f97316" />
    </g>
  );
}

function FlowSwitch() {
  return (
    <g>
      <rect x={9} y={26} width={46} height={12} rx={6} fill="#71809a" stroke="#475569" />
      <path d="M15 32 h7 l4 -6 v12 l-4 -6 h-7 z" fill="#cbd5e1" stroke="#64748b" />
      <circle cx={45} cy={32} r={2} fill="#94a3b8" />
      <line x1={32} y1={26} x2={32} y2={18} stroke="#475569" strokeWidth={2} />
      <rect x={26} y={9} width={12} height={9} rx={2} fill="#1d4ed8" stroke="#172554" />
      <circle cx={32} cy={13.5} r={2} fill="#facc15" />
    </g>
  );
}

function Smoke() {
  return (
    <g>
      <circle cx={32} cy={30} r={15} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1.4} />
      <circle cx={32} cy={30} r={9} fill="#dbe3ee" />
      <rect x={29} y={26} width={6} height={6} rx={1} fill="#475569" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <circle key={i} cx={32 + Math.cos(a) * 6} cy={30 + Math.sin(a) * 6} r={0.9} fill="#64748b" />;
      })}
      <rect x={27} y={45} width={10} height={5} rx={1.5} fill="#94a3b8" />
      <circle cx={29} cy={52} r={1.5} fill="#ef4444" />
      <circle cx={35} cy={52} r={1.5} fill="#3b82f6" />
    </g>
  );
}

function Reed() {
  return (
    <g>
      <rect x={12} y={24} width={40} height={14} rx={7} fill="#bfdbfe" stroke="#60a5fa" strokeWidth={1.2} />
      <line x1={18} y1={31} x2={28} y2={28} stroke="#b91c1c" strokeWidth={1.6} />
      <line x1={46} y1={31} x2={36} y2={28} stroke="#b91c1c" strokeWidth={1.6} />
      <line x1={12} y1={31} x2={18} y2={31} stroke="#475569" strokeWidth={1.4} />
      <line x1={46} y1={31} x2={52} y2={31} stroke="#475569" strokeWidth={1.4} />
      <rect x={44} y={12} width={10} height={8} rx={1.5} fill="#ef4444" stroke="#991b1b" />
      <line x1={49} y1={20} x2={46} y2={24} stroke="#64748b" />
    </g>
  );
}

function Pir() {
  return (
    <g>
      <path d="M14 40 L32 12 L50 40 z" fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.2} />
      <circle cx={32} cy={31} r={5} fill="#0b1220" stroke="#64748b" />
      <circle cx={32} cy={31} r={2.2} fill="#22d3ee" />
      <path d="M22 38 q10 -8 20 0" fill="none" stroke="#cbd5e1" strokeWidth={1.2} />
      <rect x={24} y={40} width={16} height={8} rx={2} fill="#cdd6e4" stroke="#7e8da8" />
      <circle cx={28} cy={47} r={1.8} fill="#16a34a" />
      <circle cx={36} cy={47} r={1.8} fill="#f97316" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* SIGNALING                                                          */
/* ------------------------------------------------------------------ */

function Tower() {
  const cols = ["#ef4444", "#f59e0b", "#22c55e"];
  return (
    <g>
      {cols.map((c, i) => (
        <g key={i}>
          <rect x={22} y={10 + i * 11} width={20} height={10} rx={2} fill={c} stroke="#0b1220" opacity={0.55 + i * 0.2} />
          <ellipse cx={32} cy={10 + i * 11} rx={10} ry={2} fill="#fff" opacity={0.35} />
        </g>
      ))}
      <rect x={29} y={43} width={6} height={6} fill="#475569" />
      <rect x={22} y={49} width={20} height={4} rx={1.5} fill="#334155" />
    </g>
  );
}

function Beacon({ active }: GlyphProps) {
  return (
    <g>
      <rect x={22} y={44} width={20} height={7} rx={2} fill="#334155" />
      <path d="M22 44 a10 10 0 0 1 20 0 z" fill="#f59e0b" stroke="#b45309" />
      <path className={active ? "ep-glow" : undefined} d="M32 34 l-7 10 h14 z" fill="#fde68a" opacity={active ? 0.85 : 0.45} />
      <ellipse cx={29} cy={36} rx={2.4} ry={3.4} fill="#fff" opacity={0.5} />
    </g>
  );
}

function Horn({ active }: GlyphProps) {
  return (
    <g>
      <rect x={16} y={28} width={10} height={10} rx={2} fill="#334155" stroke="#0b1220" />
      <path d="M26 26 L50 16 v34 L26 40 z" fill="#f59e0b" stroke="#b45309" strokeWidth={1.2} />
      {active &&
        [22, 27].map((x, i) => (
          <path key={i} d={`M${x} 24 q5 8 0 18`} fill="none" stroke="#fbbf24" strokeWidth={1.3} opacity={0.8 - i * 0.3} className="ep-glow" />
        ))}
      <circle cx={18} cy={46} r={1.8} fill="#94a3b8" />
      <circle cx={26} cy={46} r={1.8} fill="#94a3b8" />
    </g>
  );
}

function Bell() {
  return (
    <g>
      <path d="M18 38 a14 14 0 0 1 28 0 z" fill="#94a3b8" stroke="#475569" strokeWidth={1.2} />
      <rect x={29} y={18} width={6} height={4} rx={1.5} fill="#64748b" />
      <circle cx={32} cy={42} r={3} fill="#475569" />
      <line x1={32} y1={45} x2={32} y2={49} stroke="#475569" strokeWidth={1.6} />
      <circle cx={24} cy={51} r={2} fill="#94a3b8" />
      <circle cx={40} cy={51} r={2} fill="#94a3b8" />
    </g>
  );
}

function AnalogGauge(unit: string) {
  return function G() {
    return (
      <g>
        <rect x={14} y={9} width={36} height={46} rx={5} fill="#eef2f8" stroke="#8fa0b8" />
        <circle cx={32} cy={29} r={14} fill="#fff" stroke="#64748b" strokeWidth={1.4} />
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (-22 + i * 7.3) * (Math.PI / 180);
          return (
            <line key={i} x1={32 + Math.sin(a) * 10} y1={29 - Math.cos(a) * 10} x2={32 + Math.sin(a) * 12} y2={29 - Math.cos(a) * 12} stroke="#475569" strokeWidth={0.9} />
          );
        })}
        <line x1={32} y1={29} x2={39} y2={21} stroke="#dc2626" strokeWidth={1.5} />
        <circle cx={32} cy={29} r={1.8} fill="#334155" />
        <text x={32} y={46} textAnchor="middle" fontSize={7} fontWeight={700} fill="#334155" style={{ fontFamily: MONO }}>
          {unit}
        </text>
      </g>
    );
  };
}

function DigiMeter(text: string) {
  return function G() {
    return (
      <g>
        <rect x={15} y={13} width={34} height={40} rx={4} fill="#1f2937" stroke="#0b1220" strokeWidth={1.2} />
        <rect x={19} y={17} width={26} height={12} rx={1.5} fill="#04140f" stroke="#14532d" />
        <text x={32} y={25} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#4ade80" style={{ fontFamily: MONO }}>
          {text}
        </text>
        <circle cx={24} cy={37} r={2.4} fill="#ef4444" />
        <circle cx={32} cy={37} r={2.4} fill="#eab308" />
        <circle cx={40} cy={37} r={2.4} fill="#3b82f6" />
        <rect x={19} y={43} width={26} height={6} rx={1.5} fill="#111827" />
      </g>
    );
  };
}

function KwhMeter() {
  return (
    <g>
      <rect x={12} y={9} width={40} height={46} rx={4} fill="#eef2f8" stroke="#8fa0b8" />
      <rect x={16} y={13} width={32} height={11} rx={1.5} fill="#e5e7eb" stroke="#94a3b8" />
      <text x={32} y={21} textAnchor="middle" fontSize={7} fontWeight={700} fill="#1f2937" style={{ fontFamily: MONO }}>
        00482.6
      </text>
      <circle cx={32} cy={34} r={8} fill="#fff" stroke="#64748b" />
      <line x1={32} y1={34} x2={37} y2={30} stroke="#334155" strokeWidth={1.2} />
      <circle cx={22} cy={48} r={2} fill="#94a3b8" />
      <circle cx={42} cy={48} r={2} fill="#94a3b8" />
      <S x={22} y={12} r={1.5} />
      <S x={42} y={12} r={1.5} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* LOADS                                                              */
/* ------------------------------------------------------------------ */

function DcMotor({ active }: GlyphProps) {
  return (
    <g>
      <rect x={20} y={13} width={16} height={8} rx={2} fill="#1e293b" />
      <circle cx={24} cy={13} r={2} fill="#ef4444" stroke="#991b1b" />
      <circle cx={38} cy={13} r={2} fill="#3b82f6" stroke="#1e40af" />
      <rect x={11} y={21} width={34} height={26} rx={5} fill="#7c3aed" stroke="#4c1d95" strokeWidth={1.2} />
      <text x={28} y={37} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ede9fe" style={{ fontFamily: MONO }}>
        DC
      </text>
      <circle cx={47} cy={34} r={10} fill="#1f2937" stroke="#0b1220" />
      <g className={active ? "ep-rotor" : undefined}>
        {[0, 120, 240].map((a) => (
          <ellipse key={a} cx={47} cy={29} rx={2} ry={4.4} fill="#0b1220" transform={`rotate(${a} 47 34)`} />
        ))}
      </g>
      <rect x={15} y={47} width={26} height={4} rx={1} fill="#4c1d95" />
    </g>
  );
}

function ServoMotor() {
  return (
    <g>
      <rect x={12} y={20} width={28} height={26} rx={4} fill="#0369a1" stroke="#0c4a6e" strokeWidth={1.2} />
      <rect x={40} y={24} width={14} height={18} rx={3} fill="#075985" stroke="#0c4a6e" />
      <circle cx={47} cy={33} r={5} fill="#0b1220" stroke="#38bdf8" strokeWidth={1.4} />
      <line x1={47} y1={33} x2={47} y2={29} stroke="#f8fafc" strokeWidth={1.6} />
      <rect x={16} y={46} width={20} height={7} rx={1.5} fill="#e5e7eb" stroke="#94a3b8" />
      <circle cx={20} cy={49.5} r={1.6} fill={C1()} />
      <circle cx={27} cy={49.5} r={1.6} fill={C2()} />
      <circle cx={34} cy={49.5} r={1.6} fill={C3()} />
    </g>
  );
}
const C1 = () => "#ef4444";
const C2 = () => "#eab308";
const C3 = () => "#3b82f6";

function AxialFan({ active }: GlyphProps) {
  return (
    <g>
      <circle cx={32} cy={32} r={20} fill="#475569" stroke="#1e293b" strokeWidth={2} />
      <circle cx={32} cy={32} r={16} fill="#0f172a" />
      <g className={active ? "ep-rotor-fast" : undefined}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d="M32 32 q2 -9 9 -11 q-2 8 -7 10 z" fill="#64748b" transform={`rotate(${a} 32 32)`} />
        ))}
      </g>
      <circle cx={32} cy={32} r={3.4} fill="#94a3b8" />
      <circle cx={20} cy={53} r={1.8} fill="#94a3b8" />
      <circle cx={44} cy={53} r={1.8} fill="#94a3b8" />
    </g>
  );
}

function Compressor({ active }: GlyphProps) {
  return (
    <g>
      <rect x={9} y={40} width={30} height={12} rx={6} fill="#b91c1c" stroke="#7f1d1d" />
      <ellipse cx={24} cy={40} rx={15} ry={4} fill="#dc2626" stroke="#7f1d1d" />
      <rect x={33} y={22} width={18} height={16} rx={3} fill="#334155" stroke="#0b1220" />
      <circle cx={42} cy={30} r={6} fill="#0b1220" stroke="#475569" />
      <g className={active ? "ep-rotor-fast" : undefined}>
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={a} cx={42} cy={26.4} rx={1.4} ry={3.2} fill="#475569" transform={`rotate(${a} 42 30)`} />
        ))}
      </g>
      <line x1={33} y1={30} x2={24} y2={36} stroke="#64748b" strokeWidth={2} />
      <rect x={40} y={16} width={8} height={5} rx={1.5} fill="#94a3b8" />
      <circle cx={42} cy={13} r={2.2} fill="#22c55e" />
      <circle cx={15} cy={54} r={1.7} fill="#ef4444" />
      <circle cx={22} cy={54} r={1.7} fill="#eab308" />
      <circle cx={29} cy={54} r={1.7} fill="#3b82f6" />
    </g>
  );
}

function Conveyor({ active }: GlyphProps) {
  return (
    <g>
      <rect x={8} y={26} width={48} height={16} rx={8} fill="#475569" stroke="#1e293b" />
      <g className={active ? "ep-rotor-fast" : undefined} style={{ transformOrigin: "17px 34px" }}>
        <circle cx={17} cy={34} r={5} fill="#0b1220" />
      </g>
      <g className={active ? "ep-rotor-fast" : undefined} style={{ transformOrigin: "47px 34px" }}>
        <circle cx={47} cy={34} r={5} fill="#0b1220" />
      </g>
      {[22, 29, 36, 43].map((x) => (
        <line key={x} x1={x} y1={27} x2={x - 3} y2={41} stroke="#94a3b8" strokeWidth={1.2} />
      ))}
      <rect x={20} y={16} width={10} height={9} rx={1.5} fill="#b45309" />
      <rect x={35} y={18} width={8} height={7} rx={1.5} fill="#b45309" />
      <line x1={14} y1={42} x2={14} y2={52} stroke="#64748b" strokeWidth={2} />
      <line x1={50} y1={42} x2={50} y2={52} stroke="#64748b" strokeWidth={2} />
      <circle cx={14} cy={54} r={1.8} fill="#ef4444" />
      <circle cx={50} cy={54} r={1.8} fill="#3b82f6" />
    </g>
  );
}

function Heater({ active }: GlyphProps) {
  return (
    <g>
      <rect x={9} y={22} width={46} height={20} rx={3} fill="#7c2d12" stroke="#431407" />
      <path
        className={active ? "ep-glow" : undefined}
        d="M14 32 h6 l3 -6 l6 12 l6 -12 l6 12 l3 -6 h6"
        fill="none"
        stroke={active ? "#f97316" : "#9a3412"}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {[15, 24, 33, 42, 49].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 16 : 48} r={2} fill={i % 2 ? "#3b82f6" : "#ef4444"} stroke="#0b1220" />
      ))}
      <line x1={15} y1={20} x2={15} y2={22} stroke="#94a3b8" />
      <line x1={49} y1={44} x2={49} y2={48} stroke="#94a3b8" />
    </g>
  );
}

function LedBulb({ active }: GlyphProps) {
  return (
    <g>
      {active && <circle className="ep-glow" cx={32} cy={26} r={14} fill="#fef9c3" opacity={0.35} />}
      <path d="M22 28 a10 10 0 1 1 20 0 q-2 5 -4 6 h-12 q-2 -1 -4 -6 z" fill={active ? "#fef9c3" : "rgba(241,245,249,0.4)"} stroke="#94a3b8" strokeWidth={1.1} />
      {[25, 29, 33, 37].map((x, i) => (
        <line key={x} x1={x} y1={34} x2={x - (i - 1.5) * 1.4} y2={40} stroke="#94a3b8" strokeWidth={1.1} />
      ))}
      <rect x={26} y={38} width={12} height={4} rx={1} fill="url(#g-metal)" stroke="#74839e" />
      <rect x={25.5} y={42} width={13} height={3} rx={1} fill="#aeb9cc" stroke="#74839e" />
      <rect x={25.5} y={45.5} width={13} height={4.5} rx={1.2} fill="#94a3b8" stroke="#64748b" />
    </g>
  );
}

function TubeLight({ active }: GlyphProps) {
  return (
    <g>
      {active && <rect className="ep-glow" x={10} y={26} width={44} height={10} rx={5} fill="#fef9c3" opacity={0.35} />}
      <rect x={12} y={28} width={40} height={7} rx={3.5} fill={active ? "#fefce8" : "#e2e8f0"} stroke="#94a3b8" />
      <rect x={7} y={27} width={6} height={9} rx={1.5} fill="#64748b" />
      <rect x={51} y={27} width={6} height={9} rx={1.5} fill="#64748b" />
      <line x1={7} y1={36} x2={7} y2={44} stroke="#64748b" strokeWidth={1.6} />
      <line x1={57} y1={36} x2={57} y2={44} stroke="#64748b" strokeWidth={1.6} />
      <circle cx={7} cy={46} r={1.8} fill="#ef4444" />
      <circle cx={57} cy={46} r={1.8} fill="#3b82f6" />
    </g>
  );
}

function Solenoid({ active }: GlyphProps) {
  return (
    <g>
      <rect x={26} y={10} width={12} height={18} rx={2} fill={active ? "#22c55e" : "#64748b"} stroke="#1f293b" />
      <path
        d="M28 13 h8 M28 17 h8 M28 21 h8 M28 25 h8"
        stroke="#0b1220"
        strokeWidth={1.2}
        className={active ? "ep-glow" : undefined}
      />
      <rect x={18} y={28} width={28} height={14} rx={3} fill="#b45309" stroke="#78350f" />
      <circle cx={25} cy={35} r={3} fill="#78350f" />
      <circle cx={39} cy={35} r={3} fill="#78350f" />
      <line x1={25} y1={35} x2={39} y2={35} stroke="#fde68a" strokeWidth={2} />
      <rect x={22} y={42} width={20} height={5} rx={1} fill="#78350f" />
      <circle cx={26} cy={51} r={1.8} fill="#ef4444" />
      <circle cx={38} cy={51} r={1.8} fill="#3b82f6" />
      <line x1={29} y1={28} x2={29} y2={26} stroke="#64748b" strokeWidth={1.4} />
      <line x1={35} y1={28} x2={35} y2={26} stroke="#64748b" strokeWidth={1.4} />
    </g>
  );
}

function ElectroMagnet({ active }: GlyphProps) {
  return (
    <g>
      <path d="M18 46 v-18 a14 14 0 0 1 28 0 v18" fill="none" stroke="#475569" strokeWidth={5} strokeLinecap="round" />
      <path d="M18 46 v-18 a14 14 0 0 1 28 0 v18" fill="none" stroke={active ? "#ef4444" : "#b91c1c"} strokeWidth={2} strokeDasharray="3 2" />
      <rect x={14} y={44} width={36} height={7} rx={2} fill="#94a3b8" stroke="#475569" />
      {active && (
        <g className="ep-glow">
          <line x1={20} y1={20} x2={14} y2={14} stroke="#facc15" strokeWidth={1.4} />
          <line x1={32} y1={16} x2={32} y2={9} stroke="#facc15" strokeWidth={1.4} />
          <line x1={44} y1={20} x2={50} y2={14} stroke="#facc15" strokeWidth={1.4} />
        </g>
      )}
      <circle cx={22} cy={54} r={1.8} fill="#ef4444" />
      <circle cx={42} cy={54} r={1.8} fill="#3b82f6" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* WIRING                                                             */
/* ------------------------------------------------------------------ */

function DistBlock() {
  return (
    <g>
      <rect x={8} y={18} width={48} height={28} rx={3} fill="#94a3b8" stroke="#475569" />
      {[14, 24, 34, 44, 52].map((x) => (
        <g key={x}>
          <circle cx={x} cy={24} r={2.4} fill="#0b1220" />
          <HexNut x={x} y={40} r={2.6} />
        </g>
      ))}
      <line x1={8} y1={32} x2={56} y2={32} stroke="#64748b" strokeWidth={1.4} />
    </g>
  );
}

function EarthBar() {
  return (
    <g>
      <rect x={8} y={22} width={48} height={18} rx={3} fill="#16a34a" stroke="#14532d" />
      <rect x={8} y={28} width={48} height={5} fill="#facc15" />
      {[15, 25, 35, 45, 52].map((x) => (
        <g key={x}>
          <circle cx={x} cy={24.5} r={2.1} fill="#dcfce7" stroke="#14532d" />
          <circle cx={x} cy={38} r={2.1} fill="#dcfce7" stroke="#14532d" />
        </g>
      ))}
    </g>
  );
}

function EndBracket() {
  return (
    <g>
      <rect x={26} y={14} width={12} height={38} rx={2} fill="#94a3b8" stroke="#64748b" />
      <circle cx={32} cy={22} r={2.6} fill="#64748b" />
      <rect x={29} y={29} width={6} height={16} rx={1} fill="#64748b" />
      <rect x={22} y={50} width={20} height={4} rx={1} fill="#74839e" />
    </g>
  );
}

function PlugSocket({ n, plug }: { n: number; plug?: boolean }) {
  const cols = ["#ef4444", "#eab308", "#3b82f6", "#16a34a", "#e5e7eb"];
  const xs = n === 3 ? [22, 32, 42] : n === 4 ? [18, 27.3, 36.6, 46] : [22, 32, 42, 48, 54];
  return (
    <g>
      <rect x={plug ? 14 : 10} y={14} width={plug ? 36 : 44} height={36} rx={8} fill={plug ? "#f59e0b" : "#e2e8f0"} stroke={plug ? "#b45309" : "#94a3b8"} strokeWidth={1.2} />
      {xs.slice(0, n).map((x, i) =>
        plug ? (
          <rect key={i} x={x - 1.6} y={8} width={3.2} height={9} rx={1.2} fill={cols[i]} stroke="#7c3f10" />
        ) : (
          <circle key={i} cx={x} cy={32} r={3.2} fill="#0b1220" stroke="#64748b" />
        )
      )}
      {plug && (
        <g>
          <rect x={20} y={46} width={24} height={5} rx={2} fill="#b45309" />
          <line x1={32} y1={51} x2={32} y2={56} stroke="#64748b" strokeWidth={1.8} />
        </g>
      )}
    </g>
  );
}

function Gland() {
  return (
    <g>
      <HexNut x={32} y={18} r={8} />
      <rect x={26} y={18} width={12} height={8} fill="#94a3b8" stroke="#64748b" />
      <rect x={28} y={26} width={8} height={20} rx={2} fill="#aeb9cc" stroke="#74839e" />
      {[30, 34, 38, 42].map((y) => (
        <line key={y} x1={28} y1={y} x2={36} y2={y} stroke="#74839e" strokeWidth={1} />
      ))}
      <rect x={26} y={46} width={12} height={6} rx={2} fill="#64748b" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* STRUCTURE                                                          */
/* ------------------------------------------------------------------ */

function Cabinet() {
  return (
    <g>
      <rect x={14} y={8} width={36} height={48} rx={2} fill="#9aa7bb" stroke="#64748b" strokeWidth={1.2} />
      <rect x={17} y={11} width={30} height={42} rx={1} fill="#b6c2d6" stroke="#7e8da8" />
      <line x1={42} y1={11} x2={42} y2={53} stroke="#7e8da8" />
      <rect x={43.5} y={28} width={3.4} height={8} rx={1.2} fill="#334155" />
      <S x={21} y={15} r={1.6} />
      <S x={21} y={49} r={1.6} />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={22} y1={22 + i * 10} x2={38} y2={22 + i * 10} stroke="#94a3b8" strokeDasharray="3 2" />
      ))}
    </g>
  );
}

function Subplate() {
  return (
    <g>
      <rect x={8} y={10} width={48} height={44} rx={2} fill="#c7d0df" stroke="#7e8da8" strokeWidth={1.2} />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 6 }).map((__, c) => (
          <circle key={`${r}${c}`} cx={13 + c * 7.6} cy={16 + r * 8} r={0.8} fill="#7e8da8" />
        ))
      )}
      <S x={11} y={13} r={1.6} />
      <S x={53} y={13} r={1.6} />
      <S x={11} y={51} r={1.6} />
      <S x={53} y={51} r={1.6} />
    </g>
  );
}

function VentFan({ active }: GlyphProps) {
  return (
    <g>
      <rect x={10} y={10} width={44} height={44} rx={4} fill="#e2e8f0" stroke="#94a3b8" />
      {[14, 20, 26, 32, 38, 44, 50].map((x) => (
        <line key={`v${x}`} x1={x} y1={13} x2={x} y2={51} stroke="#94a3b8" strokeWidth={1.6} />
      ))}
      {[16, 24, 32, 40, 48].map((y) => (
        <line key={`h${y}`} x1={13} y1={y} x2={51} y2={y} stroke="#94a3b8" strokeWidth={1.6} />
      ))}
      <g className={active ? "ep-rotor-fast" : undefined}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d="M32 32 q2 -7 7 -9 q-1 7 -6 8 z" fill="#475569" transform={`rotate(${a} 32 32)`} />
        ))}
      </g>
      <circle cx={32} cy={32} r={3} fill="#64748b" />
    </g>
  );
}

function Insulator() {
  return (
    <g>
      <rect x={28} y={8} width={8} height={6} rx={1} fill="#64748b" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <ellipse cx={32} cy={18 + i * 9} rx={10} ry={3.6} fill="#e2b07a" stroke="#a16207" />
        </g>
      ))}
      <rect x={28} y={50} width={8} height={6} rx={1} fill="#64748b" />
    </g>
  );
}

function Warning() {
  return (
    <g>
      <path d="M32 9 L55 50 L9 50 z" fill="#facc15" stroke="#a16207" strokeWidth={1.6} strokeLinejoin="round" />
      <rect x={30.4} y={22} width={3.2} height={16} rx={1.4} fill="#7f1d1d" />
      <circle cx={32} cy={44} r={2} fill="#7f1d1d" />
    </g>
  );
}

function Blanking() {
  return (
    <g>
      <circle cx={32} cy={32} r={15} fill="#94a3b8" stroke="#64748b" strokeWidth={1.4} />
      <circle cx={32} cy={32} r={9} fill="#71809a" />
      <line x1={26} y1={26} x2={38} y2={38} stroke="#475569" strokeWidth={2} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* READY UNITS                                                        */
/* ------------------------------------------------------------------ */

function UnitBox(label: string, mini: ("mcb" | "ct" | "ol" | "pump")[]) {
  return function G() {
    return (
      <g>
        <rect x={7} y={8} width={50} height={48} rx={4} fill="#eef2f8" stroke="#64748b" strokeWidth={1.2} />
        <rect x={7} y={8} width={50} height={9} rx={4} fill="#dbe3ee" />
        <text x={32} y={14.4} textAnchor="middle" fontSize={5.8} fontWeight={700} fill="#334155" style={{ fontFamily: MONO }}>
          {label}
        </text>
        {mini.map((k, i) => {
          const x = 11 + i * 15;
          if (k === "mcb")
            return (
              <g key={i}>
                <rect x={x} y={21} width={11} height={22} rx={1.5} fill="#e7ecf3" stroke="#8fa0b8" />
                <rect x={x + 2.5} y={26} width={6} height={8} rx={1} fill="#ef4444" />
              </g>
            );
          if (k === "ct")
            return (
              <g key={i}>
                <rect x={x} y={21} width={11} height={22} rx={1.5} fill="#e9eef5" stroke="#8fa0b8" />
                <circle cx={x + 5.5} cy={31} r={2} fill="#22c55e" />
              </g>
            );
          if (k === "ol")
            return (
              <g key={i}>
                <rect x={x} y={21} width={11} height={22} rx={1.5} fill="#cdd6e4" stroke="#7e8da8" />
                <circle cx={x + 5.5} cy={30} r={3.4} fill="#334155" />
              </g>
            );
          return (
            <g key={i}>
              <circle cx={x + 5.5} cy={32} r={8} fill="#1d4ed8" stroke="#17338a" />
              <path d="M24 32 a4 4 0 0 1 4 -4 a6 6 0 0 1 3 7" fill="none" stroke="#93c5fd" strokeWidth={1.3} />
            </g>
          );
        })}
        {[13, 23, 33, 43, 51].map((x) => (
          <circle key={x} cx={x} cy={50} r={1.8} fill="#86efac" stroke="#16a34a" />
        ))}
      </g>
    );
  };
}

function PumpUnit() {
  return (
    <g>
      <rect x={7} y={8} width={50} height={48} rx={4} fill="#eef2f8" stroke="#64748b" strokeWidth={1.2} />
      <rect x={7} y={8} width={50} height={9} rx={4} fill="#dbe3ee" />
      <text x={32} y={14.4} textAnchor="middle" fontSize={5.6} fontWeight={700} fill="#334155" style={{ fontFamily: MONO }}>
        PUMP PANEL
      </text>
      <rect x={11} y={21} width={10} height={20} rx={1.5} fill="#e7ecf3" stroke="#8fa0b8" />
      <rect x={13.5} y={25} width={5} height={8} fill="#ef4444" />
      <rect x={23} y={21} width={10} height={20} rx={1.5} fill="#e9eef5" stroke="#8fa0b8" />
      <circle cx={28} cy={31} r={2} fill="#22c55e" />
      <circle cx={45} cy={32} r={9} fill="#1d4ed8" stroke="#17338a" />
      <path d="M45 32 a5 5 0 0 1 5 -5 a7 7 0 0 1 3 8" fill="none" stroke="#93c5fd" strokeWidth={1.4} />
      <circle cx={16} cy={50} r={1.8} fill="#86efac" />
      <circle cx={28} cy={50} r={1.8} fill="#86efac" />
      <circle cx={40} cy={50} r={1.8} fill="#86efac" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* DISTRIBUTION BOARD (photo-style)                                    */
/* ------------------------------------------------------------------ */

function Rcd40({ off }: { off?: boolean }) {
  return (
    <g>
      <rect x={6} y={8} width={52} height={48} rx={5} fill="#f3f6fa" stroke={off ? "#dc2626" : "#aab7ca"} strokeWidth={off ? 1.8 : 1} />
      {/* copper terminals */}
      <SPlus x={18} y={14} r={2.6} copper />
      <SPlus x={46} y={14} r={2.6} copper />
      <SPlus x={18} y={50} r={2.6} copper />
      <SPlus x={46} y={50} r={2.6} copper />
      {/* test button */}
      <rect x={12.5} y={20} width={11} height={9.5} rx={2} fill="#1a1d23" stroke="#000" />
      <text x={18} y={26.6} textAnchor="middle" fontSize={6.5} fontWeight={800} fill="#f8fafc" style={{ fontFamily: MONO }}>
        T
      </text>
      <text x={18} y={32.6} textAnchor="middle" fontSize={3} fill="#64748b" style={{ fontFamily: MONO }}>
        Test Monthly
      </text>
      {/* off rocker */}
      <rect x={12.5} y={35} width={11} height={13} rx={2.4} fill="#e8edf4" stroke="#aab7ca" />
      <rect x={14.5} y={off ? 37 : 41} width={7} height={5.5} rx={1.4} fill="#1a1d23" />
      <text x={18} y={off ? 40 : 45} textAnchor="middle" fontSize={3.4} fontWeight={700} fill="#f8fafc" style={{ fontFamily: MONO }}>
        OFF
      </text>
      {off && <rect x={28} y={43.4} width={21} height={1.8} rx={0.9} fill="#dc2626" />}
      {/* ratings */}
      <text x={38.5} y={24} textAnchor="middle" fontSize={4.6} fontWeight={800} fill="#1f2937" style={{ fontFamily: MONO }}>
        MIDA-40B
      </text>
      <text x={38.5} y={29} textAnchor="middle" fontSize={4.2} fontWeight={700} fill="#374151" style={{ fontFamily: MONO }}>
        40A
      </text>
      <text x={38.5} y={33.4} textAnchor="middle" fontSize={3.2} fill="#4b5563" style={{ fontFamily: MONO }}>
        230/240V~
      </text>
      <text x={38.5} y={37} textAnchor="middle" fontSize={3.2} fill="#4b5563" style={{ fontFamily: MONO }}>
        50/60Hz
      </text>
      <text x={38.5} y={40.8} textAnchor="middle" fontSize={3.4} fontWeight={700} fill="#16a34a" style={{ fontFamily: MONO }}>
        IΔn 0.03A
      </text>
      {!off && <rect x={28} y={43.4} width={21} height={1.8} rx={0.9} fill="#16a34a" />}
      <text x={18} y={57} textAnchor="middle" fontSize={4} fontWeight={700} fill="#374151" style={{ fontFamily: MONO }}>
        N
      </text>
      <text x={46} y={57} textAnchor="middle" fontSize={4} fontWeight={700} fill="#374151" style={{ fontFamily: MONO }}>
        2
      </text>
    </g>
  );
}

function RailBar() {
  const xs = Array.from({ length: 12 }, (_, i) => 5 + i * (54 / 11));
  return (
    <g>
      <rect x={2} y={25} width={60} height={14} rx={7} fill="#dde4ee" stroke="#8fa0b8" strokeWidth={1.1} />
      <rect x={2} y={25} width={60} height={4.5} rx={2.2} fill="#f1f5fa" />
      <rect x={2} y={34.5} width={60} height={4.5} rx={2.2} fill="#c2ccdc" />
      {xs.map((x, i) => (
        <SPlus key={i} x={x} y={32} r={2.5} />
      ))}
    </g>
  );
}

function TbBlock({ c, edge, label }: { c: string; edge: string; label: string }) {
  return (
    <g>
      <rect x={19} y={7} width={26} height={50} rx={4.5} fill={c} stroke={edge} strokeWidth={1.3} />
      <rect x={19} y={7} width={26} height={8} rx={4.5} fill="#ffffff" opacity={0.28} />
      <SPlus x={32} y={12.5} r={2.5} />
      <circle cx={32} cy={30} r={2.1} fill="#0b1322" opacity={0.55} />
      <SPlus x={32} y={51.5} r={2.5} />
      <text x={32} y={39} textAnchor="middle" fontSize={4.4} fontWeight={800} fill="#fff" style={{ fontFamily: MONO }}>
        {label}
      </text>
    </g>
  );
}

function DistPanel() {
  return (
    <g>
      <rect x={1.5} y={5.5} width={61} height={53} rx={3.5} fill="#c6cfdb" stroke="#8290a4" strokeWidth={1.4} />
      <rect x={4} y={8} width={56} height={48} rx={2} fill="#98a4b4" />
      <rect x={6} y={10} width={52} height={44} rx={1.5} fill="#8b98a9" />
      <text x={32} y={15.5} textAnchor="middle" fontSize={4.6} fontWeight={800} fill="#eef2f8" letterSpacing={1} style={{ fontFamily: MONO }}>
        DISTRIBUTION BOX
      </text>
      {/* DIN rail */}
      <rect x={12} y={40} width={40} height={3.4} rx={1} fill="#dfe6f0" stroke="#8fa0b8" strokeWidth={0.5} />
      <text x={9} y={30} textAnchor="middle" fontSize={4} fontWeight={800} fill="#eef2f8" style={{ fontFamily: MONO }}>
        A
      </text>
      <text x={9} y={52} textAnchor="middle" fontSize={4} fontWeight={800} fill="#eef2f8" style={{ fontFamily: MONO }}>
        B
      </text>
      {[
        [7, 11],
        [57, 11],
        [7, 53],
        [57, 53],
      ].map(([x, y], i) => (
        <SPlus key={i} x={x} y={y} r={1.6} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* registry                                                           */
/* ------------------------------------------------------------------ */

const E: Record<string, (p: GlyphProps) => ReactNode> = {
  /* sources */
  solar: () => <Solar />,
  battery: () => <Battery />,
  ups: () => <DinBox w={44} label="UPS" screenText="ONLINE" termTop={2} termBot={2} leds={["#22c55e"]} />,
  transformer: () => <Transformer />,
  "pv-inverter": () => <DinBox w={44} label="SUN" screenText="3.2kW" termTop={2} termBot={3} leds={["#22c55e"]} />,
  "cap-bank": () => <CapBank />,
  "dc-source": () => <DcSource />,
  grid: () => <GridPole />,

  /* protection */
  rcbo2: (p) => Rcbo(2, p.on ?? true),
  rcbo4: (p) => Rcbo(4, p.on ?? true),
  "rcd-40": (p) => <Rcd40 off={p.tripped} />,
  mpcb: () => <DinBox w={44} label="MPCB" knobs={2} termTop={3} termBot={3} dark={false} />,
  isolator3: (p) => <Knife n={3} open={p.on === false} />,
  knife: (p) => <Knife n={3} open={p.on === false} />,
  "hrc-fuse": () => <HrcFuse />,
  "fuse-holder": () => <HrcFuse holder />,
  elr: () => <DinBox w={36} label="ELR" screenText="30mA" termBot={2} leds={["#22c55e", "#ef4444"]} />,
  "phase-relay": () => <DinBox w={36} label="3Ph" termBot={2} leds={["#ef4444", "#eab308", "#3b82f6"]} />,
  "dc-breaker": () => Rcbo(2),

  /* contactors / relays */
  "aux-block": () => <AuxBlock />,
  ssr: () => <Ssr />,
  relay8: () => <IceCube />,
  "relay-socket": () => <OctalBase />,
  "cap-contactor": (p) => GLYPHS.ct2(p),
  "mini-contactor": (p) => GLYPHS.ct1(p),
  interlock: () => <Interlock />,
  flasher: () => <DinBox w={36} label="FL" termTop={2} termBot={2} leds={["#f59e0b"]} />,

  /* automation */
  softstarter: () => <DinBox w={46} label="SOFT" screenText="RAMP" termTop={3} termBot={3} leds={["#22c55e"]} />,
  "servo-drive": () => <DinBox w={46} label="SERVO" screenText="r0" termTop={3} termBot={3} />,
  pid: () => <Pid />,
  hmi: () => <Hmi />,
  "plc-rack": () => <PlcRack />,
  "safety-relay": () => <DinBox w={40} label="SAFETY" accent="#fbbf24" termTop={2} termBot={2} buttons={2} />,
  "io-module": () => <DinBox w={40} label="I/O 8/8" termTop={4} termBot={4} leds={["#22c55e", "#22c55e"]} />,
  "eth-switch": (p) => <EthSwitch active={p.active} />,
  smps12: () => <DinBox w={40} label="DC 12V" screenText="12.0" termTop={2} termBot={2} />,

  /* buttons / switches */
  "pb-green-light": (p) => <LitPB solid="#22c55e" lens="lg-green" pressed={p.pressed} />,
  "pb-red-light": (p) => <LitPB solid="#ef4444" lens="lg-red" pressed={p.pressed} />,
  "double-pb": (p) => <DoublePB pressed={p.pressed} />,
  key2: (p) => <KeySwitch on={p.on} />,
  joystick: () => <Joystick />,
  foot: () => <FootSwitch />,
  toggle: (p) => <Toggle on={p.on} />,
  cam: (p) => <CamSwitch on={p.on} />,
  "estop-key": () => <EStopKey />,

  /* sensors */
  "prox-ind": () => <Proximity c="#1d4ed8" sym="M18" />,
  "prox-cap": () => <Proximity c="#7c3aed" sym="C" />,
  "photo-beam": (p) => <PhotoPair active={p.active || p.on} />,
  encoder: (p) => <Encoder active={p.active || p.on} />,
  thermocouple: () => <Probe />,
  pt100: () => <Probe />,
  "pressure-tx": () => <PressTx />,
  flow: () => <FlowSwitch />,
  smoke: () => <Smoke />,
  reed: () => <Reed />,
  pir: () => <Pir />,

  /* signaling */
  tower: () => <Tower />,
  beacon: (p) => <Beacon active={p.active} />,
  horn: (p) => <Horn active={p.active} />,
  bell: () => <Bell />,
  kwh: () => <KwhMeter />,
  "pf-meter": DigiMeter("0.96"),
  "hour-meter": DigiMeter("1204h"),
  "analog-a": AnalogGauge("A"),
  "analog-v": AnalogGauge("V"),

  /* loads */
  "dc-motor": (p) => <DcMotor active={p.active} />,
  "servo-motor": () => <ServoMotor />,
  "fan-axial": (p) => <AxialFan {...p} />,
  compressor: (p) => <Compressor {...p} />,
  conveyor: (p) => <Conveyor {...p} />,
  heater: (p) => <Heater active={p.active} />,
  "led-bulb": (p) => <LedBulb {...p} />,
  "tube-light": (p) => <TubeLight {...p} />,
  solenoid: (p) => <Solenoid {...p} />,
  electromagnet: (p) => <ElectroMagnet {...p} />,

  /* wiring */
  term6: () => Term(6),
  term12: () => Term(12, 14, 48, 4),
  "dist-block": () => <DistBlock />,
  "earth-bar": () => <EarthBar />,
  "end-bracket": () => <EndBracket />,
  plug3: () => <PlugSocket n={3} plug />,
  socket3: () => <PlugSocket n={3} />,
  gland: () => <Gland />,
  "rail-bar": () => <RailBar />,
  "tb-blue": () => <TbBlock c="#2f6fd0" edge="#1e40af" label="N" />,
  "tb-green": () => <TbBlock c="#2fa84f" edge="#14532d" label="PE" />,
  "tb-amber": () => <TbBlock c="#e59a2b" edge="#a16207" label="L" />,
  "tb-red": () => <TbBlock c="#d3453f" edge="#7f1d1d" label="L" />,

  /* structure */
  cabinet: () => <Cabinet />,
  subplate: () => <Subplate />,
  "vent-fan": (p) => <VentFan active={p.active} />,
  insulator: () => <Insulator />,
  warning: () => <Warning />,
  blanking: () => <Blanking />,
  "dist-panel": () => <DistPanel />,

  /* ready units */
  ats2: (p) => GLYPHS.ats(p),
  "dol-unit": UnitBox("DOL", ["mcb", "ct", "ol"]),
  "sd-unit": UnitBox("STAR-DELTA", ["mcb", "ct", "ct"]),
  "db-unit": (p) => GLYPHS.box(p),
  "pump-unit": () => <PumpUnit />,
};

registerGlyphs(E);
export {};
