import { registerGlyphs, type GlyphProps } from "./Icons";
import { Display, Housing, Ink, Led, Lens, MeterFace, PHASE, Pin } from "./hardware/Primitives";

type Tint = "green" | "red" | "blue" | "amber" | "yellow" | "white";

function PushStation({ tint, type, pressed, lit }: { tint: Tint; type: "NO" | "NC" | "NO+NC"; pressed?: boolean; lit?: boolean }) {
  const dual = type === "NO+NC";
  const left = dual ? 15.5 : lit ? 32 : 16.5;
  const right = dual ? 49 : lit ? 32 : 47.5;
  return (
    <g>
      <Housing x={10} y={11} w={44} h={43} tone="ivory" radius={4}>
        <rect x={12} y={13} width={40} height={38} rx={3} fill="#dce5e9" stroke="#9bacb5" strokeWidth={0.7} />
        <path d="M13 17 H51" stroke="#f9ffff" opacity={0.7} strokeWidth={0.65} />
        <circle cx={32} cy={31.7} r={16} fill="#697a87" stroke="#f5f7f7" strokeWidth={1.1} />
        <circle cx={32} cy={31.7} r={13.7} fill="url(#g-metal)" stroke="#536675" strokeWidth={0.8} />
        <Lens x={32} y={pressed ? 33 : 30.8} r={10.8} tint={tint} active={lit && pressed} />
        <Ink x={32} y={33.7} size={4.2} color="#f5ffff">{dual ? "I / O" : type}</Ink>
        <rect x={22} y={45.1} width={20} height={4.6} rx={1} fill="#edf1f2" stroke="#899ea8" strokeWidth={0.65} />
        <Ink x={32} y={48.5} size={3} color="#41566a">{lit ? "ILLUMINATED" : "CONTROL"}</Ink>
        <Pin x={left} y={dual ? 17.5 : 17.5} r={1.7} copper />
        {!lit && <Pin x={right} y={dual ? 19 : 17.5} r={1.7} copper />}
        {!lit && !dual && <Pin x={left} y={48.5} r={1.7} copper />}
        <Pin x={right} y={48.5} r={1.7} copper />
      </Housing>
    </g>
  );
}

function DoubleStation({ pressed }: GlyphProps) {
  return (
    <g>
      <Housing x={7} y={11} w={50} h={43} tone="ivory">
        <rect x={9} y={14} width={46} height={35} rx={2} fill="#d9e2e7" />
        <path d="M32 15 V47" stroke="#a3b4bf" strokeWidth={0.8} />
        <Lens x={22} y={30 + (pressed ? 1.5 : 0)} r={8.5} tint="green" active={pressed} />
        <Lens x={42} y={30} r={8.5} tint="red" />
        <Ink x={22} y={45} size={3.3}>START</Ink>
        <Ink x={42} y={45} size={3.3}>STOP</Ink>
        <Pin x={22} y={16} copper r={1.65} />
        <Pin x={42} y={16} copper r={1.65} />
        <Pin x={49} y={49} copper r={1.65} />
      </Housing>
    </g>
  );
}

function EmergencyStop({ keyed, pressed }: { keyed?: boolean; pressed?: boolean }) {
  return (
    <g>
      <Housing x={8} y={13} w={48} h={40} tone="amber" radius={5}>
        <rect x={10.5} y={16} width={43} height={34} rx={3} fill="#f7c54f" stroke="#9c661d" strokeWidth={1} />
        <circle cx={keyed ? 24 : 32} cy={32} r={keyed ? 13 : 16} fill="#8e1e25" stroke="#f3de91" strokeWidth={1.3} />
        <Lens x={keyed ? 24 : 32} y={pressed ? 34 : 31.6} r={keyed ? 9.3 : 12} tint="red" active={pressed} />
        <path d="M16 19 Q32 12 48 19" fill="none" stroke="#fff1bc" opacity={0.7} strokeWidth={1.2} />
        {keyed ? (
          <g>
            <circle cx={47} cy={31} r={6.6} fill="url(#hw-rubber)" stroke="#d2d8db" strokeWidth={1.1} />
            <path d="M47 27 V35 M47 31 L50 29" stroke="#d5c58f" strokeWidth={1.5} />
            <Ink x={47} y={42.5} size={2.9}>KEY</Ink>
          </g>
        ) : <Ink x={32} y={46} size={3.5} color="#673923">TURN TO RESET</Ink>}
        {keyed ? [12, 34, 41, 51].map((cx) => <Pin key={cx} x={cx} y={47} r={1.45} />) : (
          <g>
            {[13.5, 50.5].map((cx) => <g key={cx}><Pin x={cx} y={19.5} r={1.4} /><Pin x={cx} y={46.5} r={1.4} /></g>)}
          </g>
        )}
      </Housing>
    </g>
  );
}

