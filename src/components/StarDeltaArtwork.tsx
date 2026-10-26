import type { ReactNode } from "react";
import { registerGlyphs, type GlyphProps } from "./Icons";
import { getTerminals } from "../data/terminals";
import { STARTER_SIZE, starterPort, visibleStarterPort } from "../data/starDeltaLayout";
import { Display, Housing, Ink, Led, Lens, Pin, Screw } from "./hardware/Primitives";

const RED = "#f04e56";
const YELLOW = "#f2cf46";
const BLUE = "#318ded";
const CYAN = "#5bc9fb";

function Rail({ x, y, w, h = 31 }: { x: number; y: number; w: number; h?: number }) {
  return (
    <g>
      <rect x={x + 2} y={y + 3} width={w} height={h} rx="3" fill="#4e606b" opacity="0.38" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill="url(#sd-rail)" stroke="#8d9da8" strokeWidth="1" />
      <path d={`M${x + 3} ${y + 3} H${x + w - 3} M${x + 3} ${y + h - 5} H${x + w - 3}`} stroke="#fff" opacity="0.67" strokeWidth="1.2" />
      <path d={`M${x + 3} ${y + h - 10} H${x + w - 3}`} stroke="#71818b" strokeWidth="1" opacity="0.45" />
    </g>
  );
}

function Stage() {
  return (
    <g>
      <defs>
        <linearGradient id="sd-rail" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#edf3f4" />
          <stop offset="0.22" stopColor="#c5d0d9" />
          <stop offset="0.68" stopColor="#8c9da9" />
          <stop offset="1" stopColor="#d4dde2" />
        </linearGradient>
        <linearGradient id="sd-panel-orange" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ff8d28" />
          <stop offset="0.55" stopColor="#fa791b" />
          <stop offset="1" stopColor="#ed6515" />
        </linearGradient>
        <linearGradient id="sd-door" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="0.58" stopColor="#fcfdff" />
          <stop offset="1" stopColor="#eef3f7" />
        </linearGradient>
        <filter id="sd-panel-shadow" x="-10%" y="-10%" width="120%" height="125%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="7" />
          <feOffset dy="5" />
          <feComponentTransfer><feFuncA type="linear" slope="0.38" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* The source and neutral sit above the cabinet, as in the reference. */}
      <text x="244" y="98" fill="#f6f8fb" fontSize="33" fontWeight="800" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="0.3">
        three phase star delta starter
      </text>

      <g filter="url(#sd-panel-shadow)">
        <rect x="33" y="131" width="802" height="803" rx="7" fill="url(#sd-rail)" stroke="#7a8d9c" strokeWidth="1.7" />
        <rect x="40" y="138" width="787" height="790" rx="4" fill="#d4dce3" stroke="#f8fbff" strokeWidth="1" />
        <rect x="47" y="145" width="509" height="776" rx="2" fill="url(#sd-panel-orange)" stroke="#ce651b" strokeWidth="1.1" />
        <rect x="47" y="145" width="509" height="776" fill="url(#hw-brush)" opacity="0.1" />
        <path d="M48 146 H555" stroke="#ffd09a" opacity="0.72" strokeWidth="2" />
        <rect x="566" y="143" width="257" height="780" rx="2" fill="url(#sd-door)" stroke="#c8d2da" strokeWidth="1.2" />
        <path d="M563 138 V928" stroke="#8795a3" strokeWidth="2.5" />
        <rect x="575" y="150" width="239" height="765" rx="2" fill="none" stroke="#d1dae2" strokeWidth="1" />
        <path d="M570 150 V913" stroke="#fff" strokeWidth="2" opacity="0.8" />
        <text x="300" y="164" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="800" fontFamily="Arial, Helvetica, sans-serif">Panel M</text>
        <rect x="572" y="515" width="9" height="36" rx="4" fill="url(#hw-slate)" stroke="#788995" strokeWidth="0.9" />
        {[226, 478, 723].map((y) => (
          <g key={y}>
            <path d={`M567 ${y} h-6`} stroke="#d1d9de" strokeWidth="2" />
            <circle cx="563" cy={y} r="2" fill="#b6c0c8" />
          </g>
        ))}
        <Rail x={70} y={216} w={169} h={20} />
        <Rail x={83} y={281} w={435} h={33} />
        <Rail x={114} y={380} w={405} h={18} />
        <Rail x={82} y={476} w={435} h={32} />
        <Rail x={82} y={713} w={436} h={33} />
        <Rail x={48} y={281} w={34} h={465} />
        <Rail x={513} y={281} w={34} h={465} />
        <path d="M46 921 H557" stroke="#b25a18" strokeOpacity="0.45" strokeWidth="1.3" />
      </g>
    </g>
  );
}

