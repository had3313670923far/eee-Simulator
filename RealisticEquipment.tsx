import { registerGlyphs, type GlyphProps } from "./Icons";
import { FanBlades, Foot, Housing, Ink, MeterFace, PHASE, Pin, Screw } from "./hardware/Primitives";

function ElectricMotor({ kind, active }: { kind: "three" | "one" | "photo" | "star"; active?: boolean }) {
  const single = kind === "one";
  const star = kind === "star";
  const xs = star ? [22.5, 30, 37.5] : single ? [22, 34] : [22, 28, 34];
  const body = kind === "photo" ? "hw-green" : single ? "hw-amber" : "hw-blue";
  const darkEdge = kind === "photo" ? "#385744" : single ? "#844d30" : "#204768";
  return (
    <g>
      <path d="M14 50 H50" stroke="#455b66" strokeWidth={2.4} />
      <Foot x={15} y={48} />
      <Foot x={37} y={48} />
      <rect x={19} y={12} width={19} height={11} rx={2} fill="url(#hw-ivory)" stroke="#667e8c" strokeWidth={1} />
      <rect x={21} y={16} width={15} height={3.2} rx={0.6} fill="#d58245" />
      {xs.map((cx, i) => <Pin key={i} x={cx} y={13} color={single ? [PHASE[0], PHASE[2]][i] : PHASE[i]} copper r={1.35} />)}
      {star && xs.map((cx, i) => <Pin key={i} x={cx} y={20.2} copper r={1.1} />)}
      <rect x={10} y={23} width={34} height={26} rx={5} fill={`url(#${body})`} stroke={darkEdge} strokeWidth={1.15} />
      <path d="M12 26 Q20 21 31 25" fill="none" stroke="#fff" strokeWidth={1} opacity={0.37} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M13 ${28 + 3.7 * i} H41`} stroke={darkEdge} opacity={0.8} strokeWidth={1} />)}
      <rect x={15} y={31} width={17} height={9} rx={0.8} fill="#e4e8e8" stroke="#607888" strokeWidth={0.7} />
      <Ink x={23.5} y={35.3} size={3.4} color="#304554">{single ? "1~ 230V" : "3~ 400V"}</Ink>
      <Ink x={23.5} y={38.6} size={3.1} color="#546b77">{star ? "Y / DELTA" : kind === "photo" ? "IE3  MOTOR" : "50Hz"}</Ink>
      <path d="M43 34 H55" stroke="url(#g-metal)" strokeWidth={2.2} />
      <FanBlades x={46} y={36} r={9.6} active={active} color="#8195a2" />
      {kind === "photo" && [0, 1, 2].map((i) => <Screw key={i} x={15 + i * 11.6} y={45.6} r={0.8} />)}
    </g>
  );
}

function IndustrialPump({ active }: GlyphProps) {
  return (
    <g>
      <path d="M12 51 H52" stroke="#53697b" strokeWidth={2.7} />
      <Foot x={17} y={48} />
      <Foot x={39} y={48} />
      <Housing x={11} y={24} w={27} h={24} tone="blue" radius={7}>
        <circle cx={25} cy={36} r={10.2} fill="#246597" stroke="#aed4e6" strokeWidth={1} />
        <path d="M25 28 Q32 28 33 36 Q33 44 25 44" fill="none" stroke="#b1dce8" strokeWidth={1.5} />
        <circle cx={25} cy={36} r={3.5} fill="url(#g-metal)" stroke="#506878" />
        {active && <circle cx={25} cy={36} r={7} fill="none" stroke="#87d0ed" strokeDasharray="2 4" strokeWidth={1.3} className="ep-rotor" style={{ transformOrigin: "25px 36px" }} />}
      </Housing>
      <path d="M18 24 V16 H25 M18 48 V53" stroke="#667d8e" strokeWidth={3} fill="none" />
      <Housing x={36} y={26} w={16} h={19} tone="slate">
        {[30, 34, 38, 42].map((y) => <path key={y} d={`M38 ${y} H50`} stroke="#516677" strokeWidth={0.9} />)}
      </Housing>
      <Pin x={18.5} y={18} copper r={1.55} />
      <Pin x={41} y={21} copper r={1.55} />
      <Pin x={17} y={53} copper r={1.55} />
      <Ink x={44} y={49} size={3.4} color="#d3e7f3">PUMP</Ink>
    </g>
  );
}

function ElectricLamp({ led, active }: { led?: boolean; active?: boolean }) {
  const lower = led ? 50 : 53;
  return (
    <g>
      {active && <circle cx={32} cy={28} r={16} fill="#fff3bb" opacity={0.28} className="ep-glow" />}
      <path d="M32 11 C20 11 19 25 23 31 Q26 35 27 39 H37 Q38 35 41 31 C45 24 43 11 32 11Z" fill={active ? "url(#hw-white-lens)" : "url(#hw-glass)"} stroke="#99abb6" strokeWidth={1.1} />
      <path d="M24 20 Q27 14 31 14" fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.8} />
      {led ? (
        <g>
          {[25, 29, 33, 37].map((cx) => <path key={cx} d={`M${cx} 32 l${32 - cx} 7`} stroke="#a0aeb1" strokeWidth={0.85} />)}
          <circle cx={32} cy={28} r={4.2} fill={active ? "#fff8d4" : "#b9c9ce"} />
        </g>
      ) : <path d="M27 29 L29 25 L32 31 L35 25 L37 29" stroke={active ? "#e9a650" : "#9ba8ae"} fill="none" strokeWidth={1.2} />}
      {[40, 43, 46].map((y) => <path key={y} d={`M26 ${y} H38`} stroke="#607786" strokeWidth={2.2} />)}
      <rect x={27} y={48} width={10} height={2.5} rx={1} fill="#8193a0" />
      <Pin x={28} y={lower} r={1.35} />
      <Pin x={36} y={lower} r={1.35} />
    </g>
  );
}

function DcMotor({ servo, active }: { servo?: boolean; active?: boolean }) {
  const xs = servo ? [20, 27, 34] : [24, 38];
  return (
    <g>
      <Foot x={12} y={47} />
      <Foot x={34} y={47} />
      <rect x={12} y={23} width={34} height={25} rx={5} fill={servo ? "url(#hw-blue)" : "url(#hw-red)"} stroke="#314c63" strokeWidth={1} />
      {[26, 30, 34, 38, 42].map((y) => <path key={y} d={`M15 ${y} H42`} stroke={servo ? "#295d91" : "#9b4c4a"} strokeWidth={0.8} />)}
      <rect x={17} y={31} width={19} height={10} rx={1} fill="url(#hw-ivory)" stroke="#647d8b" strokeWidth={0.6} />
      <Ink x={26.5} y={37.2} size={4.8} color="#3b5364">{servo ? "SERVO" : "DC 24V"}</Ink>
      <FanBlades x={48} y={35} r={8} active={active} color="#7c94a3" />
      {servo && <rect x={17} y={18} width={18} height={5.3} rx={1} fill="#263849" />}
      {xs.map((cx, i) => <Pin key={i} x={cx} y={servo ? 50 : 13} color={PHASE[i]} r={1.55} copper />)}
    </g>
  );
}

function IndustrialFan({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={9} y={10} w={46} h={44} tone="slate">
        <FanBlades x={32} y={30} r={17} active={active} color="#7a97a4" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${14 + i * 9} 12 V48`} stroke="#c4d2da" strokeOpacity={0.58} strokeWidth={0.85} />)}
        <Ink x={32} y={52} size={3.7} color="#dde8eb">INDUSTRIAL FAN</Ink>
      </Housing>
      <Pin x={20} y={53} r={1.4} />
      <Pin x={44} y={53} r={1.4} />
    </g>
  );
}