function RotarySwitch({ type, on }: { type: "selector" | "onoff" | "three" | "key" | "toggle" | "cam"; on?: boolean }) {
  const tall = type === "cam";
  const metal = type === "key";
  const y = tall ? 12 : 14;
  const terms = type === "key" ? [32] : type === "toggle" ? [32] : [16, 48];
  return (
    <g>
      <Housing x={11} y={y} w={42} h={tall ? 42 : 40} tone={tall ? "ivory" : "slate"} radius={4}>
        <rect x={14} y={y + 3} width={36} height={tall ? 34 : 32} rx={2.7} fill="url(#hw-ivory)" stroke="#8294a0" strokeWidth={0.65} />
        <Ink x={32} y={y + 8.4} size={3.4} color="#506575">{type === "three" ? "I  -  O  -  II" : metal ? "KEY SWITCH" : type === "cam" ? "CAM SWITCH" : "I   /   O"}</Ink>
        <circle cx={32} cy={y + 21} r={11.7} fill="url(#g-metal)" stroke="#647887" strokeWidth={0.95} />
        <circle cx={32} cy={y + 21} r={9.3} fill="url(#hw-rubber)" stroke="#121e29" strokeWidth={0.8} />
        {metal ? (
          <g transform={`rotate(${on ? 48 : -48} 32 ${y + 21})`}>
            <path d={`M32 ${y + 15} V${y + 27}`} stroke="#ded8b9" strokeWidth={2.2} />
            <path d={`M32 ${y + 14} V${y + 7}`} stroke="#b7b4a0" strokeWidth={2.3} />
            <rect x={30} y={y + 6} width={4} height={4} rx={0.7} fill="#dfd5ae" />
          </g>
        ) : type === "toggle" ? (
          <g>
            <circle cx={32} cy={y + 21} r={3.2} fill="url(#g-metal)" />
            <path d={`M32 ${y + 21} L${on ? 39 : 25} ${y + 12}`} stroke="url(#g-metal)" strokeWidth={3.5} strokeLinecap="round" />
          </g>
        ) : (
          <g transform={`rotate(${on ? 47 : -47} 32 ${y + 21})`}>
            <rect x={29.7} y={y + 11.5} width={4.6} height={19} rx={2} fill="#34414c" stroke="#8499a8" strokeWidth={0.7} />
            <path d={`M31 ${y + 13} V${y + 18}`} stroke="#fafafa" strokeWidth={0.8} />
          </g>
        )}
        <Ink x={32} y={y + 35.6} size={3.2} color="#536879">{on ? "ON" : "OFF"}</Ink>
        {terms.map((cx) => <g key={cx}><Pin x={cx} y={type === "cam" ? 13 : type === "toggle" ? 24 : 18} r={1.5} /><Pin x={cx} y={type === "cam" ? 51 : type === "toggle" ? 45 : 48} r={1.5} /></g>)}
      </Housing>
    </g>
  );
}

function Joystick({ pressed }: GlyphProps) {
  return (
    <g>
      <Housing x={12} y={29} w={40} h={22} tone="dark">
        <rect x={16} y={35} width={32} height={12} rx={2} fill="#1b2f40" />
        <circle cx={32} cy={35} r={10} fill="url(#g-metal)" stroke="#536c7b" />
        <circle cx={32} cy={35} r={6.2} fill="url(#hw-rubber)" />
        <path d={`M32 34 L${pressed ? 41 : 37} ${pressed ? 16 : 18}`} stroke="url(#g-metal)" strokeWidth={3.5} strokeLinecap="round" />
        <Lens x={pressed ? 42 : 38} y={pressed ? 14 : 16} r={4.1} tint="red" active={pressed} />
        <Ink x={32} y={47.5} size={3.2} color="#d1e1ea">4 WAY CONTROL</Ink>
      </Housing>
      <Pin x={16} y={48} r={1.7} />
      <Pin x={48} y={48} r={1.7} />
    </g>
  );
}

