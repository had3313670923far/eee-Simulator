import { registerGlyphs, type GlyphProps } from "./Icons";
import { Display, FanBlades, Housing, Ink, Led, Lens, PHASE, Pin } from "./hardware/Primitives";

function SupplyBlock({ kind, voltage = 230 }: { kind: "L" | "N" | "PE"; voltage?: 110 | 230 }) {
  const accent = kind === "L" ? "#d74246" : kind === "PE" ? "#3dad62" : "#377dd0";
  return (
    <g>
      <Housing x={13} y={9} w={38} h={47} tone="ivory">
        <rect x={14.8} y={11} width={34.4} height={5} rx={1.1} fill={accent} />
        <rect x={17} y={19} width={30} height={22} rx={2} fill="#e7ecee" stroke="#a9b9c2" strokeWidth={0.7} />
        <Ink x={32} y={27} size={7.5} color="#293d50">{kind === "L" ? "1~" : kind}</Ink>
        <Ink x={32} y={33} size={3.3} color="#647482">{kind === "L" ? `${voltage}V / 50Hz` : kind === "N" ? "NEUTRAL" : "PROTECTIVE"}</Ink>
        <rect x={22} y={35.2} width={20} height={2.2} rx={0.8} fill={accent} opacity={0.7} />
        <rect x={18} y={43} width={28} height={10.5} rx={2} fill="#c6d0d7" stroke="#899ba9" strokeWidth={0.6} />
        <Pin x={32} y={50} color={accent} copper r={2.8} />
      </Housing>
    </g>
  );
}

function ThreePhaseSource({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={9} y={9} w={46} h={47} tone="ivory">
        <rect x={11} y={11} width={42} height={7} rx={1.2} fill="url(#hw-dark)" />
        <Ink x={32} y={16} size={5.2} color="#f2f7fa">THREE PHASE SUPPLY</Ink>
        <Display x={15} y={22} w={34} h={12} text="400 V" active={active} color="#8fe6c2" />
        {[20, 32, 44].map((cx, i) => (
          <g key={cx}>
            <Lens x={cx} y={39.5} r={2.5} tint={(["red", "amber", "blue"] as const)[i]} />
            <Pin x={cx} y={47} color={PHASE[i]} copper r={2.4} />
          </g>
        ))}
      </Housing>
    </g>
  );
}