function Compressor({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={8} y={32} w={47} h={19} tone="red" radius={6}>
        <path d="M12 39 H52" stroke="#e9afae" strokeWidth={0.85} />
        <Ink x={27} y={46} size={4.4} color="#f4e9df">AIR  COMPRESSOR</Ink>
      </Housing>
      <rect x={34} y={21} width={16} height={14} rx={2} fill="url(#hw-dark)" stroke="#8195a1" />
      <FanBlades x={43} y={29} r={6} active={active} color="#899da9" />
      <path d="M12 32 V19 H24 M45 21 V15 H49" stroke="#708496" strokeWidth={2.3} fill="none" />
      <MeterFace x={19} y={23} r={5} active={active} label="bar" />
      <Foot x={14} y={50} />
      <Foot x={38} y={50} />
      {[15, 22, 29].map((cx, i) => <Pin key={cx} x={cx} y={55} color={PHASE[i]} r={1.3} />)}
    </g>
  );
}

function Conveyor({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={8} y={27} w={48} h={19} tone="dark" radius={8}>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${13 + i * 9} 29 L${18 + i * 9} 43`} stroke="#8094a1" strokeWidth={1.15} />)}
        <circle cx={16} cy={36} r={6} fill="url(#hw-slate)" />
        <circle cx={48} cy={36} r={6} fill="url(#hw-slate)" />
        {active && <path d="M20 29 H43" stroke="#b0e1e7" strokeWidth={0.85} strokeDasharray="2 4" className="ep-flow" />}
      </Housing>
      {[16, 33, 44].map((cx, i) => <rect key={i} x={cx - 4} y={20 - (i % 2) * 3} width={8} height={7 + (i % 2) * 3} rx={1} fill="url(#hw-copper)" stroke="#985d3a" strokeWidth={0.6} />)}
      <path d="M14 45 V53 M50 45 V53" stroke="#617885" strokeWidth={2.2} />
      <Pin x={14} y={55} r={1.4} />
      <Pin x={50} y={55} r={1.4} />
    </g>
  );
}

function HeatingElement({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={10} y={21} w={44} h={27} tone="slate">
        <rect x={12} y={23} width={40} height={20} rx={2} fill="#4c4d4b" stroke="#d7b283" strokeWidth={0.8} />
        <path d="M14 33 H20 Q23 21 26 33 Q29 44 32 33 Q35 21 38 33 Q41 44 44 33 H50" fill="none" stroke={active ? "#ff9243" : "#ab784d"} strokeWidth={2} className={active ? "ep-glow" : undefined} />
        <Ink x={32} y={47} size={3.6} color="#fbf1df">HEATER</Ink>
      </Housing>
      <Pin x={15} y={15} copper r={1.7} />
      <path d="M15 17 V24" stroke="#697e8c" strokeWidth={1.6} />
      <Pin x={49} y={49} copper r={1.7} />
    </g>
  );
}

function FluorescentTube({ active }: GlyphProps) {
  return (
    <g>
      {active && <rect x={12} y={22} width={40} height={17} rx={7} fill="#ffffcb" opacity={0.3} className="ep-glow" />}
      <rect x={8} y={24} width={48} height={13} rx={6.5} fill={active ? "url(#hw-white-lens)" : "url(#hw-glass)"} stroke="#95aebd" strokeWidth={1.1} />
      <path d="M15 27 H49" stroke="#fff" strokeWidth={2} opacity={0.68} />
      <rect x={6} y={23} width={7} height={15} rx={1} fill="url(#g-metal)" stroke="#657684" />
      <rect x={51} y={23} width={7} height={15} rx={1} fill="url(#g-metal)" stroke="#657684" />
      <path d="M7 38 V47 M57 38 V47" stroke="#758997" strokeWidth={1.5} />
      <Pin x={7} y={47} r={1.5} />
      <Pin x={57} y={47} r={1.5} />
      <Ink x={32} y={50} size={4} color="#c6d7df">FLUORESCENT</Ink>
    </g>
  );
}

function SolenoidValve({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={19} y={12} w={26} h={22} tone={active ? "green" : "dark"}>
        <rect x={22} y={16} width={20} height={13} rx={1} fill="#172737" stroke="#dfa366" strokeWidth={0.6} />
        {[18, 20, 22, 24, 26].map((y) => <path key={y} d={`M24 ${y} H40`} stroke="url(#hw-copper)" strokeWidth={0.85} />)}
        <Ink x={32} y={32} size={3.6} color="#f2f3df">24V COIL</Ink>
      </Housing>
      <path d="M32 34 V39" stroke="#9babb3" strokeWidth={2} />
      <Housing x={11} y={39} w={42} h={10} tone="copper" radius={3}>
        <path d="M14 44 H50" stroke="#f4d09e" strokeWidth={1.5} />
        <circle cx={32} cy={44} r={3} fill="#7c4b30" />
      </Housing>
      <Pin x={26} y={52} copper r={1.5} />
      <Pin x={38} y={52} copper r={1.5} />
    </g>
  );
}

function ElectroMagnet({ active }: GlyphProps) {
  return (
    <g>
      <path d="M20 44 V28 Q20 14 32 14 Q44 14 44 28 V44" fill="none" stroke="url(#hw-slate)" strokeWidth={7} strokeLinecap="round" />
      <path d="M20 43 V27 Q20 15 32 15 Q44 15 44 27 V43" fill="none" stroke={active ? "#e88349" : "#a36e4e"} strokeWidth={2.5} strokeDasharray="3 1.5" className={active ? "ep-glow" : undefined} />
      <Housing x={13} y={43} w={38} h={7} tone="slate">
        <Ink x={32} y={49} color="#f1f2ee" size={3.6}>ELECTROMAGNET</Ink>
      </Housing>
      <Pin x={22} y={55} copper r={1.5} />
      <Pin x={42} y={55} copper r={1.5} />
    </g>
  );
}

/* Terminals share the exact screw centres declared in terminals.ts. */
function TerminalBlock({ count }: { count: number }) {
  const unit = count <= 4 ? 12.5 : count === 6 ? 9 : 4;
  const gap = count <= 4 ? 1.5 : count === 6 ? 1.4 : 1.4;
  const total = count * unit + (count - 1) * gap;
  const x0 = (64 - total) / 2;
  const top = count <= 4 ? 19 : 14;
  const bottom = count <= 4 ? 45 : count === 6 ? 50 : 48;
  return (
    <g>
      <path d={`M${x0 - 1} 50.8 H${x0 + total + 1}`} stroke="#7d8e9a" strokeWidth={2.2} />
      {Array.from({ length: count }, (_, i) => {
        const cx = x0 + unit / 2 + i * (unit + gap);
        return (
          <g key={i}>
            <rect x={x0 + i * (unit + gap)} y={top - 3} width={unit} height={bottom - top + 6} rx={1.2} fill="url(#hw-ivory)" stroke="#7d90a0" strokeWidth={0.6} />
            <rect x={cx - Math.min(unit - 1, 6) / 2} y={25} width={Math.min(unit - 1, 6)} height={10} rx={0.5} fill="#b7c4cc" />
            {count <= 6 && <Ink x={cx} y={40} size={count > 4 ? 2.7 : 3.6} color="#405364">{i + 1}</Ink>}
            <Pin x={cx} y={top} r={count >= 12 ? 0.72 : count > 4 ? 1.1 : 1.8} copper />
            <Pin x={cx} y={bottom} r={count >= 12 ? 0.72 : count > 4 ? 1.1 : 1.8} copper />
          </g>
        );
      })}
    </g>
  );
}

function LinkBar({ earth, large }: { earth?: boolean; large?: boolean }) {
  const xs = large ? [15, 25, 35, 45, 52] : [15, 26.3, 37.6, 49];
  const top = large ? 24.5 : 24.5;
  const bottom = large ? 38 : 39.5;
  return (
    <g>
      <Housing x={8} y={20} w={48} h={24} tone={earth ? "green" : "blue"}>
        <rect x={10} y={29} width={44} height={6.3} rx={1} fill="url(#hw-copper)" stroke="#79533c" strokeWidth={0.6} />
        <path d="M10 27 H54" stroke={earth ? "#f4d452" : "#b9e3f1"} strokeWidth={1.35} />
        <Ink x={32} y={33.3} size={3.2} color="#d4f1f0">{earth ? "PROTECTIVE EARTH" : "NEUTRAL LINK"}</Ink>
        {xs.map((cx) => <g key={cx}><Pin x={cx} y={top} r={1.55} copper /><Pin x={cx} y={bottom} r={1.55} copper /></g>)}
      </Housing>
    </g>
  );
}

function PhaseBusbar() {
  return (
    <g>
      <Housing x={8} y={14} w={48} h={36} tone="dark">
        {[0, 1, 2, 3].map((i) => {
          const y = 19.5 + i * 8;
          return (
            <g key={i}>
              <rect x={11} y={y - 2.8} width={42} height={5.6} rx={0.8} fill="url(#hw-copper)" stroke="#77432d" strokeWidth={0.5} />
              <path d={`M12 ${y - 2} H52`} stroke={PHASE[i]} strokeWidth={1.15} />
              <Pin x={19} y={y} copper color={PHASE[i]} r={1.55} />
              <Pin x={45} y={y} copper color={PHASE[i]} r={1.55} />
            </g>
          );
        })}
      </Housing>
    </g>
  );
}

function CombBusbar() {
  return (
    <g>
      <rect x={8} y={20} width={48} height={7.3} rx={1} fill="url(#hw-copper)" stroke="#78412c" strokeWidth={0.9} />
      <rect x={8} y={20} width={48} height={3} rx={1} fill="#ffe4a0" opacity={0.65} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${12 + i * 5} 27 V43`} stroke="#bd783e" strokeWidth={2.25} strokeLinecap="round" />)}
      <rect x={10} y={40} width={44} height={4} rx={0.9} fill="#ce8e52" />
      {[12, 52].map((cx) => <Pin key={cx} x={cx} y={22.5} r={1.35} copper />)}
      {[16, 48].map((cx) => <Pin key={cx} x={cx} y={42.5} r={1.35} copper />)}
    </g>
  );
}