function FootPedal({ pressed }: GlyphProps) {
  return (
    <g>
      <path d="M10 44 Q13 29 18 24 H45 Q51 28 54 44 Z" fill="url(#hw-slate)" stroke="#4a5c69" strokeWidth={1} />
      <path d={pressed ? "M15 36 Q31 27 49 36" : "M15 32 Q31 22 49 32"} fill="none" stroke="url(#hw-rubber)" strokeWidth={8} strokeLinecap="round" />
      {[20, 25, 30, 35, 40, 45].map((cx) => <path key={cx} d={`M${cx} 26 l2 5`} stroke="#8ea0ab" strokeWidth={0.85} />)}
      <Housing x={9} y={42} w={46} h={10} tone="dark">
        <Ink x={32} y={49.2} size={3.5} color="#d8e4e9">INDUSTRIAL PEDAL</Ink>
      </Housing>
      <Pin x={16} y={51} r={1.5} />
      <Pin x={48} y={51} r={1.5} />
    </g>
  );
}

function LimitSwitch({ pressed }: GlyphProps) {
  return (
    <g>
      <path d={pressed ? "M15 10 L28 22" : "M13 10 L27 24"} stroke="#9aaab7" strokeWidth={2.8} strokeLinecap="round" />
      <circle cx={13} cy={10} r={4.2} fill="url(#g-metal)" stroke="#607382" strokeWidth={1} />
      <circle cx={13} cy={10} r={1.6} fill="#7a8f9e" />
      <Housing x={16} y={22} w={32} h={28} tone="blue">
        <rect x={18} y={24} width={28} height={6} rx={1} fill="#9db8c7" />
        <Ink x={32} y={28.5} size={3.8} color="#203b50">LIMIT SWITCH</Ink>
        <path d="M21 34 H43 M21 37 H43" stroke="#5d92b5" strokeWidth={0.8} />
        <Led x={25} y={41} active={pressed} r={1.5} />
        <Ink x={40} y={44} size={3} color="#d9e8eb">NO/NC</Ink>
      </Housing>
      <Pin x={25} y={39} r={1.55} color={PHASE[0]} />
      <Pin x={39} y={39} r={1.55} color={PHASE[3]} />
    </g>
  );
}

function FloatSwitch({ pressed }: GlyphProps) {
  return (
    <g>
      <Pin x={32} y={7} r={1.7} />
      <path d="M32 9 V27" stroke="#778b9d" strokeWidth={1.7} />
      <Housing x={20} y={27} w={24} h={20} tone={pressed ? "blue" : "slate"} radius={5}>
        <path d="M22 35 Q32 29 42 35" fill="none" stroke="#cee7eb" strokeWidth={1.5} opacity={0.7} />
        <Ink x={32} y={42} size={3.7} color="#f2f6ef">FLOAT SW</Ink>
      </Housing>
      <circle cx={32} cy={24} r={4.2} fill={pressed ? "url(#hw-red)" : "url(#hw-amber)"} stroke="#5c7080" />
      <path d="M32 47 V52" stroke="#5b7080" strokeWidth={1.7} />
      <Pin x={32} y={53} r={1.7} />
    </g>
  );
}

function PressureSwitch({ temp, on }: { temp?: boolean; on?: boolean }) {
  return (
    <g>
      <MeterFace x={32} y={23} r={11} active={on} label={temp ? "C" : "bar"} />
      <Housing x={18} y={35} w={28} h={18} tone={temp ? "red" : "blue"}>
        <rect x={21} y={38} width={22} height={7} rx={1} fill="#dce5e8" />
        <Ink x={32} y={43} size={3.9}>{temp ? "THERMOSTAT" : "PRESSURE"}</Ink>
        <Pin x={25} y={42} r={1.5} />
        <Pin x={39} y={42} r={1.5} />
      </Housing>
    </g>
  );
}

function PhotoSensor({ on, active }: GlyphProps) {
  return (
    <g>
      <Housing x={19} y={15} w={27} h={36} tone="blue">
        <rect x={21.5} y={19} width={22} height={15} rx={2} fill="#101e2a" stroke="#82a3b7" />
        <Lens x={32} y={26.5} r={5} tint="amber" active={active && on} />
        <Ink x={32} y={41} size={4.1} color="#f4f7fa">PHOTO EYE</Ink>
        <Led x={39} y={46} active={on && active} />
        <Pin x={27} y={42} r={1.55} />
        <Pin x={39} y={42} r={1.55} />
      </Housing>
    </g>
  );
}