function Font({ x, y, children, size = 9, color = "#2f3b45", bold = false, anchor = "middle" }: {
  x: number; y: number; children: ReactNode; size?: number; color?: string; bold?: boolean; anchor?: "middle" | "start" | "end";
}) {
  return <text x={x} y={y} fill={color} fontSize={size} fontFamily="Arial, Helvetica, sans-serif" fontWeight={bold ? 800 : 600} textAnchor={anchor}>{children}</text>;
}

// Screws and the interactive terminal overlays share their coordinates.
function Contacts({ part, hide = [] }: { part: string; hide?: string[] }) {
  const size = STARTER_SIZE[part];
  if (!size) return null;
  return (
    <g>
      {getTerminals(part)
        .filter((port) => visibleStarterPort(part, port.id) && !hide.includes(port.id))
        .map((port) => {
          const [nx, ny] = starterPort(part, port.id) ?? [port.x, port.y];
          const x = (nx / 64) * size.w;
          const y = (ny / 64) * size.h;
          return <Screw key={port.id} x={x} y={y} r={part === "ct1" ? 2.45 : part === "neutral-link" ? 2 : 2.8} copper />;
        })}
    </g>
  );
}

function PhaseSource() {
  return (
    <g>
      <Housing x={0} y={0} w={102} h={73} tone="dark" radius={5}>
        <rect x={2} y={1} width={98} height={70} rx={4} fill="#252544" stroke="#5361cc" strokeWidth={1} />
        <Font x={51} y={17} size={8} color="#c8d7ff" bold>3Φ SOURCE</Font>
        <Font x={51} y={49} size={6} color="#b8bcd8">L1           L2          L3</Font>
        {[13, 51, 89].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={36} r="10" fill={["#6d252e", "#766020", "#253a80"][i]} opacity="0.7" />
            <circle cx={x} cy={36} r="5.9" fill={[RED, YELLOW, BLUE][i]} />
            <circle cx={x - 1.5} cy="33" r="1.8" fill="#fff" opacity="0.64" />
          </g>
        ))}
      </Housing>
      <Contacts part="src-3ph" />
    </g>
  );
}

function NeutralSource() {
  return (
    <g>
      <Housing x={1} y={0} w={37} h={49} tone="dark" radius={5}>
        <rect x={2} y={1} width={35} height={47} rx={5} fill="#162f42" stroke="#5fc9fa" strokeWidth={1.4} />
        <Font x={20} y={20} color="#baf0ff" size={12} bold>N</Font>
      </Housing>
      <Contacts part="n" />
    </g>
  );
}

