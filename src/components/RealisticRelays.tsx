import type { ReactNode } from "react";
import { registerGlyphs, SPlus, type GlyphProps } from "./Icons";

const FONT = "Arial, Helvetica, sans-serif";

function Print({
  x,
  y,
  children,
  size = 4.2,
  fill = "#364657",
  weight = 700,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      style={{ fontFamily: FONT }}
    >
      {children}
    </text>
  );
}

function ScrewWell({ x, y, dark = false, r = 2.05 }: { x: number; y: number; dark?: boolean; r?: number }) {
  return (
    <g>
      <rect
        x={x - r - 1.4}
        y={y - r - 1.15}
        width={(r + 1.4) * 2}
        height={(r + 1.15) * 2}
        rx={1.2}
        fill={dark ? "#121d2b" : "#9facb8"}
        stroke={dark ? "#45566b" : "#8595a3"}
        strokeWidth={0.6}
      />
      <SPlus x={x} y={y} r={r} copper />
    </g>
  );
}

function MouldedShell({
  x,
  y,
  w,
  h,
  dark = false,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <g>
      <rect x={x + 0.9} y={y + 1.6} width={w} height={h} rx={3} fill="#030916" opacity={0.35} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={dark ? "url(#rr-shadow)" : "url(#rr-ivory)"}
        stroke={dark ? "#435266" : "#8595a5"}
        strokeWidth={1}
      />
      <path
        d={`M${x + 3} ${y + 1.3} H${x + w - 3}`}
        stroke="#fff"
        strokeWidth={0.75}
        opacity={dark ? 0.24 : 0.72}
      />
      <path d={`M${x + w - 2} ${y + 3} V${y + h - 3}`} stroke="#1e293b" strokeWidth={1} opacity={0.22} />
      {children}
    </g>
  );
}

function StatusLamp({ x, y, active, color = "#40cb6b" }: { x: number; y: number; active?: boolean; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={2.6} fill="#526171" stroke="#9aa9b6" strokeWidth={0.6} />
      {active && <circle cx={x} cy={y} r={3.1} fill={color} opacity={0.3} className="ep-glow" />}
      <circle cx={x} cy={y} r={1.7} fill={active ? color : "#849099"} />
      <circle cx={x - 0.45} cy={y - 0.5} r={0.5} fill="#fff" opacity={active ? 0.9 : 0.35} />
    </g>
  );
}

/* One moulded body for the 2-, 3- and 4-pole contactor family. The screw
   centres are kept in sync with the wiring geometry in terminals.ts. */