function ProxSensor({ capacitive, on }: { capacitive?: boolean; on?: boolean }) {
  return (
    <g>
      <Housing x={17} y={19} w={26} h={27} tone={capacitive ? "amber" : "blue"}>
        <circle cx={31} cy={27} r={7} fill="url(#hw-rubber)" stroke="#a1bec6" strokeWidth={1.1} />
        <circle cx={31} cy={27} r={4.5} fill={capacitive ? "#b99477" : "#8ab7c9"} stroke="#283f50" strokeWidth={0.75} />
        <circle cx={31} cy={27} r={2.3} fill={on ? "#f3d59a" : "#4b6d7e"} />
        <Ink x={30} y={40} size={3.8} color="#f6fbfa">{capacitive ? "CAPACITIVE" : "INDUCTIVE"}</Ink>
        <Led x={39} y={42.7} active={on} r={1.1} />
      </Housing>
      <Pin x={24} y={47} r={1.55} />
      <Pin x={36} y={47} r={1.55} />
    </g>
  );
}

function ThroughBeam({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={7} y={19} w={16} h={27} tone="blue">
        <circle cx={15} cy={28} r={4.1} fill="url(#hw-rubber)" stroke="#b0cad6" />
        <Lens x={15} y={28} r={2.2} tint="red" active={active} />
        <Ink x={15} y={39} color="#fafafa" size={3.2}>TX</Ink>
      </Housing>
      <Housing x={41} y={19} w={16} h={27} tone="slate">
        <circle cx={49} cy={28} r={4.1} fill="url(#hw-rubber)" stroke="#b0cad6" />
        <Lens x={49} y={28} r={2.2} tint="red" active={active} />
        <Ink x={49} y={39} color="#fafafa" size={3.2}>RX</Ink>
      </Housing>
      {active && <path d="M19 28 H45" stroke="#f65b54" strokeWidth={1.1} strokeDasharray="2 2" className="ep-glow" />}
      <Pin x={15} y={50} r={1.45} />
      <Pin x={49} y={50} r={1.45} />
    </g>
  );
}

function Encoder({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={16} y={14} w={34} h={33} tone="slate">
        <rect x={19} y={17} width={28} height={24} rx={2} fill="#334858" />
        <circle cx={33} cy={29} r={10} fill="url(#g-metal)" stroke="#526879" />
        <g className={active ? "ep-rotor" : undefined} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d="M33 20 V23" transform={`rotate(${i * 45} 33 29)`} stroke="#29435b" strokeWidth={1.3} />)}
        </g>
        <circle cx={33} cy={29} r={2} fill="#e2e9e9" />
        <Ink x={33} y={45.2} size={3.5} color="#eef3f6">1024 PPR</Ink>
      </Housing>
      <Pin x={29} y={54} r={1.5} />
      <Pin x={35} y={54} r={1.5} />
    </g>
  );
}

function TemperatureProbe({ rtd }: { rtd?: boolean }) {
  return (
    <g>
      <Housing x={20} y={14} w={24} h={13} tone={rtd ? "blue" : "slate"} radius={2}>
        <Ink x={32} y={22.8} size={4.8} color="#eef9f6">{rtd ? "PT100" : "TYPE K"}</Ink>
      </Housing>
      <path d="M27 27 V46 M37 27 V46" stroke="#6d7e8c" strokeWidth={2.2} />
      <path d="M27 46 Q32 54 37 46" fill="url(#g-metal)" stroke="#718998" strokeWidth={1.2} />
      <path d="M32 28 V49" stroke={rtd ? "#519aca" : "#d59654"} strokeWidth={1.3} />
      <Pin x={24} y={13} copper r={1.7} />
      <Pin x={40} y={13} copper r={1.7} />
    </g>
  );
}

function PressureTransmitter({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={16} y={16} w={32} h={28} tone="slate">
        <Display x={20} y={20} w={24} h={11} text={active ? "4.2" : "--.-"} active={active} sub="mA" />
        <Ink x={32} y={38.5} size={4}>PRESSURE TX</Ink>
      </Housing>
      <path d="M24 44 V48 H40 V44" stroke="#718593" strokeWidth={2} fill="none" />
      <Pin x={27} y={50} r={1.55} />
      <Pin x={37} y={50} r={1.55} />
      <path d="M32 13 V16" stroke="#647788" strokeWidth={3} />
    </g>
  );
}