function JunctionBox() {
  const pts = [[45, 32], [38.5, 43.3], [25.5, 43.3], [19, 32], [25.5, 20.7], [38.5, 20.7]];
  return (
    <g>
      <circle cx={32} cy={32} r={19} fill="url(#hw-slate)" stroke="#607688" strokeWidth={1.1} />
      <circle cx={32} cy={32} r={15.8} fill="url(#hw-dark)" stroke="#b1c2c9" strokeWidth={0.8} />
      <circle cx={32} cy={32} r={9} fill="#465d68" stroke="#d7ad6b" strokeWidth={1.2} />
      <path d="M25 32 H39 M32 25 V39" stroke="#d6ab73" strokeWidth={2.2} />
      {pts.map(([cx, cy], i) => <Pin key={i} x={cx} y={cy} r={1.35} copper />)}
    </g>
  );
}

function WireDuct({ wide }: { wide?: boolean }) {
  const y = wide ? 14 : 21;
  const h = wide ? 37 : 23;
  return (
    <g>
      <Housing x={8} y={y} w={48} h={h} tone="slate" radius={1.2}>
        <rect x={9.6} y={y + 2} width={44.8} height={h - 4} rx={0.5} fill="#aebdc8" />
        <path d={`M12 ${y + h / 2} H52`} stroke="#647a89" strokeWidth={0.85} />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={11.4 + i * 3.55} y={y + 4} width={1.65} height={h - 8} rx={0.4} fill="#62788a" opacity={0.7} />)}
        <path d={`M10 ${y + 2.2} H54 M10 ${y + h - 2} H54`} stroke="#f4f7f8" strokeWidth={0.7} opacity={0.7} />
      </Housing>
    </g>
  );
}