function PhaseTerminalBlock() {
  const xs = [21.5, 48.8, 76.2, 103.5];
  return (
    <g>
      <Housing x={1} y={3} w={123} h={73} tone="blue" radius={4}>
        <rect x={3} y={5} width={119} height={69} rx={3} fill="url(#hw-blue)" stroke="#27466d" />
        <path d="M5 11 H120 M5 69 H120" stroke="#addef3" opacity="0.5" />
        {xs.map((x, i) => (
          <g key={i}>
            <rect x={x - 11} y={10} width="22" height="57" rx="2" fill="#114979" opacity="0.28" />
            <Font x={x} y={43} size={9} color="#d5efff" bold>{["N", "L1", "L2", "L3"][i]}</Font>
            <circle cx={x} cy={25} r="10" fill="#183c64" stroke="#a3dbef" strokeWidth="1" />
            <circle cx={x} cy={60} r="10" fill="#183c64" stroke="#a3dbef" strokeWidth="1" />
          </g>
        ))}
      </Housing>
      <Contacts part="term4" />
    </g>
  );
}

function NeutralStrip() {
  const xs = Array.from({ length: 8 }, (_, i) => 12 + i * 18.4);
  return (
    <g>
      <rect x={1} y={21} width={153} height={33} rx={4} fill="#bcc7d1" stroke="#6d8291" />
      <rect x={4} y={25} width={147} height={25} rx={2} fill="url(#g-metal)" />
      <path d="M5 31 H151" stroke="#6d8290" strokeWidth="1" />
      <rect x={62} y={0} width={28} height={23} rx={3} fill="#37b8ed" stroke="#417c91" />
      <Font x={76} y={17} color="#fff" size={10} bold>N</Font>
      {xs.map((x, i) => <Screw key={i} x={x} y={37} r={3} copper />)}
      <Contacts part="neutral-link" />
    </g>
  );
}

function MainBreaker({ on, label }: { on?: boolean; label?: string }) {
  const xs = [24, 49, 74];
  return (
    <g>
      <Housing x={1} y={4} w={96} h={149} tone="ivory" radius={4}>
        {xs.map((x) => (
          <g key={x}>
            <rect x={x - 14} y={7} width={28} height={143} rx={2} fill="url(#hw-ivory)" stroke="#91a0aa" strokeWidth="0.6" />
            <path d={`M${x - 12} 45 H${x + 12}`} stroke={RED} strokeWidth="4" />
            <circle cx={x} cy={60} r="10" fill="#c6d1d8" stroke="#87949e" />
            <rect x={x - 9} y={72} width="18" height={on === false ? 20 : 18} rx="4" fill="url(#hw-rubber)" />
            <path d={`M${x - 6} ${on === false ? 83 : 77} H${x + 6}`} stroke="#899baa" strokeWidth="2" />
            <rect x={x - 9} y={110} width="18" height="4" rx="1" fill={on === false ? "#e24c4d" : "#3da86a"} />
          </g>
        ))}
        <rect x={16} y={92} width={66} height={11} rx={3} fill="#20282d" />
        <rect x={20} y={45} width={58} height={16} rx={2} fill="#182127" />
        <Font x={49} y={56} color="#f8faf9" size={11} bold>{label ?? "C63"}</Font>
      </Housing>
      <Contacts part="mcb-3" />
    </g>
  );
}

function PhaseMonitor({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={1} y={3} w={61} h={149} tone="ivory" radius={3}>
        <rect x={4} y={44} width={55} height={76} rx={2} fill="#f9faf9" stroke="#bac5ce" />
        {[0, 1, 2].map((i) => <Lens key={i} x={13 + i * 18} y={29} r={4.1} tint={(["red", "amber", "blue"] as const)[i]} active={active} />)}
        <Font x={32} y={57} size={7} color="#273543" bold>PHASE FAIL</Font>
        <Font x={32} y={67} size={5} color="#576775">3 PHASE MONITOR</Font>
        <Ink x={32} y={76} size={4.2}>MAX</Ink>
        {[90, 110].map((y) => (
          <g key={y}>
            <circle cx={32} cy={y} r={9} fill="url(#hw-rubber)" stroke="#93a8b4" />
            <circle cx={32} cy={y} r={5} fill="#e0e9ec" />
            <path d={`M32 ${y} L35 ${y - 4}`} stroke="#293c4a" strokeWidth="1.7" />
          </g>
        ))}
        <Led x={14} y={128} color="#3cbd70" active={active} />
        <Font x={32} y={132} size={5} color="#626f77">RUN / TRIP</Font>
      </Housing>
      <Contacts part="phasefail" />
    </g>
  );
}