function FlowSensor({ pressed }: GlyphProps) {
  return (
    <g>
      <Pin x={32} y={9} r={1.6} />
      <Housing x={23} y={13} w={18} h={15} tone="blue">
        <Led x={32} y={19.5} active={pressed} color="#f1b85b" />
      </Housing>
      <path d="M32 28 V34" stroke="#687b89" strokeWidth={1.7} />
      <path d="M8 34 H56 V43 H8 Z" fill="url(#g-metal)" stroke="#526879" strokeWidth={1} />
      <path d="M12 38 H49 M43 35 L49 38 L43 41" fill="none" stroke="#39516a" strokeWidth={1.1} />
      <Pin x={32} y={38} r={1.5} />
    </g>
  );
}

function SmokeDetector({ on }: GlyphProps) {
  return (
    <g>
      <circle cx={32} cy={28} r={20} fill="url(#g-metal)" stroke="#78909b" strokeWidth={1.1} />
      <circle cx={32} cy={28} r={16} fill="url(#hw-ivory)" stroke="#a5b5be" strokeWidth={0.8} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d="M32 11 V16" transform={`rotate(${i * 45} 32 28)`} stroke="#65798a" strokeWidth={1.7} strokeLinecap="round" />)}
      <circle cx={32} cy={28} r={7.8} fill="#c7d3d9" stroke="#8c9eaa" strokeWidth={0.8} />
      <Led x={32} y={28} active={on} color="#ee5853" r={2.2} />
      <Ink x={32} y={46} size={4.1} color="#455b69">SMOKE</Ink>
      <Pin x={29} y={53} r={1.4} />
      <Pin x={35} y={53} r={1.4} />
    </g>
  );
}

function ReedSwitch({ on }: GlyphProps) {
  return (
    <g>
      <Housing x={12} y={24} w={40} h={16} tone="ivory" radius={6}>
        <path d="M15 30 H25 L31 27 M33 34 L39 31 H49" stroke={on ? "#288c60" : "#a75652"} strokeWidth={1.35} fill="none" />
        <Ink x={32} y={39} size={3.3}>MAGNETIC CONTACT</Ink>
      </Housing>
      <rect x={41} y={13} width={13} height={7} rx={1.2} fill="url(#hw-red)" stroke="#8f5058" strokeWidth={0.8} />
      <Pin x={10} y={31} r={1.6} />
      <Pin x={54} y={31} r={1.6} />
    </g>
  );
}

function PirSensor({ on }: GlyphProps) {
  return (
    <g>
      <Housing x={14} y={13} w={36} h={37} tone="ivory">
        <path d="M18 30 Q17 16 32 16 Q47 16 46 30 Z" fill="#f2f4eb" stroke="#a1b0ba" strokeWidth={0.8} />
        {[23, 27, 31, 35].map((y) => <path key={y} d={`M20 ${y} Q32 ${y - 4} 44 ${y}`} fill="none" stroke="#c7d1d0" strokeWidth={0.65} />)}
        <circle cx={32} cy={29} r={3.4} fill="url(#hw-glass)" stroke="#9daeb6" />
        <Ink x={32} y={41.5} size={4.5}>PIR MOTION</Ink>
        <Led x={32} y={46} active={on} color="#e85c5a" />
        <Pin x={28} y={49} r={1.4} />
        <Pin x={36} y={49} r={1.4} />
      </Housing>
    </g>
  );
}

function SignalLamp({ tint, active }: { tint: Tint; active?: boolean }) {
  return (
    <g>
      <Housing x={16} y={11} w={32} h={43} tone="slate" radius={6}>
        <circle cx={32} cy={29} r={16} fill="#718696" stroke="#d0e0e7" strokeWidth={1} />
        <Lens x={32} y={29} r={12} tint={tint} active={active} />
        <rect x={25} y={44.5} width={14} height={6.4} rx={1.1} fill="url(#hw-dark)" />
        <Ink x={32} y={48.9} size={3.2} color="#ddebf0">LAMP</Ink>
      </Housing>
      <Pin x={28} y={51.5} r={1.5} />
      <Pin x={36} y={51.5} r={1.5} />
    </g>
  );
}