function DistributionBlock() {
  const xs = [14, 24, 34, 44, 52];
  return (
    <g>
      <Housing x={8} y={18} w={48} h={28} tone="ivory">
        <rect x={10} y={27} width={44} height={9} rx={1} fill="url(#hw-copper)" />
        <path d="M11 31.5 H53" stroke="#ffe1aa" strokeWidth={1.1} />
        <Ink x={32} y={34} size={3.8}>DISTRIBUTION</Ink>
        {xs.map((cx) => <g key={cx}><Pin x={cx} y={24} r={1.4} copper /><Pin x={cx} y={40} r={1.4} copper /></g>)}
      </Housing>
    </g>
  );
}

function RailBusbar() {
  return (
    <g>
      <Housing x={1} y={23} w={62} h={18} tone="slate" radius={2}>
        <rect x={3} y={28} width={58} height={8} rx={1} fill="url(#hw-copper)" stroke="#77604c" strokeWidth={0.6} />
        <path d="M4 29 H60" stroke="#fff0ba" opacity={0.8} strokeWidth={0.85} />
        {Array.from({ length: 12 }, (_, i) => <Pin key={i} x={5 + i * (54 / 11)} y={32} r={1.25} copper />)}
      </Housing>
    </g>
  );
}

function ColoredTerminal({ tone, label }: { tone: "blue" | "green" | "amber" | "red"; label: string }) {
  return (
    <g>
      <Housing x={19} y={7} w={26} h={50} tone={tone} radius={4}>
        <rect x={21} y={10} width={22} height={8} rx={1} fill="#fff" opacity={0.24} />
        <path d="M22 22 H42 M22 42 H42" stroke="#142634" strokeOpacity={0.4} strokeWidth={0.8} />
        <Ink x={32} y={34} size={6} color="#f8f5e9">{label}</Ink>
        <Pin x={32} y={12} copper r={2.45} />
        <Pin x={32} y={52} copper r={2.45} />
      </Housing>
    </g>
  );
}