function Contactor({
  poles,
  active,
  variant = "standard",
}: {
  poles: 2 | 3 | 4;
  active?: boolean;
  variant?: "standard" | "mini" | "capacitor" | "auxiliary";
}) {
  const xs = poles === 4 ? [12.5, 25.5, 38.5, 51.5] : poles === 3 ? [19, 32, 45] : [25.5, 38.5];
  const x = poles === 4 ? 5 : poles === 3 ? 11 : 18;
  const w = poles === 4 ? 54 : poles === 3 ? 42 : 29;
  const mid = x + w / 2;
  const auxiliary = variant === "auxiliary";
  const mini = variant === "mini";
  const capacitor = variant === "capacitor";
  const accent = auxiliary ? "#e7b54f" : capacitor ? "#d38945" : mini ? "#449bc7" : "#ec713a";

  return (
    <g>
      <MouldedShell x={x} y={8} w={w} h={47} dark={auxiliary}>
        <rect x={x + 1.5} y={9.4} width={w - 3} height={10} rx={1.3} fill={auxiliary ? "#253349" : "url(#rr-stone)"} />
        <path d={`M${x + 1} 20.4 H${x + w - 1}`} stroke={accent} strokeWidth={1.9} />
        <rect
          x={x + 2.1}
          y={21.8}
          width={w - 4.2}
          height={21.3}
          rx={1.3}
          fill={auxiliary ? "#253146" : "#e8ecee"}
          stroke={auxiliary ? "#566279" : "#adb7bd"}
          strokeWidth={0.6}
        />
        <rect x={x + 1.7} y={44} width={w - 3.4} height={9.7} rx={1} fill={auxiliary ? "#182436" : "#cdd6de"} />
        <path d={`M${x + 1.5} 43.6 H${x + w - 1.5}`} stroke={auxiliary ? "#394a61" : "#9ca9b4"} strokeWidth={0.9} />

        {xs.map((cx, i) => (
          <g key={i}>
            {i > 0 && <path d={`M${(xs[i - 1] + cx) / 2} 10 V19 M${(xs[i - 1] + cx) / 2} 45 V54`} stroke={auxiliary ? "#44546b" : "#b2bdc7"} strokeWidth={0.5} />}
            <ScrewWell x={cx} y={13.6} dark={auxiliary} r={2.05} />
            <Print x={cx} y={19.5} size={3.4} fill={auxiliary ? "#d3d8e2" : "#455465"}>
              {auxiliary ? ["13", "23", "11", "21"][i] : `${2 * i + 1} L${i + 1}`}
            </Print>
            <Print x={cx} y={47.5} size={3.3} fill={auxiliary ? "#d3d8e2" : "#455465"}>
              {auxiliary ? ["14", "24", "12", "22"][i] : `${2 * i + 2} T${i + 1}`}
            </Print>
            <ScrewWell x={cx} y={49.4} dark={auxiliary} r={2.05} />
          </g>
        ))}

        {/* Moulded brand plate, plunger, coil window and operation lamp */}
        <Print x={mid} y={26.3} size={poles === 4 ? 5 : 4.9} fill={auxiliary ? "#f1f1eb" : "#394b5c"} weight={800}>
          {auxiliary ? "2NO + 2NC" : capacitor ? "CAP CONTACTOR" : mini ? "MINI CONTACTOR" : "CONTACTOR"}
        </Print>
        <Print x={mid} y={30.2} size={3.4} fill={auxiliary ? "#aebdd0" : "#687888"}>
          {auxiliary ? "AC1  24 V" : capacitor ? "12.5 kVAr" : mini ? "9A  AC3" : poles === 4 ? "40A  AC1" : "25A  AC3"}
        </Print>
        {capacitor && (
          <g>
            <rect x={mid - 8.5} y={31.1} width={17} height={2.1} rx={0.6} fill="url(#rr-copper)" />
            {[0, 1, 2].map((i) => <rect key={i} x={mid - 6 + i * 5.4} y={30.4} width={2} height={3.5} rx={0.5} fill="#9b6b3d" />)}
          </g>
        )}
        <rect x={mid - 8.5} y={34.4} width={17} height={7.7} rx={1.2} fill={auxiliary ? "#0c1524" : "#7c8894"} stroke={auxiliary ? "#718197" : "#768795"} strokeWidth={0.6} />
        <path d={`M${mid - 7} 35.1 H${mid + 7}`} stroke="#e4ebed" opacity={0.6} strokeWidth={0.75} />
        <rect x={mid - 5.7} y={active ? 37.1 : 35.4} width={11.4} height={4.5} rx={0.85} fill={active ? "#445761" : "url(#rr-shadow)"} stroke="#354454" strokeWidth={0.5} />
        <path d={`M${mid - 4.8} ${active ? 37.9 : 36.2} H${mid + 4.8}`} stroke="#9eafb8" strokeWidth={0.6} opacity={0.6} />
        <StatusLamp x={x + w - 5.4} y={39.1} active={active} />
        <rect x={x + 2.5} y={53.9} width={w - 5} height={1.5} rx={0.6} fill={auxiliary ? "#48566a" : "#94a4af"} />
      </MouldedShell>

      {/* Auxiliary NO/NC block and A1/A2 coil are on the side of 3P units. */}
      {poles === 3 && (
        <g>
          <rect x={0.8} y={20} width={8.2} height={34} rx={1.8} fill="url(#rr-shadow)" stroke="#647589" strokeWidth={0.8} />
          {[26, 34, 42, 49.5].map((cy, i) => (
            <g key={cy}>
              <ScrewWell x={4} y={cy} dark r={1.5} />
              <Print x={4} y={cy - 3.2} size={2.7} fill="#e5e7e8">{["13", "14", "11", "12"][i]}</Print>
            </g>
          ))}
          <rect x={54.2} y={20.3} width={9.1} height={26.3} rx={1.7} fill="url(#rr-stone)" stroke="#637588" strokeWidth={0.8} />
          <Print x={57.2} y={24.1} size={3} fill="#35465b">A1</Print>
          <Print x={57.2} y={36.1} size={3} fill="#35465b">A2</Print>
          <ScrewWell x={60.5} y={28} r={1.5} />
          <ScrewWell x={60.5} y={40} r={1.5} />
        </g>
      )}
      {poles === 2 && (
        <g>
          <rect x={54} y={20.3} width={9.2} height={26.3} rx={1.7} fill="url(#rr-stone)" stroke="#637588" strokeWidth={0.8} />
          <Print x={56.8} y={24.1} size={3} fill="#35465b">A1</Print>
          <Print x={56.8} y={36.1} size={3} fill="#35465b">A2</Print>
          <ScrewWell x={60.5} y={28} r={1.5} />
          <ScrewWell x={60.5} y={40} r={1.5} />
        </g>
      )}
      {poles === 4 && (
        <g>
          {[14, 50].map((cx, i) => (
            <g key={cx}>
              <rect x={cx - 4.8} y={53.2} width={9.6} height={6.4} rx={1} fill={auxiliary ? "#283648" : "url(#rr-stone)"} stroke="#728090" strokeWidth={0.6} />
              <ScrewWell x={cx} y={56.5} dark={auxiliary} r={1.5} />
              <Print x={cx} y={62.5} size={3.2} fill={auxiliary ? "#c2cad6" : "#556579"}>{i ? "A2" : "A1"}</Print>
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

function PlugInRelay({ active }: GlyphProps) {
  return (
    <g>
      <MouldedShell x={16.2} y={30.5} w={31.6} h={22} dark>
        <path d="M19 42 H45" stroke="#9aabb6" strokeWidth={0.8} />
        <Print x={32} y={41} size={4} fill="#d8e4ec">RLY 24V</Print>
        {[[21.5, 33.5], [42.5, 33.5], [21.5, 45.5], [42.5, 45.5]].map(([cx, cy], i) => (
          <g key={i}>
            <ScrewWell x={cx} y={cy} dark r={1.9} />
            <Print x={cx + (i % 2 ? -0.2 : 0.2)} y={i < 2 ? cy + 5.6 : 51.6} size={3.3} fill="#d7dfeb">
              {["COM", "NO", "A1", "A2"][i]}
            </Print>
          </g>
        ))}
      </MouldedShell>
      {/* Translucent plug-in cover showing the copper coil and armature. */}
      <rect x={18} y={9.8} width={28} height={22.1} rx={2.6} fill="#263849" stroke="#89acba" strokeWidth={1} />
      <rect x={21.1} y={17.7} width={12.5} height={9.6} rx={1.5} fill="#5a5149" stroke="#c8ad86" strokeWidth={0.65} />
      {[19.8, 21.2, 22.6, 24, 25.4].map((y) => <path key={y} d={`M22 ${y} H33`} stroke="#e6aa5c" strokeWidth={0.6} opacity={0.9} />)}
      <path d={active ? "M33 17 L41 20 L39 25" : "M33 17 L40 18.2 L39 25"} stroke="#e5e8ec" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <circle cx={40} cy={19} r={1.2} fill="#d8e5ec" />
      <StatusLamp x={39} y={25} active={active} />
      <rect x={18} y={9.8} width={28} height={22.1} rx={2.6} fill="url(#rr-clear)" stroke="#a4c6cf" strokeWidth={0.6} opacity={0.54} />
      <path d="M20.2 12 V28" stroke="#ffffff" strokeWidth={1.8} opacity={0.5} />
      <Print x={32} y={15.2} size={4} fill="#183145">MY2N</Print>
    </g>
  );
}

function TimingRelay({ mode, active, contactClosed }: { mode: "ON" | "OFF"; active?: boolean; contactClosed?: boolean }) {
  const off = mode === "OFF";
  return (
    <g>
      <MouldedShell x={12} y={9} w={40} h={46}>
        <rect x={14} y={11} width={36} height={6.3} rx={1.1} fill="#bfc9d0" />
        <rect x={14} y={17.4} width={36} height={28} rx={1.4} fill="url(#rr-stone)" stroke="#acb7be" strokeWidth={0.55} />
        <path d="M14.5 20 H49.5" stroke={off ? "#e39840" : "#348ca9"} strokeWidth={1.4} />
        <Print x={32} y={24.2} size={5.2} fill="#233a4a">{off ? "OFF DELAY" : "ON DELAY"}</Print>
        <Print x={32} y={28} size={3.2} fill="#66788a">MULTI RANGE  24V</Print>
        <circle cx={32} cy={36} r={7.1} fill="url(#rr-shadow)" stroke="#6c8495" strokeWidth={1.1} />
        <circle cx={32} cy={36} r={5.6} fill="#dbe1e4" stroke="#64788b" strokeWidth={0.6} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (-140 + i * 55) * (Math.PI / 180);
          return (
            <path
              key={i}
              d={`M${32 + Math.cos(angle) * 6.4} ${36 + Math.sin(angle) * 6.4} L${32 + Math.cos(angle) * 7.7} ${36 + Math.sin(angle) * 7.7}`}
              stroke="#475568"
              strokeWidth={0.7}
            />
          );
        })}
        <path d="M32 36 L35.2 32.4" stroke="#23354a" strokeWidth={1.35} strokeLinecap="round" />
        <circle cx={32} cy={36} r={1.1} fill="#697989" />
        <Print x={32} y={45} size={4} fill="#304657">2.5 sec</Print>
        <StatusLamp x={18} y={36.2} active={contactClosed} color="#f5a74b" />
        <StatusLamp x={46} y={36.2} active={active} color="#44ce7c" />
        <rect x={14} y={46.5} width={36} height={6.7} rx={1} fill="#b5c0c8" />
        <ScrewWell x={18} y={12.5} r={1.8} />
        <ScrewWell x={46} y={12.5} r={1.8} />
        {!off && <ScrewWell x={31} y={12.5} r={1.1} />}
        {!off && <ScrewWell x={37} y={12.5} r={1.1} />}
        <ScrewWell x={22} y={48.5} r={1.8} />
        <ScrewWell x={42} y={48.5} r={1.8} />
        <Print x={19} y={57.8} size={3.3}>A1</Print>
        <Print x={44} y={57.8} size={3.3}>A2</Print>
      </MouldedShell>
    </g>
  );
}

function AuxiliaryBlock({ on }: GlyphProps) {
  const xs = [18, 27.3, 36.6, 46];
  return (
    <g>
      <MouldedShell x={12.5} y={9} w={39} h={46}>
        <rect x={14.3} y={17} width={35.4} height={26} rx={1.3} fill="#e2e9ed" stroke="#91a2af" strokeWidth={0.65} />
        <rect x={15.2} y={19.3} width={33.6} height={3} rx={0.65} fill="#3e7f9e" />
        <Print x={32} y={27.2} size={5.2} fill="#2b465c">AUX. CONTACT</Print>
        <Print x={32} y={32.7} size={4.4} fill="#366f89">2 NO</Print>
        <Print x={32} y={37.2} size={4.4} fill="#a85b35">1 NC</Print>
        <rect x={26} y={39.1} width={12} height={3} rx={0.5} fill={on ? "#41ab73" : "#8c9aa7"} />
        <ScrewWell x={22} y={13} r={1.8} />
        <ScrewWell x={42} y={13} r={1.8} />
        {xs.map((cx, i) => (
          <g key={i}>
            <Print x={cx} y={48} size={2.9}>{["14", "22", "33", "34"][i]}</Print>
            <ScrewWell x={cx} y={51} r={1.75} />
          </g>
        ))}
      </MouldedShell>
      <Print x={22} y={16.8} size={3.1}>13</Print>
      <Print x={42} y={16.8} size={3.1}>21</Print>
    </g>
  );
}

function MechanicalInterlock() {
  return (
    <g>
      <MouldedShell x={15} y={11} w={34} h={43} dark>
        <rect x={18} y={15} width={28} height={13} rx={1.3} fill="#101c2a" stroke="#69798b" strokeWidth={0.6} />
        <rect x={18} y={37} width={28} height={13} rx={1.3} fill="#101c2a" stroke="#69798b" strokeWidth={0.6} />
        <rect x={23} y={24} width={18} height={16} rx={1.4} fill="url(#rr-copper)" stroke="#684822" strokeWidth={0.7} />
        <path d="M25 29 H39 M25 34 H39" stroke="#6b4930" strokeWidth={1.1} />
        <path d="M20 21 L28 21 M36 43 L44 43" stroke="#d7e1e9" strokeWidth={1.2} />
        <rect x={29} y={15.6} width={6} height={4} rx={0.7} fill="#a8b9c7" />
        <rect x={29} y={45} width={6} height={4} rx={0.7} fill="#a8b9c7" />
        <Print x={32} y={57.4} size={4.7} fill="#e2bc62">INTERLOCK</Print>
      </MouldedShell>
    </g>
  );
}

function SolidStateRelay({ active }: GlyphProps) {
  return (
    <g>
      {/* Aluminium heatsink fins behind the solid-state module */}
      {[20, 26, 32, 38, 44].map((cy) => (
        <path key={cy} d={`M49 ${cy} H57`} stroke="#8b9aa7" strokeWidth={3.2} strokeLinecap="round" />
      ))}
      <MouldedShell x={12.5} y={9.2} w={40} h={46} dark>
        <rect x={15.2} y={18.4} width={34.5} height={28} rx={1.2} fill="#1c293a" stroke="#718296" strokeWidth={0.7} />
        <path d="M15.5 20 H49.2" stroke="#cd413d" strokeWidth={2.5} />
        <Print x={32} y={26.7} size={7} fill="#f1f4f7" weight={800}>SSR</Print>
        <Print x={32} y={30.4} size={4.2} fill="#c1d0dd">SSR-25DA</Print>
        <Print x={32} y={36} size={3.3} fill="#a9bacb">INPUT 3-32 VDC</Print>
        <Print x={32} y={40.1} size={3.3} fill="#a9bacb">OUT 24-380 VAC</Print>
        <StatusLamp x={32} y={44} active={active} color="#51d481" />
        <ScrewWell x={32} y={12} dark r={2.1} />
        <ScrewWell x={32} y={52} dark r={2.1} />
      </MouldedShell>
      <rect x={5.6} y={11.2} width={6} height={20} rx={1.1} fill="url(#rr-shadow)" stroke="#566779" strokeWidth={0.7} />
      <ScrewWell x={9} y={15} dark r={1.4} />
      <ScrewWell x={9} y={26} dark r={1.4} />
      <Print x={9} y={36.5} size={3.2} fill="#b5c6d5">+ / -</Print>
    </g>
  );
}

function IceCubeRelay({ active }: GlyphProps) {
  const xs = [18, 27.4, 36.8, 46];
  return (
    <g>
      <MouldedShell x={13} y={41.5} w={38} h={13.5} dark>
        <path d="M16 44 H48" stroke="#7790a6" strokeWidth={0.65} />
      </MouldedShell>
      <rect x={14} y={8} width={36} height={37} rx={2.5} fill="#22475d" stroke="#91bbc8" strokeWidth={1.15} />
      {/* Copper-wound coil visible through the blue transparent casing */}
      <rect x={20} y={22} width={13.6} height={14} rx={1.2} fill="#374853" stroke="#d5b581" strokeWidth={0.7} />
      {[23, 25, 27, 29, 31, 33, 35].map((cy) => <path key={cy} d={`M21 ${cy} H32.4`} stroke="#edb569" strokeWidth={0.85} opacity={0.9} />)}
      <path d={active ? "M35 24 L44 26 L41 32" : "M35 24 L43 23.4 L41 32"} stroke="#e3e8ed" strokeWidth={1.5} fill="none" />
      <circle cx={43} cy={24.5} r={1.2} fill="#e0e7ed" />
      <StatusLamp x={41.2} y={33.3} active={active} />
      <rect x={14} y={8} width={36} height={36} rx={2.5} fill="url(#rr-clear)" stroke="#d8f1f5" strokeWidth={0.6} opacity={0.58} />
      <path d="M16.5 10.7 V38" stroke="#fff" strokeWidth={1.3} opacity={0.55} />
      <Print x={32} y={20} size={4.1} fill="#163c56">MY2N 24VDC</Print>
      {xs.map((cx, i) => (
        <g key={i}>
          <ScrewWell x={cx} y={13} r={1.7} />
          <Print x={cx} y={17.3} size={2.8} fill="#23364a">{["COM", "NC", "NO", "NC"][i]}</Print>
          <Print x={cx} y={47.7} size={2.8} fill="#d6e4e9">{["A1", "A2", "COM", "NO"][i]}</Print>
          <ScrewWell x={cx} y={51} dark r={1.7} />
        </g>
      ))}
    </g>
  );
}

function RelaySocket() {
  const xs = [18, 27.4, 36.8, 46];
  return (
    <g>
      <MouldedShell x={11.8} y={9} w={40.4} h={46} dark>
        <rect x={14.8} y={19} width={34.4} height={26} rx={2.1} fill="#141d2d" stroke="#718193" strokeWidth={0.7} />
        <circle cx={32} cy={32} r={10.7} fill="#23354a" stroke="#8398a7" strokeWidth={1} />
        <circle cx={32} cy={32} r={8.1} fill="#0d1927" stroke="#3f586b" strokeWidth={0.7} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4 - Math.PI / 2;
          return (
            <g key={i}>
              <circle cx={32 + Math.cos(a) * 6.3} cy={32 + Math.sin(a) * 6.3} r={1.5} fill="url(#rr-copper)" stroke="#916143" strokeWidth={0.5} />
              <circle cx={32 + Math.cos(a) * 6.3} cy={32 + Math.sin(a) * 6.3} r={0.55} fill="#142132" />
            </g>
          );
        })}
        <path d="M29 31 H35 V34 H29Z" fill="#788998" />
        <Print x={32} y={42} size={3.3} fill="#b7c6d4">8 PIN BASE</Print>
        {xs.map((cx, i) => (
          <g key={i}>
            <ScrewWell x={cx} y={14} dark r={1.75} />
            <ScrewWell x={cx} y={50} dark r={1.75} />
          </g>
        ))}
      </MouldedShell>
    </g>
  );
}

function FlasherRelay({ active, contactClosed }: GlyphProps) {
  return (
    <g>
      <MouldedShell x={13.5} y={9} w={37} h={46}>
        <rect x={15.4} y={19.2} width={33.2} height={26} rx={1.5} fill="#e4e9ec" stroke="#adb9c2" strokeWidth={0.6} />
        <path d="M15.4 21.2 H48.6" stroke="#e39b3e" strokeWidth={2} />
        <Print x={32} y={26.3} size={5.2} fill="#324458">FLASH RELAY</Print>
        <circle cx={26} cy={35.1} r={5.1} fill="url(#rr-shadow)" stroke="#6e8090" strokeWidth={0.7} />
        <circle cx={26} cy={35.1} r={3.5} fill="#abb9c3" />
        <path d="M26 35.1 L28.5 33.2" stroke="#122336" strokeWidth={1} />
        <StatusLamp x={42} y={34.2} active={contactClosed} color="#f6b848" />
        <Print x={42} y={29.5} size={2.9} fill={active ? "#9f621b" : "#506071"}>OUT</Print>
        <Print x={32} y={43.4} size={3.8} fill="#506071">0.5 - 10 s</Print>
        {[22.5, 43.5].map((cx) => (
          <g key={cx}>
            <ScrewWell x={cx} y={14.5} r={1.8} />
            <ScrewWell x={cx} y={49.5} r={1.8} />
          </g>
        ))}
      </MouldedShell>
    </g>
  );
}

function SafetyRelay({ active }: GlyphProps) {
  return (
    <g>
      <MouldedShell x={13.5} y={9} w={37} h={46}>
        <rect x={15.2} y={18.6} width={33.6} height={27} rx={1.2} fill="url(#rr-amber)" stroke="#b67825" strokeWidth={0.65} />
        <rect x={15.2} y={19.4} width={33.6} height={2.8} fill="#242f38" />
        <Print x={32} y={28.2} size={5.6} fill="#292a25" weight={800}>SAFETY</Print>
        <Print x={32} y={33} size={4.1} fill="#51371e">24VDC / K1</Print>
        <rect x={20} y={36} width={24} height={7} rx={1.1} fill="#303c45" stroke="#a78657" strokeWidth={0.6} />
        <StatusLamp x={26} y={39.5} active={active} />
        <StatusLamp x={38} y={39.5} active={active} color="#7bdc82" />
        {[20.5, 45.5].map((cx) => (
          <g key={cx}>
            <ScrewWell x={cx} y={14.5} r={1.8} />
            <ScrewWell x={cx} y={49.5} r={1.8} />
          </g>
        ))}
      </MouldedShell>
    </g>
  );
}

function ThermalOverload({ tripped }: GlyphProps) {
  return (
    <g>
      <MouldedShell x={11} y={9} w={43} h={44}>
        <rect x={13} y={17} width={39} height={25} rx={1.4} fill="#d8e0e5" stroke="#9cacb8" strokeWidth={0.7} />
        <path d="M13.4 20 H51.5" stroke="#e17942" strokeWidth={1.9} />
        <Print x={32} y={25.2} size={4.4} fill="#344556">THERMAL RELAY</Print>
        <Print x={32} y={29} size={3.3} fill="#68788a">5.5 - 8.0 A</Print>
        <circle cx={34} cy={35} r={6} fill="url(#rr-shadow)" stroke="#7b8fa1" strokeWidth={0.8} />
        <circle cx={34} cy={35} r={4.2} fill="#c5d1d9" />
        <path d="M34 35 L37 32.6" stroke="#2b3d4d" strokeWidth={1.25} strokeLinecap="round" />
        <rect x={17} y={31.2} width={7} height={5} rx={1} fill={tripped ? "#ca3e3b" : "#3993b9"} stroke="#607688" strokeWidth={0.5} />
        <Print x={20.5} y={40.2} size={2.9} fill="#465d6c">RESET</Print>
        <StatusLamp x={46} y={35} active={tripped} color="#f16358" />
        {[17, 27, 37].map((cx) => <ScrewWell key={`t${cx}`} x={cx} y={12} r={1.8} />)}
        {[20, 32, 44].map((cx) => <ScrewWell key={`b${cx}`} x={cx} y={45} r={1.8} />)}
      </MouldedShell>
      <rect x={3.8} y={26.5} width={7.5} height={19} rx={1.1} fill="url(#rr-stone)" stroke="#647588" strokeWidth={0.65} />
      <ScrewWell x={7.5} y={31} r={1.3} />
      <ScrewWell x={7.5} y={41} r={1.3} />
      <rect x={53} y={26.5} width={8} height={19} rx={1.1} fill="url(#rr-stone)" stroke="#647588" strokeWidth={0.65} />
      <ScrewWell x={58} y={31} r={1.3} />
      <ScrewWell x={58} y={41} r={1.3} />
      <Print x={7.5} y={26.1} size={2.8}>95</Print>
      <Print x={7.5} y={48} size={2.8}>96</Print>
      <Print x={58} y={26.1} size={2.8}>97</Print>
      <Print x={58} y={48} size={2.8}>98</Print>
      <Print x={32} y={55.5} size={3.2} fill="#bdc8d2">NC 95-96</Print>
    </g>
  );
}

function MonitoringRelay({ active, kind }: { active?: boolean; kind: "earth" | "phase" }) {
  return (
    <g>
      <MouldedShell x={13.5} y={9} w={37} h={46}>
        <rect x={15.4} y={18.5} width={33.2} height={27} rx={1.3} fill="url(#rr-stone)" stroke="#acb9c1" strokeWidth={0.7} />
        <rect x={15.5} y={19.2} width={33} height={2.6} fill={kind === "earth" ? "#448eba" : "#b98242"} />
        <Print x={32} y={27.6} size={5.2} fill="#344858" weight={800}>{kind === "earth" ? "EARTH LEAK" : "PHASE MON"}</Print>
        <Print x={32} y={32} size={3.8} fill="#526477">{kind === "earth" ? "30mA / ELR" : "L1 L2 L3"}</Print>
        <rect x={20} y={35} width={24} height={7.5} rx={1.2} fill="#344253" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={24 + i * 8} cy={38.8} r={2} fill={active ? ["#f45b59", "#f4d455", "#59a4f5"][i] : "#748493"} stroke="#172435" strokeWidth={0.5} />
        ))}
        {[22.5, 43.5].map((cx) => <ScrewWell key={cx} x={cx} y={49.5} r={1.8} />)}
      </MouldedShell>
    </g>
  );
}