function Buzzer({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={16} y={11} w={32} h={43} tone="dark" radius={6}>
        <circle cx={32} cy={29} r={14.5} fill="#0e1b27" stroke="#a6b3b9" strokeWidth={1.6} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d="M32 17 V23" transform={`rotate(${i * 45} 32 29)`} stroke="#6a7d86" strokeWidth={2.1} strokeLinecap="round" />)}
        <circle cx={32} cy={29} r={5} fill="#182734" stroke="#4f6470" />
        <Ink x={32} y={47.3} size={3.6} color="#e3ebec">BUZZER</Ink>
        {active && [0, 1].map((i) => <path key={i} d={`M${49 + i * 3} 22 Q${55 + i * 3} 29 ${49 + i * 3} 36`} stroke="#6dc2f5" strokeWidth={1} fill="none" className="ep-glow" />)}
      </Housing>
      <Pin x={28} y={51.5} r={1.5} />
      <Pin x={36} y={51.5} r={1.5} />
    </g>
  );
}

function ThreePhaseIndicator({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={10} y={14} w={44} h={38} tone="dark">
        <Ink x={32} y={21.4} size={5.3} color="#dce9ee">3 PHASE</Ink>
        {["red", "amber", "blue"].map((tint, i) => (
          <g key={tint}>
            <Lens x={19 + 13 * i} y={33} r={4.7} tint={tint as Tint} active={active} />
            <Ink x={19 + 13 * i} y={46} size={3.1} color="#e1ebf2">L{i + 1}</Ink>
          </g>
        ))}
      </Housing>
      <Pin x={28} y={50} r={1.5} />
      <Pin x={36} y={50} r={1.5} />
    </g>
  );
}

function DigitalMeter({ type, active }: { type: "v" | "v3" | "a" | "kwh" | "pf" | "hours"; active?: boolean }) {
  const v3 = type === "v3";
  const kwh = type === "kwh";
  const label = { v: "VOLTMETER", v3: "3P VOLT", a: "AMMETER", kwh: "ENERGY METER", pf: "POWER FACTOR", hours: "HOUR METER" }[type];
  const reading = { v: "230.0", v3: "400.0", a: "12.5", kwh: "00482.6", pf: "0.96", hours: "1204.8" }[type];
  return (
    <g>
      <Housing x={13} y={10} w={38} h={44} tone={kwh ? "ivory" : "dark"}>
        <rect x={16} y={14} width={32} height={6} rx={0.8} fill={kwh ? "#d2dce1" : "#3e5565"} />
        <Ink x={32} y={18.5} size={4.1} color={kwh ? "#344e61" : "#e9f2f5"}>{label}</Ink>
        <Display x={16} y={23} w={32} h={15} text={reading} active={active} color={kwh ? "#98d2b4" : "#8df0ca"} sub={type === "a" ? "A" : type === "hours" ? "h" : type === "pf" ? "cos" : kwh ? "kWh" : "V"} />
        <path d="M17 42 H47" stroke={kwh ? "#6da78b" : "#65869a"} strokeWidth={1.15} />
        {[22, 32, 42].map((cx, i) => <Led key={cx} x={cx} y={46} active={active} color={PHASE[i]} r={1.2} />)}
        {(v3 ? [24, 32, 40] : kwh ? [22, 42] : type === "v" || type === "a" ? [24, 40] : []).map((cx) => <Pin key={cx} x={cx} y={kwh ? 12 : 10} r={1.45} copper />)}
        {(kwh ? [22, 42] : type === "v" || v3 || type === "a" ? [26, 38] : [24, 40]).map((cx) => <Pin key={cx} x={cx} y={kwh ? 48 : type === "pf" || type === "hours" ? 50 : 51} r={1.45} copper />)}
      </Housing>
    </g>
  );
}

function AnalogMeter({ label, active }: { label: "A" | "V"; active?: boolean }) {
  return (
    <g>
      <Housing x={13} y={11} w={38} h={43} tone="ivory">
        <MeterFace x={32} y={31} r={14} active={active} label={label} />
        <rect x={19} y={47} width={26} height={4} rx={1} fill="#d6e1e5" />
        <Pin x={22} y={51} r={1.45} />
        <Pin x={42} y={51} r={1.45} />
      </Housing>
    </g>
  );
}