function IndustrialConnector({ plug }: { plug?: boolean }) {
  return (
    <g>
      <Housing x={12} y={16} w={40} h={34} tone={plug ? "amber" : "blue"} radius={9}>
        <circle cx={32} cy={33} r={14} fill="url(#hw-dark)" stroke="#d5e1e5" strokeWidth={1} />
        {[22, 32, 42].map((cx) => (
          <g key={cx}>
            {plug ? <rect x={cx - 1.4} y={23} width={2.8} height={13} rx={1} fill="url(#hw-copper)" stroke="#744d30" strokeWidth={0.5} /> : <circle cx={cx} cy={33} r={2.7} fill="#1a2a3a" stroke="#b7c9cf" strokeWidth={1} />}
            <Pin x={cx} y={plug ? 9 : 16} copper r={1.45} />
            <Pin x={cx} y={48} copper r={1.45} />
          </g>
        ))}
      </Housing>
      <Ink x={32} y={56} size={3.6} color="#bcd2dd">3P INDUSTRIAL</Ink>
    </g>
  );
}

function CableGland() {
  return (
    <g>
      <path d="M32 12 V52" stroke="#273948" strokeWidth={5} />
      {[17, 27, 38].map((y) => (
        <g key={y}>
          <rect x={22} y={y} width={20} height={7} rx={2} fill="url(#g-metal)" stroke="#697b89" strokeWidth={0.8} />
          <path d={`M25 ${y + 2} H39`} stroke="#fff" opacity={0.6} strokeWidth={0.7} />
        </g>
      ))}
      <path d="M21 47 H43 L39 52 H25 Z" fill="url(#hw-rubber)" stroke="#6c7e89" strokeWidth={0.8} />
    </g>
  );
}