registerGlyphs({
  ct1: (p) => <Contactor poles={3} active={p.active} />,
  ct2: (p) => <Contactor poles={2} active={p.active} />,
  ct4: (p) => <Contactor poles={4} active={p.active} />,
  "ct4-pro": (p) => <Contactor poles={4} variant="auxiliary" active={p.active} />,
  "mini-contactor": (p) => <Contactor poles={3} variant="mini" active={p.active} />,
  "cap-contactor": (p) => <Contactor poles={2} variant="capacitor" active={p.active} />,
  relay: (p) => <PlugInRelay active={p.active} />,
  "timer-on": (p) => <TimingRelay mode="ON" active={p.active} contactClosed={p.contactClosed} />,
  "timer-off": (p) => <TimingRelay mode="OFF" active={p.active} contactClosed={p.contactClosed} />,
  "aux-block": (p) => <AuxiliaryBlock on={p.on} />,
  interlock: () => <MechanicalInterlock />,
  ssr: (p) => <SolidStateRelay active={p.active} />,
  relay8: (p) => <IceCubeRelay active={p.active} />,
  "relay-socket": () => <RelaySocket />,
  flasher: (p) => <FlasherRelay active={p.active} contactClosed={p.contactClosed} />,
  "safety-relay": (p) => <SafetyRelay active={p.active} />,
  overload: (p) => <ThermalOverload tripped={p.tripped} />,
  elr: (p) => <MonitoringRelay kind="earth" active={p.active} />,
  "phase-relay": (p) => <MonitoringRelay kind="phase" active={p.active} />,
});