function Timer({ active, contactClosed }: GlyphProps) {
  return (
    <g>
      <Housing x={1} y={2} w={94} h={151} tone="ivory" radius={3}>
        <rect x={5} y={30} width={86} height={112} rx={2} fill="#f7f8f6" stroke="#b3bec6" />
        <Font x={48} y={46} size={9} color="#29343d" bold>ON-DELAY TIMER</Font>
        <Display x={17} y={56} w={62} h={29} text={active ? "02.5" : "00.0"} active={active} color="#fa5358" />
        <Font x={48} y={96} size={5} color="#3e5360">SEC        MIN       MODE</Font>
        {[25, 48, 72].map((x) => (
          <g key={x}>
            <circle cx={x} cy={108} r={6} fill="#bfc9d1" stroke="#69818d" />
            <circle cx={x} cy={108} r={3.2} fill="#233743" />
          </g>
        ))}
        <Led x={17} y={129} active={active} color="#3bc879" />
        <Led x={48} y={129} active={contactClosed} color="#ecbe50" />
        <Font x={51} y={146} size={4.2} color="#4c5b67">24V AC/DC</Font>
      </Housing>
      <Contacts part="timer-on" />
    </g>
  );
}

function Fuse() {
  return (
    <g>
      <Housing x={1} y={1} w={38} h={152} tone="ivory">
        <rect x={6} y={45} width={28} height={62} rx={3} fill="#dce4e8" stroke="#a5b0ba" />
        <rect x={8} y={54} width={24} height={43} rx={3} fill="url(#hw-rubber)" stroke="#253949" />
        <Font x={20} y={34} size={10} color="#212e38" bold>C6</Font>
        <path d="M9 41 H31" stroke={RED} strokeWidth="3" />
        <Font x={20} y={118} size={6} color="#364a57">FUSE</Font>
      </Housing>
      <Contacts part="fuse" />
    </g>
  );
}

function Overload({ tripped }: GlyphProps) {
  const xs = [31, 58, 86];
  return (
    <g>
      <Housing x={1} y={2} w={116} h={202} tone="ivory" radius={4}>
        <path d="M3 30 H115 M3 80 H115" stroke="#aab7be" strokeWidth="1" />
        <Font x={59} y={57} size={10} bold>THERMAL OVERLOAD</Font>
        <Font x={59} y={72} size={7} color="#576978">5.5 - 8 A / CLASS 10</Font>
        {xs.map((x, i) => <Lens key={i} x={x} y={37} r={3.7} tint={(["red", "amber", "blue"] as const)[i]} />)}
        <rect x={29} y={87} width={58} height={45} rx={2} fill="#edf1f2" stroke="#93a5b1" />
        <circle cx={58} cy={110} r={16} fill="url(#hw-slate)" stroke="#546a78" />
        <path d="M58 110 L65 99" stroke="#e8e6df" strokeWidth="2" />
        <Font x={59} y={150} size={7} color="#4d606d">TEST      RESET</Font>
        <rect x={29} y={158} width={16} height={12} rx={2} fill="#ca353e" />
        <rect x={73} y={158} width={16} height={12} rx={2} fill="#357fa0" />
        <Led x={58} y={166} active={tripped} color="#ed3d51" />
        <Font x={59} y={191} size={6} color="#516371">95 - 96  NC</Font>
      </Housing>
      <Contacts part="overload" />
    </g>
  );
}