function RailEndBracket() {
  return (
    <g>
      <Housing x={25} y={13} w={14} h={39} tone="slate" radius={1.5}>
        <path d="M29 19 H35 V43 H29 Z" fill="#d1dce2" stroke="#8495a1" strokeWidth={0.8} />
        <Screw x={32} y={25} r={2.1} />
        <Screw x={32} y={39} r={2.1} />
      </Housing>
      <path d="M22 50 H42 V55 H22 Z" fill="url(#g-metal)" stroke="#647687" />
    </g>
  );
}

function PanelCabinet({ size }: { size: "S" | "M" | "L" | "floor" }) {
  const width = size === "S" ? 33 : size === "M" ? 42 : size === "L" ? 50 : 45;
  const x = (64 - width) / 2;
  const y = size === "floor" ? 6 : 10;
  return (
    <g>
      <Housing x={x} y={y} w={width} h={size === "floor" ? 53 : 46} tone="slate" radius={1.3}>
        <rect x={x + 2.5} y={y + 2.6} width={width - 5} height={size === "floor" ? 47 : 40} rx={1} fill="url(#hw-ivory)" stroke="#8fa0ab" strokeWidth={0.7} />
        <rect x={x + 4} y={y + 4} width={width - 11} height={size === "floor" ? 44 : 37} rx={0.9} fill="#cbd8dd" stroke="#a1b0b6" strokeWidth={0.55} />
        <path d={`M${x + width - 7} ${y + 4} V${y + (size === "floor" ? 50 : 44)}`} stroke="#7c8c98" strokeWidth={0.9} />
        <rect x={x + width - 6.3} y={y + 19} width={2.1} height={9} rx={0.7} fill="#283c4b" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${x + 8} ${y + 12 + i * 10} H${x + width - 11}`} stroke="#a1b3b9" strokeWidth={0.7} strokeDasharray="2 2" />)}
        <Ink x={x + width / 2 - 2} y={y + (size === "floor" ? 48 : 42)} size={3.4}>IP65 / {size}</Ink>
      </Housing>
      {size === "floor" && <g><Foot x={x + 5} y={57} /><Foot x={x + width - 13} y={57} /></g>}
    </g>
  );
}

function BreakerEnclosure() {
  return (
    <g>
      <Housing x={8} y={10} w={48} h={46} tone="ivory">
        <rect x={11} y={13} width={42} height={37} rx={1.5} fill="#8698a8" stroke="#a6bac3" />
        <path d="M13 19 H51 M13 44 H51" stroke="#c5d5dc" strokeWidth={1.5} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={14 + i * 9.5} y={22} width={8.3} height={20} rx={1} fill="url(#hw-ivory)" stroke="#718898" strokeWidth={0.5} />
            <path d={`M${15.2 + i * 9.5} 25 H${21 + i * 9.5}`} stroke="#e3884a" strokeWidth={1.2} />
            <rect x={16.5 + i * 9.5} y={31} width={4} height={6.5} rx={0.9} fill="#263c4c" />
          </g>
        ))}
        <Screw x={11} y={13} r={1.35} />
        <Screw x={53} y={13} r={1.35} />
        <Ink x={32} y={54} size={3.5}>MCB ENCLOSURE</Ink>
      </Housing>
    </g>
  );
}

function HatRail() {
  return (
    <g>
      <path d="M8 23 H56 V27 H49 V38 H15 V27 H8 Z" fill="url(#g-metal)" stroke="#667a8a" strokeWidth={1.1} />
      <path d="M15 27 H49 M15 35 H49" stroke="#f4f8f7" strokeWidth={1} opacity={0.75} />
      {[17, 27, 37, 47].map((cx) => <ellipse key={cx} cx={cx} cy={32} rx={2.9} ry={1.3} fill="#536878" />)}
      <path d="M8 38 H56 V41 H8 Z" fill="#9eabb7" stroke="#697b89" strokeWidth={0.8} />
    </g>
  );
}

function PanelLabel() {
  return (
    <g>
      <Housing x={8} y={20} w={48} h={24} tone="dark" radius={1.5}>
        <rect x={10.3} y={22} width={43.4} height={19} rx={1} fill="#ecefe8" />
        <Ink x={32} y={35} size={9.1} color="#1e3648">LABEL</Ink>
        <Screw x={12} y={24} r={1} />
        <Screw x={52} y={40} r={1} />
      </Housing>
    </g>
  );
}

function GalvanizedPlate() {
  return (
    <g>
      <Housing x={8} y={9} w={48} h={46} tone="slate" radius={1.5}>
        <rect x={11} y={12} width={42} height={40} fill="url(#hw-brush)" />
        {Array.from({ length: 5 }, (_, row) => Array.from({ length: 6 }, (_, col) => <circle key={`${row}-${col}`} cx={14 + col * 7} cy={16 + row * 8} r={0.85} fill="#546c7c" />))}
        {[12, 52].map((cx) => [13, 51].map((cy) => <Screw key={`${cx}-${cy}`} x={cx} y={cy} r={1.4} />))}
      </Housing>
    </g>
  );
}

function VentilationFan({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={10} y={10} w={44} h={44} tone="ivory">
        <FanBlades x={32} y={32} r={15} active={active} />
        {[17, 22, 27, 32, 37, 42, 47].map((cx) => <path key={cx} d={`M${cx} 14 V50`} stroke="#b8c9d1" strokeWidth={1.3} />)}
        {[15, 25, 35, 45].map((cy) => <path key={cy} d={`M14 ${cy} H50`} stroke="#b8c9d1" strokeWidth={0.8} />)}
      </Housing>
    </g>
  );
}

function CeramicInsulator() {
  return (
    <g>
      <path d="M32 8 V54" stroke="#7d8992" strokeWidth={3} />
      {[14, 22, 30, 38, 46].map((cy, i) => (
        <g key={cy}>
          <ellipse cx={32} cy={cy} rx={i === 2 ? 11 : 9} ry={4.2} fill="url(#hw-ivory)" stroke="#a3a494" strokeWidth={1} />
          <path d={`M${24 + (i === 2 ? -2 : 0)} ${cy - 1} H${40 + (i === 2 ? 2 : 0)}`} stroke="#fff" strokeWidth={0.7} opacity={0.8} />
        </g>
      ))}
      <rect x={28} y={49} width={8} height={7} rx={1} fill="url(#g-metal)" />
    </g>
  );
}

function HazardSign() {
  return (
    <g>
      <path d="M32 8 L57 52 H7 Z" fill="url(#hw-amber)" stroke="#533921" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M32 14 L51 49 H13 Z" fill="none" stroke="#282e31" strokeWidth={2} strokeLinejoin="round" />
      <path d="M34 23 L27 34 H32 L28 43 L39 30 H33 Z" fill="#2a3237" />
      <path d="M24 47 H40" stroke="#39352b" strokeWidth={1.1} />
    </g>
  );
}

function BlankingCap() {
  return (
    <g>
      <circle cx={32} cy={32} r={17} fill="url(#g-metal)" stroke="#607686" strokeWidth={1.2} />
      <circle cx={32} cy={32} r={13.5} fill="url(#hw-rubber)" stroke="#a5b5bf" strokeWidth={1} />
      <circle cx={32} cy={32} r={9.5} fill="#263946" stroke="#617b8b" strokeWidth={0.7} />
      <path d="M25 26 Q32 21 39 26" stroke="#8ea7b1" fill="none" strokeWidth={1} opacity={0.7} />
      <Ink x={32} y={36} color="#d3dfe4" size={5.2}>IP67</Ink>
    </g>
  );
}

function DistributionBackplate() {
  return (
    <g>
      <Housing x={1.5} y={5.5} w={61} h={53} tone="slate" radius={3}>
        <rect x={3} y={7} width={58} height={50} rx={2.3} fill="#8395a3" stroke="#c2d0da" strokeWidth={0.8} />
        <rect x={5} y={9} width={54} height={46} rx={1.3} fill="#9aaab5" stroke="#607686" strokeWidth={0.6} />
        <rect x={5} y={9} width={54} height={46} fill="url(#hw-brush)" />
        <path d="M6 12 H58" stroke="#fff" strokeWidth={0.75} opacity={0.65} />
        <Ink x={32} y={16} color="#f4f6f7" size={4.3}>DISTRIBUTION BOX</Ink>
        {[27, 46].map((cy) => (
          <g key={cy}>
            <path d={`M8 ${cy} H56 V${cy + 2.4} H8 Z`} fill="url(#g-metal)" stroke="#607585" strokeWidth={0.6} />
            {[17, 27, 37, 47].map((cx) => <ellipse key={cx} cx={cx} cy={cy + 1.1} rx={1.5} ry={0.5} fill="#687e8d" />)}
          </g>
        ))}
        <Ink x={7} y={22} size={3.6} color="#f3f4ec">A</Ink>
        <Ink x={7} y={52} size={3.6} color="#f3f4ec">B</Ink>
        {[7.1, 56.9].map((cx) => [11, 53.3].map((cy) => <Screw key={`${cx}-${cy}`} x={cx} y={cy} r={1} />))}
      </Housing>
    </g>
  );
}

registerGlyphs({
  motor3: (p) => <ElectricMotor kind="three" active={p.active} />,
  motor1: (p) => <ElectricMotor kind="one" active={p.active} />,
  stardelta: (p) => <ElectricMotor kind="star" active={p.active} />,
  "motor-photo": (p) => <ElectricMotor kind="photo" active={p.active} />,
  pump: (p) => <IndustrialPump active={p.active} />,
  lamp: (p) => <ElectricLamp active={p.active} />,
  "dc-motor": (p) => <DcMotor active={p.active} />,
  "servo-motor": (p) => <DcMotor servo active={p.active} />,
  "fan-axial": (p) => <IndustrialFan active={p.active} />,
  compressor: (p) => <Compressor active={p.active} />,
  conveyor: (p) => <Conveyor active={p.active} />,
  heater: (p) => <HeatingElement active={p.active} />,
  "led-bulb": (p) => <ElectricLamp led active={p.active} />,
  "tube-light": (p) => <FluorescentTube active={p.active} />,
  solenoid: (p) => <SolenoidValve active={p.active} />,
  electromagnet: (p) => <ElectroMagnet active={p.active} />,
  term1: () => <TerminalBlock count={1} />,
  term2: () => <TerminalBlock count={2} />,
  term3: () => <TerminalBlock count={3} />,
  term4: () => <TerminalBlock count={4} />,
  term6: () => <TerminalBlock count={6} />,
  term12: () => <TerminalBlock count={12} />,
  "neutral-link": () => <LinkBar />,
  "earth-link": () => <LinkBar earth />,
  busbar: () => <PhaseBusbar />,
  comb: () => <CombBusbar />,
  junction: () => <JunctionBox />,
  duct: () => <WireDuct />,
  "duct-wide": () => <WireDuct wide />,
  "dist-block": () => <DistributionBlock />,
  "earth-bar": () => <LinkBar earth large />,
  "rail-bar": () => <RailBusbar />,
  "end-bracket": () => <RailEndBracket />,
  plug3: () => <IndustrialConnector plug />,
  socket3: () => <IndustrialConnector />,
  gland: () => <CableGland />,
  "tb-blue": () => <ColoredTerminal tone="blue" label="N" />,
  "tb-green": () => <ColoredTerminal tone="green" label="PE" />,
  "tb-amber": () => <ColoredTerminal tone="amber" label="L" />,
  "tb-red": () => <ColoredTerminal tone="red" label="L" />,
  "panel-s": () => <PanelCabinet size="S" />,
  "panel-m": () => <PanelCabinet size="M" />,
  "panel-l": () => <PanelCabinet size="L" />,
  cabinet: () => <PanelCabinet size="floor" />,
  box: () => <BreakerEnclosure />,
  din: () => <HatRail />,
  textlabel: () => <PanelLabel />,
  subplate: () => <GalvanizedPlate />,
  "vent-fan": (p) => <VentilationFan active={p.active} />,
  insulator: () => <CeramicInsulator />,
  warning: () => <HazardSign />,
  blanking: () => <BlankingCap />,
  "dist-panel": () => <DistributionBackplate />,
});