function CurrentTransformer() {
  return (
    <g>
      <Housing x={10} y={13} w={44} h={38} tone="slate">
        <circle cx={32} cy={32} r={14} fill="url(#hw-copper)" stroke="#633e2f" strokeWidth={1.2} />
        {[18, 21, 24, 27, 30, 33, 36, 39, 42, 45].map((x) => <path key={x} d={`M${x} 22 V42`} stroke="#a66b40" opacity={0.38} strokeWidth={0.6} />)}
        <circle cx={32} cy={32} r={8} fill="#13212d" stroke="#c99d68" strokeWidth={1.4} />
        <Ink x={32} y={49} size={3.7} color="#e7eff1">CT 100/5</Ink>
      </Housing>
      {[25.7, 38.3].map((cx) => <Pin key={cx} x={cx} y={12} r={1.5} />)}
      {[27, 37].map((cx) => <Pin key={cx} x={cx} y={52} r={1.5} />)}
    </g>
  );
}

function StackTower({ active }: GlyphProps) {
  return (
    <g>
      <path d="M32 43 V52" stroke="url(#g-metal)" strokeWidth={3.4} />
      <Housing x={20} y={8} w={24} h={37} tone="dark" radius={4}>
        {(["red", "amber", "green"] as const).map((tint, i) => (
          <g key={tint}>
            <rect x={23} y={11 + i * 11} width={18} height={10} rx={2} fill={`url(#hw-${tint})`} stroke="#394958" strokeWidth={0.8} />
            <path d={`M25 ${13 + i * 11} H37`} stroke="#fff" strokeWidth={0.8} opacity={0.5} />
            <Led x={39} y={17 + i * 11} color={PHASE[i]} active={active} r={1.2} />
          </g>
        ))}
      </Housing>
      <Pin x={29} y={52} r={1.45} />
      <Pin x={35} y={52} r={1.45} />
    </g>
  );
}

function WarningBeacon({ active }: GlyphProps) {
  return (
    <g>
      <path d="M18 38 Q19 16 32 15 Q45 16 46 38 Z" fill="url(#hw-amber)" stroke="#764729" strokeWidth={1.2} />
      {[21, 26, 31, 36].map((y) => <path key={y} d={`M${20 + Math.abs(29 - y) * 0.15} ${y} Q32 ${y - 3} ${44 - Math.abs(29 - y) * 0.15} ${y}`} fill="none" stroke="#fff" opacity={0.3} strokeWidth={0.75} />)}
      {active && <ellipse cx={32} cy={28} rx={15} ry={13} fill="#f5b755" opacity={0.24} className="ep-glow" />}
      <Housing x={17} y={39} w={30} h={12} tone="dark">
        <Ink x={32} y={47} size={4} color="#dee5e9">BEACON</Ink>
      </Housing>
      <Pin x={28} y={51} r={1.45} />
      <Pin x={36} y={51} r={1.45} />
    </g>
  );
}

function SirenHorn({ active }: GlyphProps) {
  return (
    <g>
      <Housing x={9} y={24} w={15} h={18} tone="dark" />
      <path d="M23 25 L51 14 V50 L23 40 Z" fill="url(#hw-slate)" stroke="#536574" strokeWidth={1.2} />
      <path d="M27 28 L47 20 V44 L27 37 Z" fill="#233644" stroke="#a3b3bb" strokeWidth={0.8} />
      <path d="M28 32 L46 26 M28 36 L46 39" stroke="#7996a5" strokeWidth={0.8} />
      <Ink x={38} y={35} size={3.7} color="#dbe8ee">HORN</Ink>
      {active && [0, 1].map((i) => <path key={i} d={`M${51 + i * 3} 20 Q${57 + i * 3} 32 ${51 + i * 3} 44`} stroke="#8ad7f1" strokeWidth={1.1} fill="none" className="ep-glow" />)}
      <Pin x={18} y={47} r={1.5} />
      <Pin x={26} y={47} r={1.5} />
    </g>
  );
}

function ElectricBell({ active }: GlyphProps) {
  return (
    <g>
      <path d="M19 38 Q18 18 32 17 Q46 18 45 38 Z" fill="url(#hw-slate)" stroke="#45596b" strokeWidth={1.3} />
      <path d="M23 36 Q23 22 32 21" stroke="#fff" strokeWidth={1.3} fill="none" opacity={0.36} />
      <circle cx={32} cy={39} r={3.6} fill="url(#g-metal)" stroke="#617487" />
      <path d="M32 42.5 V48" stroke="#63798b" strokeWidth={1.7} />
      <Housing x={23} y={48} w={18} h={5} tone="dark" />
      {active && <path d="M12 28 Q8 34 13 40 M52 28 Q56 34 51 40" fill="none" stroke="#bceafb" strokeWidth={1.2} className="ep-glow" />}
      <Pin x={24} y={52} r={1.5} />
      <Pin x={40} y={52} r={1.5} />
    </g>
  );
}