function Contactor({ active, label }: { active?: boolean; label?: string }) {
  const xs = [29, 50, 71];
  return (
    <g>
      <Housing x={2} y={2} w={95} h={200} tone="dark" radius={5}>
        <rect x={5} y={8} width={89} height={186} rx={2} fill="url(#hw-dark)" stroke="#708392" />
        <rect x={11} y={29} width={77} height={51} rx={2} fill="#1f2d37" stroke="#778b96" />
        <Font x={50} y={46} size={11} color="#fafaf6" bold>{label || "CONTACTOR"}</Font>
        <Font x={50} y={61} size={6} color="#b1c0c7">25A  AC-3  /  400V</Font>
        <rect x={20} y={88} width={58} height={47} rx={3} fill="#24323c" stroke="#a2b1b6" />
        <rect x={34} y={99 + (active ? 8 : 0)} width={32} height={16} rx={2} fill={active ? "#294138" : "#151d27"} stroke="#778b9a" />
        <path d={`M37 ${102 + (active ? 8 : 0)} H63`} stroke="#9aa9ae" strokeWidth="2" />
        {[0, 1, 2].map((i) => <Led key={i} x={33 + i * 17} y={149} active={active} color="#47bd78" />)}
        <path d="M11 163 H88" stroke="#45b172" strokeWidth="3" />
        <Font x={50} y={178} size={7} color="#b5c6cc">COIL  A1 / A2</Font>
        <Font x={50} y={189} size={5.5} color="#879aa7">1L1    3L2    5L3</Font>
        {xs.map((x, i) => <Font key={i} x={x} y={33} size={5} color="#e5e8e5">{["L1", "L2", "L3"][i]}</Font>)}
        {label === "STAR" && (
          <path d="M29 182 V176 H71 V182" fill="none" stroke="url(#hw-copper)" strokeWidth="3" strokeLinejoin="round" />
        )}
      </Housing>
      <Contacts part="ct1" />
    </g>
  );
}

function Motor({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={3} y={4} w={168} h={103} tone="slate" radius={4}>
        <rect x={36} y={10} width={102} height={88} rx={4} fill="url(#hw-dark)" stroke="#899ca8" />
        <rect x={40} y={13} width={96} height={15} fill="#243440" />
        <Font x={88} y={24} color="#f6f8fa" size={10} bold>3~ MOTOR</Font>
        <circle cx={88} cy={60} r={33} fill="#34434f" stroke="#a9bac2" strokeWidth="1.2" />
        <circle cx={88} cy={60} r={24} fill="url(#hw-slate)" stroke="#506775" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d="M88 35 V41" stroke="#c0cad0" strokeWidth="1" transform={`rotate(${i * 45} 88 60)`} />)}
        <g className={active ? "ep-rotor" : undefined} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          {[0, 1, 2].map((i) => <path key={i} d="M88 60 Q92 42 103 42 Q107 57 88 60" fill="#8fa1ab" transform={`rotate(${i * 120} 88 60)`} />)}
        </g>
        <circle cx={88} cy={60} r="5" fill="url(#g-metal)" stroke="#576d7b" />
        <Led x={33} y={20} active={active} color="#3fd079" />
        <Font x={87} y={99} size={6} color="#c5d2d6">STAR / DELTA   400V</Font>
      </Housing>
      {["T1", "T2", "T3", "B1", "B2", "B3"].map((id) => {
        const [nx, ny] = starterPort("stardelta", id)!;
        const x = (nx / 64) * 174;
        const y = (ny / 64) * 110;
        const ix = id[0] === "T" ? 1 : Number(id.slice(1)) - 1;
        return (
          <g key={id}>
            <rect x={x - 8} y={y - 7.3} width={16} height={14.6} rx={2} fill="#d3e0e7" stroke="#687f8e" />
            <Pin x={x} y={y} copper color={id[0] === "T" ? [CYAN, BLUE, YELLOW][Number(id.slice(1)) - 1] : [YELLOW, RED, BLUE][ix]} r={3.1} />
          </g>
        );
      })}
    </g>
  );
}