function Generator({ photo = false, active }: { photo?: boolean; active?: boolean }) {
  const xs = photo ? [20, 28, 36, 44] : [19, 27, 35, 43];
  return (
    <g>
      <Housing x={7.5} y={8} w={49} h={48} tone={photo ? "dark" : "ivory"}>
        <rect x={10} y={10.3} width={44} height={6.2} rx={1} fill={photo ? "#343f4b" : "#d9e4e7"} />
        <Ink x={32} y={15} color={photo ? "#f8f8ed" : "#294453"} size={4.6}>GENERATOR  3P</Ink>
        {photo ? (
          <g>
            <rect x={13} y={19} width={24} height={19} rx={2.2} fill="#1b2d26" stroke="#6d7e77" />
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M14 ${22 + i * 4} H35`} stroke="#698274" strokeWidth={1.2} />)}
            <FanBlades x={39} y={29} r={8} active={active} color="#64796b" />
            <rect x={11} y={38.7} width={42} height={4} rx={1} fill="#344051" />
            <path d="M13 42.5 H51" stroke="#d6a15e" strokeWidth={1.1} />
          </g>
        ) : (
          <g>
            <Display x={13} y={20} w={23} h={12} text={active ? "50.0" : "00.0"} active={active} sub="Hz" />
            <Led x={45} y={23} color="#43c87a" active={active} />
            <Led x={45} y={29} color="#f3bd47" />
            <rect x={14} y={36} width={36} height={4.3} rx={1} fill="#b6c5ce" />
            <Ink x={32} y={39.4} size={3.2}>R    S    T    N</Ink>
          </g>
        )}
        {xs.map((cx, i) => <Pin key={i} x={cx} y={photo ? 48.5 : 46.5} color={PHASE[i]} copper r={1.7} />)}
      </Housing>
    </g>
  );
}

function SolarPanel() {
  return (
    <g>
      <path d="M18 46 L14 53 M46 46 L50 53 M13 53 H51" stroke="#596e7d" strokeWidth={2.2} fill="none" />
      <Housing x={8} y={13} w={48} h={33} tone="slate" radius={1.4}>
        <rect x={10} y={15} width={44} height={29} fill="#0c304d" />
        {[0, 1, 2, 3].map((row) => [0, 1, 2, 3, 4].map((col) => (
          <g key={`${row}-${col}`}>
            <rect x={11 + col * 8.5} y={16 + row * 7} width={7.4} height={6} rx={0.7} fill={col % 2 ? "url(#hw-blue)" : "#1b638d"} stroke="#7bbed5" strokeWidth={0.3} />
            <path d={`M${11.5 + col * 8.5} ${17 + row * 7} H${16 + col * 8.5}`} stroke="#d4f6ff" strokeOpacity="0.43" strokeWidth={0.45} />
          </g>
        )))}
        <path d="M10.5 16 L40 16 L23 43 H11 Z" fill="#fff" opacity={0.09} />
      </Housing>
      <Pin x={20} y={54} color="#ef5858" label="+" copper r={1.9} />
      <Pin x={44} y={54} color="#5caff5" label="-" copper r={1.9} />
    </g>
  );
}

function BatteryBank() {
  return (
    <g>
      <Housing x={9} y={17} w={46} h={34} tone="dark">
        <rect x={11} y={19} width={42} height={4.4} rx={0.8} fill="#e04f40" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={12.5 + i * 13.3} y={24.7} width={11.8} height={22} rx={1.2} fill="url(#hw-slate)" stroke="#b4c0c9" strokeWidth={0.6} />
            <path d={`M${14 + i * 13.3} 34 H${22.4 + i * 13.3}`} stroke="#40566a" strokeWidth={1.1} />
          </g>
        ))}
        <Ink x={32} y={32.5} size={5.6} color="#f6f8ef">48V</Ink>
        <Ink x={32} y={44.3} size={3.2} color="#f7fafb">BATTERY BANK</Ink>
      </Housing>
      <Pin x={26} y={53} color="#f05b58" copper label="+" />
      <Pin x={38} y={53} color="#62aeed" copper label="-" />
    </g>
  );
}

function DcSource({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={16} y={8} w={32} h={48} tone="ivory">
        <rect x={18} y={10} width={28} height={7} rx={1} fill="#acbcc7" />
        <Ink x={32} y={15.5} size={5.8} color="#283e54">24 V DC</Ink>
        <Display x={20} y={20} w={24} h={11} text="24.0" active={active} />
        <rect x={19} y={34} width={26} height={8} rx={1} fill="#d4dce3" />
        <Ink x={26} y={39.6} color="#c93d3c" size={5.2}>+</Ink>
        <Ink x={39} y={39.6} color="#357ac5" size={5.2}>-</Ink>
        <Pin x={32} y={36} color="#e35a55" copper r={1.6} />
        <Pin x={32} y={52} color="#619bdc" copper r={2.2} />
      </Housing>
    </g>
  );
}

function GridPole() {
  return (
    <g>
      <path d="M32 14 V55 M14 19 H50 M18 23 H46" stroke="#685745" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M31 14 V55 M14 18 H50" stroke="#d2ba91" strokeWidth={1} fill="none" opacity="0.65" />
      {[22, 32, 42].map((cx, i) => (
        <g key={i}>
          <path d={`M${cx} 12 V17`} stroke="#aebecb" strokeWidth={1.6} />
          <path d={`M${cx - 3} 12 H${cx + 3}`} stroke="#aab8c2" strokeWidth={2.2} />
          <path d={`M${cx} 20 V45`} stroke={PHASE[i]} strokeWidth={1.6} />
          <Pin x={cx} y={47} color={PHASE[i]} copper r={1.8} />
        </g>
      ))}
      <Housing x={26} y={25} w={12} h={10} tone="slate">
        <Ink x={32} y={31.5} size={3.1} color="#152a3b">GRID</Ink>
      </Housing>
    </g>
  );
}

function Transformer() {
  return (
    <g>
      <Housing x={12} y={15} w={40} h={34} tone="slate">
        <rect x={15} y={18} width={34} height={27} rx={1} fill="#3b4d5c" stroke="#9fb2bb" strokeWidth={0.8} />
        {[18, 21, 24, 27, 30, 33, 36, 39, 42].map((y) => <path key={y} d={`M17 ${y} H47`} stroke="#90a1a8" strokeWidth={0.4} opacity={0.6} />)}
        <rect x={19} y={19} width={11} height={23} rx={2.2} fill="#192836" stroke="#edbd6a" strokeWidth={0.6} />
        <rect x={34} y={19} width={11} height={23} rx={2.2} fill="#192836" stroke="#edbd6a" strokeWidth={0.6} />
        {[20, 23, 26, 29, 32, 35, 38, 41].map((y) => (
          <g key={y}>
            <path d={`M20 ${y} H29 M35 ${y} H44`} stroke="url(#hw-copper)" strokeWidth={1.2} />
          </g>
        ))}
        <rect x={29} y={17} width={6} height={27} fill="#7f929d" />
        <Ink x={32} y={48} size={3.1} color="#f2f3ee">230 / 24V</Ink>
      </Housing>
      {[22, 42].map((cx, i) => (
        <g key={i}>
          <Pin x={cx} y={13} copper r={1.8} />
          <Pin x={cx} y={51} copper r={1.8} />
        </g>
      ))}
    </g>
  );
}

function CapacitorBank() {
  return (
    <g>
      <path d="M12 49 H52" stroke="#536573" strokeWidth={2.7} />
      {[18, 32, 46].map((cx, i) => (
        <g key={i}>
          <rect x={cx - 5.4} y={17} width={10.8} height={32} rx={2.2} fill="url(#hw-slate)" stroke="#718593" strokeWidth={0.8} />
          <ellipse cx={cx} cy={18} rx={5.2} ry={2.3} fill="#d7e1e8" stroke="#627686" strokeWidth={0.6} />
          <ellipse cx={cx - 1.2} cy={32} rx={0.7} ry={11.4} fill="#fff" opacity={0.32} />
          <path d={`M${cx - 4} 41 H${cx + 4}`} stroke={PHASE[i]} strokeWidth={1.8} />
          <Pin x={cx} y={12} copper color={PHASE[i]} r={1.8} />
        </g>
      ))}
      <Ink x={32} y={56} size={4.1} color="#bcd0da">kVAr BANK</Ink>
    </g>
  );
}

function Inverter({ solar, active }: { solar?: boolean; active?: boolean }) {
  const top = solar ? [18.5, 47.5] : [18.5, 47.5];
  const bottom = solar ? [18.5, 33, 47.5] : [18.5, 47.5];
  return (
    <g>
      <Housing x={9} y={10} w={46} h={44} tone={solar ? "ivory" : "dark"}>
        <rect x={11} y={11.5} width={42} height={5} rx={0.8} fill={solar ? "#30a3b1" : "#415e75"} />
        <Ink x={32} y={15.1} color="#f4ffff" size={4.6}>{solar ? "SOLAR INVERTER" : "ONLINE UPS"}</Ink>
        <Display x={16} y={20} w={32} h={13} text={solar ? "3.2 kW" : "230 V"} sub={solar ? "PV / GRID" : "BATTERY"} active={active} />
        <rect x={15} y={36} width={34} height={6.5} rx={1.1} fill={solar ? "#d8e3e7" : "#24394a"} />
        {[0, 1, 2, 3].map((i) => <Led key={i} x={21 + i * 7.4} y={39.1} color={i === 3 ? "#f3bb54" : "#47cc83"} active={active && (i < 3 || solar)} r={1.1} />)}
        <Ink x={32} y={46} size={3.4} color={solar ? "#405f6e" : "#d7e4eb"}>{solar ? "DC INPUT   AC OUTPUT" : "PURE SINE WAVE"}</Ink>
        {top.map((cx, i) => <Pin key={`t${i}`} x={cx} y={14.5} r={1.5} copper />)}
        {bottom.map((cx, i) => <Pin key={`b${i}`} x={cx} y={49.5} r={1.7} copper color={PHASE[i]} />)}
      </Housing>
    </g>
  );
}

function LogoController({ type, active }: { type: "main" | "dm8" | "am2"; active?: boolean }) {
  const xs = type === "main" ? [14.5, 22.5, 30.5, 38.5, 46.5] : type === "dm8" ? [22.5, 30.5, 38.5, 46.5] : [24.5, 31.2, 37.9];
  const width = type === "main" ? 51 : type === "dm8" ? 36 : 25;
  const x = 32 - width / 2;
  return (
    <g>
      <Housing x={x} y={11} w={width} h={43} tone="slate" radius={1.6}>
        <rect x={x + 1.5} y={18.2} width={width - 3} height={27.3} rx={0.8} fill="#bbcad3" stroke="#738996" strokeWidth={0.65} />
        <path d={`M${x + 1} 21 H${x + width - 1}`} stroke="#428dba" strokeWidth={2} />
        {type === "main" && <Display x={x + 4} y={25} w={24} h={12} text="LOGO!" active={active} sub="RUN" />}
        {type !== "main" && <rect x={x + 3.4} y={25} width={width - 6.8} height={9} rx={1} fill="#d4e0e5" stroke="#718895" strokeWidth={0.5} />}
        {type === "main" && [0, 1, 2, 3].map((i) => <rect key={i} x={x + 32 + (i % 2) * 6.6} y={26 + Math.floor(i / 2) * 6} width={5} height={4.4} rx={0.6} fill="#7f929e" stroke="#526a78" strokeWidth={0.4} />)}
        <Ink x={32} y={type === "main" ? 42.1 : 30} size={type === "main" ? 4.2 : 4.5} color="#243e55">{type === "main" ? "230RC" : type === "dm8" ? "DM8 24" : "AM2"}</Ink>
        <Led x={x + width - 5} y={41} active={active} r={1.2} />
        {xs.map((cx, i) => (
          <g key={i}>
            <Pin x={cx} y={16} dark r={1.25} />
            <Pin x={cx} y={48} dark r={1.4} />
          </g>
        ))}
      </Housing>
    </g>
  );
}

function Drive({ type, active }: { type: "vfd" | "soft" | "servo"; active?: boolean }) {
  const xs = type === "vfd" ? [21, 32, 43] : [17.5, 33, 48.5];
  const topY = type === "vfd" ? 10 : 14.5;
  const bottomY = type === "vfd" ? 50.5 : 49.5;
  const name = type === "vfd" ? "VFD DRIVE" : type === "soft" ? "SOFT START" : "SERVO DRIVE";
  return (
    <g>
      <Housing x={11} y={8} w={44} h={47} tone={type === "soft" ? "slate" : "dark"}>
        <rect x={13} y={11} width={40} height={5} rx={1} fill={type === "servo" ? "#398ab1" : type === "soft" ? "#bd7047" : "#3e86b2"} />
        <Ink x={33} y={14.8} size={4.7} color="#f1f7f7">{name}</Ink>
        <Display x={17} y={19} w={32} h={13} text={type === "vfd" ? "50.0Hz" : type === "soft" ? "rAMP" : "1500rpm"} active={active} />
        <rect x={16} y={35} width={34} height={9} rx={1} fill={type === "soft" ? "#9aabb6" : "#263b4c"} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={18 + i * 7.7} y={37} width={5.4} height={4.3} rx={0.8} fill={i === 0 ? "#258a64" : "#8fa2ad"} stroke="#526a7c" strokeWidth={0.45} />)}
        <Led x={48} y={47} active={active} />
        {xs.map((cx, i) => (
          <g key={i}>
            <Pin x={cx} y={topY} color={PHASE[i]} copper r={1.5} />
            <Pin x={cx} y={bottomY} color={PHASE[i]} copper r={1.5} />
          </g>
        ))}
      </Housing>
    </g>
  );
}

function DcPsu({ voltage, active }: { voltage: 12 | 24; active?: boolean }) {
  const xs = voltage === 24 ? [20, 28, 36, 44] : [20.5, 45.5];
  return (
    <g>
      <Housing x={15} y={9} w={34} h={46} tone="ivory">
        <rect x={17} y={12} width={30} height={6} fill="#334c62" rx={1} />
        <Ink x={32} y={16.2} size={5} color="#f6f8f9">DC POWER</Ink>
        <Ink x={32} y={26.2} size={8} color="#3f6978">{voltage}V</Ink>
        <Ink x={32} y={31.2} size={3.6}>SWITCHING SUPPLY</Ink>
        {[36, 39.2, 42.4].map((y) => <path key={y} d={`M19 ${y} H45`} stroke="#a2b0b8" strokeWidth={0.85} />)}
        <Led x={26} y={48} active={active} />
        <Ink x={39} y={50} size={3.6} color="#35667b">{active ? "DC OK" : "DC OUT"}</Ink>
        {xs.map((cx, i) => (
          <g key={i}>
            <Pin x={cx} y={14} r={1.35} copper />
            <Pin x={cx} y={49.5} r={1.35} copper color={i % 2 ? "#559ee7" : "#e3665d"} />
          </g>
        ))}
      </Housing>
    </g>
  );
}

function PidController({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={11} y={10} w={42} h={45} tone="dark">
        <rect x={14} y={13} width={36} height={31} rx={1} fill="#132a39" stroke="#8296a1" strokeWidth={0.8} />
        <Display x={18} y={16} w={28} h={12} text={active ? "85.0" : "--.-"} active={active} color="#f18766" sub="PV C" />
        <Ink x={32} y={33} size={4.3} color="#f0bd6d">PID TEMP</Ink>
        {[0, 1, 2].map((i) => <rect key={i} x={17 + i * 11} y={36} width={8.3} height={5.3} rx={0.9} fill="#6c8193" stroke="#a0aeb5" strokeWidth={0.5} />)}
        <Led x={46} y={48} active={active} color="#eead57" />
        <Pin x={20} y={46} r={1.4} copper />
        <Pin x={28} y={46} r={1.4} copper />
      </Housing>
    </g>
  );
}

function HmiPanel({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={6} y={10} w={52} h={42} tone="dark">
        <rect x={9} y={13} width={46} height={30} rx={1.8} fill="#051a29" stroke="#527e97" strokeWidth={0.8} />
        <rect x={11} y={15} width={42} height={26} rx={0.8} fill={active ? "#12384a" : "#162f39"} />
        <Ink x={20} y={21} size={4.1} color={active ? "#b7eadc" : "#718d91"}>SYSTEM</Ink>
        <path d="M15 28 H47 M15 33 H47" stroke="#5e9fae" strokeWidth={0.75} />
        {[0, 1, 2].map((i) => <rect key={i} x={16 + 11 * i} y={25} width={7} height={4.5} rx={0.7} fill={active ? ["#238b6b", "#3e92bb", "#b58440"][i] : "#536e77"} />)}
        <path d="M12 16 L20 16 L12 25" fill="#fff" opacity={0.09} />
        <Ink x={32} y={48.7} size={4.4} color="#c5d8e2">TOUCH PANEL</Ink>
        <Pin x={20} y={44} r={1.4} />
        <Pin x={44} y={44} r={1.4} />
      </Housing>
    </g>
  );
}

function PlcRack({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={6} y={12} w={52} h={42} tone="slate">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x={9 + i * 9.2} y={17} width={8.2} height={26} rx={1} fill="url(#hw-dark)" stroke="#a2b1ba" strokeWidth={0.65} />
            <path d={`M${10 + i * 9.2} 20 H${16 + i * 9.2}`} stroke={i ? "#568aaa" : "#63ad77"} strokeWidth={1.2} />
            <Led x={13 + i * 9.2} y={25} active={active} r={1.1} />
            {[32, 35, 38].map((y) => <path key={y} d={`M${11 + i * 9.2} ${y} H${16 + i * 9.2}`} stroke="#708598" strokeWidth={0.7} />)}
          </g>
        ))}
        <Ink x={32} y={49} size={4.5} color="#182f43">PLC CPU / I-O</Ink>
        <Pin x={23} y={44} r={1.4} />
        <Pin x={42} y={44} r={1.4} />
      </Housing>
    </g>
  );
}

function IoModule({ active }: GlyphProps) {
  const xs = [20.5, 28.8, 37.1, 45.4];
  return (
    <g>
      <Housing x={13} y={10} w={38} h={45} tone="slate">
        <rect x={15} y={18} width={34} height={26} rx={1} fill="#274257" />
        <Ink x={32} y={24} size={5.6} color="#e5eef3">I/O 8 / 8</Ink>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Led x={21 + i * 7.2} y={30} active={active} color="#54ca86" r={1.2} />
            <Led x={21 + i * 7.2} y={38} active={active} color="#f0b852" r={1.2} />
          </g>
        ))}
        {xs.map((cx) => <g key={cx}><Pin x={cx} y={14.5} r={1.45} /><Pin x={cx} y={49.5} r={1.45} /></g>)}
      </Housing>
    </g>
  );
}

function EthernetSwitch({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={8} y={16} w={48} h={33} tone="dark">
        <Ink x={32} y={22} size={4.7} color="#dae9f2">INDUSTRIAL LAN</Ink>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={11.5 + i * 11} y={26} width={8.3} height={12} rx={1} fill="#0a1826" stroke="#7695a5" strokeWidth={0.7} />
            {[0, 1, 2].map((n) => <path key={n} d={`M${13 + i * 11 + n * 2} 29 V32`} stroke="url(#hw-copper)" strokeWidth={0.55} />)}
            <path d={`M${13 + i * 11} 34 H${18 + i * 11}`} stroke="#789bad" strokeWidth={0.75} />
            <Led x={16 + i * 11} y={41} active={active} r={1.1} />
          </g>
        ))}
        <Pin x={24} y={40} r={1.1} />
        <Pin x={40} y={40} r={1.1} />
      </Housing>
    </g>
  );
}

function AtsUnit({ sources = 3, active }: { sources?: number; active?: boolean }) {
  return (
    <g>
      <Housing x={8} y={8} w={48} h={48} tone="ivory">
        <rect x={10} y={10} width={44} height={7} fill="#334c61" rx={1.1} />
        <Ink x={32} y={15} size={5.3} color="#f5f7fa">ATS {sources} SOURCE</Ink>
        <Display x={27} y={23} w={23} h={10.5} text={active ? "AUTO" : "READY"} active={active} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={12} y={19.5 + i * 10.7} width={11} height={8} rx={1} fill={i < sources ? "#d7e1e5" : "#aebbc3"} stroke="#9caeb7" strokeWidth={0.7} />
            <Led x={17.5} y={23.5 + i * 10.7} active={active && i === 0} color={PHASE[i]} r={1.3} />
            <Pin x={15} y={24 + i * 11} r={1.5} />
          </g>
        ))}
        <circle cx={38} cy={41.5} r={5.2} fill="url(#hw-dark)" stroke="#899eae" strokeWidth={0.7} />
        <path d="M38 41.5 L41 38.7" stroke="#fff" strokeWidth={1.3} />
        <Ink x={38} y={50.8} size={3.7}>OUT</Ink>
        <Pin x={48} y={32} copper r={1.6} />
      </Housing>
    </g>
  );
}

function ReadyBoard({ type, active }: { type: "dol" | "star" | "distribution" | "pump"; active?: boolean }) {
  const tag = { dol: "DOL STARTER", star: "STAR / DELTA", distribution: "DISTRIBUTION", pump: "PUMP CONTROL" }[type];
  return (
    <g>
      <Housing x={7} y={8} w={50} h={48} tone="slate">
        <rect x={10} y={11} width={44} height={5.9} rx={1} fill="#254055" />
        <Ink x={32} y={15.3} size={4.2} color="#f3f7f9">{tag}</Ink>
        <rect x={10} y={18.5} width={44} height={29} rx={1.3} fill="#dce4e7" stroke="#718897" strokeWidth={0.75} />
        <path d="M13 22 H51 M13 44 H51" stroke="#909fa7" strokeWidth={1.2} />
        {type === "pump" ? (
          <g>
            <rect x={14} y={24} width={8} height={15} fill="url(#hw-ivory)" stroke="#8ca0ab" />
            <rect x={25} y={24} width={8} height={15} fill="url(#hw-dark)" />
            <FanBlades x={44} y={32} r={7} active={active} color="#6797bb" />
          </g>
        ) : [0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={13 + i * 14} y={23} width={11} height={17} rx={0.9} fill={type === "distribution" ? "url(#hw-ivory)" : i === 0 ? "url(#hw-ivory)" : "url(#hw-slate)"} stroke="#738491" strokeWidth={0.6} />
            <path d={`M${15 + i * 14} 26 H${22 + i * 14}`} stroke={type === "distribution" ? PHASE[i] : "#d5864b"} strokeWidth={1.2} />
            <rect x={17 + i * 14} y={30} width={4} height={6} rx={0.7} fill={active ? "#238c65" : "#314251"} />
          </g>
        ))}
        <Ink x={32} y={43.5} size={3.2} color="#415a68">{type === "star" ? "MAIN  STAR  DELTA" : type === "distribution" ? "L1   L2   L3   N" : type === "pump" ? "AUTO / MANUAL" : "MOTOR CONTROL"}</Ink>
        {type !== "distribution" && [13, 28, 43].map((cx, i) => <g key={i}><Pin x={cx} y={11} r={1.55} copper /><Pin x={cx} y={50} r={1.55} copper /></g>)}
      </Housing>
    </g>
  );
}

registerGlyphs({
  gen: (p) => <Generator active={p.active} />,
  "gen-photo": (p) => <Generator photo active={p.active} />,
  "src-3ph": (p) => <ThreePhaseSource active={p.active} />,
  "src-1ph": () => <SupplyBlock kind="L" />,
  "src-110": () => <SupplyBlock kind="L" voltage={110} />,
  n: () => <SupplyBlock kind="N" />,
  pe: () => <SupplyBlock kind="PE" />,
  solar: () => <SolarPanel />,
  battery: () => <BatteryBank />,
  "dc-source": (p) => <DcSource active={p.active} />,
  grid: () => <GridPole />,
  transformer: () => <Transformer />,
  "cap-bank": () => <CapacitorBank />,
  ups: (p) => <Inverter active={p.active} />,
  "pv-inverter": (p) => <Inverter solar active={p.active} />,
  logo230: (p) => <LogoController type="main" active={p.active} />,
  "logo-dm8": (p) => <LogoController type="dm8" active={p.active} />,
  "logo-am2": (p) => <LogoController type="am2" active={p.active} />,
  vfd: (p) => <Drive type="vfd" active={p.active} />,
  softstarter: (p) => <Drive type="soft" active={p.active} />,
  "servo-drive": (p) => <Drive type="servo" active={p.active} />,
  psu24: (p) => <DcPsu voltage={24} active={p.active} />,
  smps12: (p) => <DcPsu voltage={12} active={p.active} />,
  pid: (p) => <PidController active={p.active} />,
  hmi: (p) => <HmiPanel active={p.active} />,
  "plc-rack": (p) => <PlcRack active={p.active} />,
  "io-module": (p) => <IoModule active={p.active} />,
  "eth-switch": (p) => <EthernetSwitch active={p.active} />,
  ats: (p) => <AtsUnit active={p.active} />,
  ats2: (p) => <AtsUnit sources={2} active={p.active} />,
  "dol-unit": (p) => <ReadyBoard type="dol" active={p.active} />,
  "sd-unit": (p) => <ReadyBoard type="star" active={p.active} />,
  "db-unit": (p) => <ReadyBoard type="distribution" active={p.active} />,
  "pump-unit": (p) => <ReadyBoard type="pump" active={p.active} />,
});