registerGlyphs({
  "pb-no": (p) => <PushStation tint="green" type="NO" pressed={p.pressed} />,
  "pb-nc": (p) => <PushStation tint="red" type="NC" pressed={p.pressed} />,
  "pb-dual": (p) => <PushStation tint="blue" type="NO+NC" pressed={p.pressed} />,
  "pb-green-light": (p) => <PushStation tint="green" type="NO" lit pressed={p.pressed} />,
  "pb-red-light": (p) => <PushStation tint="red" type="NC" lit pressed={p.pressed} />,
  "double-pb": (p) => <DoubleStation pressed={p.pressed} />,
  estop: (p) => <EmergencyStop pressed={p.pressed} />,
  "estop-key": (p) => <EmergencyStop keyed pressed={p.pressed} />,
  "sel-onoff": (p) => <RotarySwitch type="onoff" on={p.on} />,
  selector: (p) => <RotarySwitch type="selector" on={p.on} />,
  "sel-102": (p) => <RotarySwitch type="three" on={p.on} />,
  key2: (p) => <RotarySwitch type="key" on={p.on} />,
  cam: (p) => <RotarySwitch type="cam" on={p.on} />,
  toggle: (p) => <RotarySwitch type="toggle" on={p.on} />,
  joystick: (p) => <Joystick pressed={p.pressed} />,
  foot: (p) => <FootPedal pressed={p.pressed} />,
  limit: (p) => <LimitSwitch pressed={p.pressed} />,
  float: (p) => <FloatSwitch pressed={p.pressed} />,
  pressure: (p) => <PressureSwitch on={p.on} />,
  temp: (p) => <PressureSwitch temp on={p.on} />,
  photo: (p) => <PhotoSensor on={p.on} active={p.active} />,
  "prox-ind": (p) => <ProxSensor on={p.on} />,
  "prox-cap": (p) => <ProxSensor capacitive on={p.on} />,
  "photo-beam": (p) => <ThroughBeam active={p.active && p.on} />,
  encoder: (p) => <Encoder active={p.active && p.on} />,
  thermocouple: () => <TemperatureProbe />,
  pt100: () => <TemperatureProbe rtd />,
  "pressure-tx": (p) => <PressureTransmitter active={p.active} />,
  flow: (p) => <FlowSensor pressed={p.pressed} />,
  smoke: (p) => <SmokeDetector on={p.on} />,
  reed: (p) => <ReedSwitch on={p.on} />,
  pir: (p) => <PirSensor on={p.on} />,
  "light-green": (p) => <SignalLamp tint="green" active={p.active} />,
  "light-red": (p) => <SignalLamp tint="red" active={p.active} />,
  "light-blue": (p) => <SignalLamp tint="blue" active={p.active} />,
  "light-orange": (p) => <SignalLamp tint="amber" active={p.active} />,
  "light-yellow": (p) => <SignalLamp tint="yellow" active={p.active} />,
  buzzer: (p) => <Buzzer active={p.active} />,
  "ind-3ph": (p) => <ThreePhaseIndicator active={p.active} />,
  voltmeter: (p) => <DigitalMeter type="v" active={p.active} />,
  voltmeter3: (p) => <DigitalMeter type="v3" active={p.active} />,
  ammeter: (p) => <DigitalMeter type="a" active={p.active} />,
  ct: () => <CurrentTransformer />,
  tower: (p) => <StackTower active={p.active} />,
  beacon: (p) => <WarningBeacon active={p.active} />,
  horn: (p) => <SirenHorn active={p.active} />,
  bell: (p) => <ElectricBell active={p.active} />,
  kwh: (p) => <DigitalMeter type="kwh" active={p.active} />,
  "pf-meter": (p) => <DigitalMeter type="pf" active={p.active} />,
  "hour-meter": (p) => <DigitalMeter type="hours" active={p.active} />,
  "analog-a": (p) => <AnalogMeter label="A" active={p.active} />,
  "analog-v": (p) => <AnalogMeter label="V" active={p.active} />,
});