function Pilot({ kind, active }: { kind: "green" | "red" | "amber" | "buzzer"; active?: boolean }) {
  const buzzer = kind === "buzzer";
  return (
    <g>
      <Pin x={32} y={10.3} r={3} copper color={kind === "red" ? RED : kind === "amber" ? YELLOW : CYAN} />
      <circle cx={32} cy={48} r={31} fill="url(#g-metal)" stroke="#667888" strokeWidth="1.2" />
      <circle cx={32} cy={48} r={27} fill="#182b39" stroke="#b7c9d1" strokeWidth="2" />
      {buzzer ? (
        <g>
          <circle cx={32} cy={48} r={23} fill="url(#hw-rubber)" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={32 + 15 * Math.cos(i * Math.PI / 4)} cy={48 + 15 * Math.sin(i * Math.PI / 4)} r={2} fill="#0b111a" stroke="#586673" />)}
          <circle cx={32} cy={48} r={6} fill="#151c24" />
        </g>
      ) : <Lens x={32} y={48} r={21} tint={kind} active={active} />}
      <Pin x={32} y={89.5} r={3} copper color={CYAN} />
    </g>
  );
}

function Button({ stop, pressed }: { stop?: boolean; pressed?: boolean }) {
  const color = stop ? "red" : "green";
  return (
    <g>
      <Pin x={33} y={11.8} r={2.8} copper color={RED} />
      <Housing x={4} y={23} w={58} h={62} tone="ivory" radius={6}>
        <rect x={6} y={25} width={54} height={58} rx={5} fill="#f6f8f9" stroke="#a5b3bc" />
        <circle cx={33} cy={51} r={25} fill="#9eadb8" stroke="#e5f0ee" strokeWidth="2" />
        <Lens x={33} y={pressed ? 53 : 51} r={20} tint={color} active={pressed} />
        <Font x={33} y={48} color="#f8fcfb" size={9} bold>PB</Font>
        <Font x={33} y={61} color="#f8fcfb" size={8} bold>{stop ? "(NC)" : "(NO)"}</Font>
      </Housing>
      <Pin x={33} y={103} r={3} copper color={RED} />
    </g>
  );
}

function StarJunction() {
  return (
    <g>
      <rect x={5} y={7} width={44} height={20} rx={2} fill="url(#hw-copper)" stroke="#92572d" />
      <Font x={27} y={20} color="#fff2d2" size={8} bold>STAR POINT</Font>
      {[9, 21, 34, 45].map((x) => <Screw key={x} x={x} y={18} copper r={2.1} />)}
    </g>
  );
}

registerGlyphs({
  "starter:sd-panel": () => <Stage />,
  "starter:n": () => <NeutralSource />,
  "starter:src-3ph": () => <PhaseSource />,
  "starter:term4": () => <PhaseTerminalBlock />,
  "starter:neutral-link": () => <NeutralStrip />,
  "starter:mcb-3": (p) => <MainBreaker on={p.on} label={p.label} />,
  "starter:phasefail": (p) => <PhaseMonitor active={p.active} />,
  "starter:timer-on": (p) => <Timer active={p.active} contactClosed={p.contactClosed} />,
  "starter:fuse": () => <Fuse />,
  "starter:overload": (p) => <Overload tripped={p.tripped} />,
  "starter:ct1": (p) => <Contactor active={p.active} label={p.label} />,
  "starter:stardelta": (p) => <Motor active={p.active} />,
  "starter:light-green": (p) => <Pilot kind="green" active={p.active} />,
  "starter:light-red": (p) => <Pilot kind="red" active={p.active} />,
  "starter:light-orange": (p) => <Pilot kind="amber" active={p.active} />,
  "starter:buzzer": (p) => <Pilot kind="buzzer" active={p.active} />,
  "starter:pb-no": (p) => <Button pressed={p.pressed} />,
  "starter:pb-nc": (p) => <Button stop pressed={p.pressed} />,
  "starter:junction": () => <StarJunction />,
});