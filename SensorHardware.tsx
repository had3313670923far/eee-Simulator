import { registerGlyphs, type GlyphProps } from "./Icons";
import { CONTACT_SENSOR_IDS } from "../data/sensorContacts";
import { Display, Housing, Ink, Led, Lens, MeterFace, Pin, type Tone } from "./hardware/Primitives";

type SensorId = (typeof CONTACT_SENSOR_IDS)[number];

const appearance: Record<SensorId, { title: string; tone: Tone }> = {
  limit: { title: "LIMIT SWITCH", tone: "blue" },
  float: { title: "FLOAT SWITCH", tone: "blue" },
  pressure: { title: "PRESSURE", tone: "slate" },
  temp: { title: "THERMOSTAT", tone: "ivory" },
  photo: { title: "PHOTO EYE", tone: "blue" },
  "prox-ind": { title: "INDUCTIVE M18", tone: "blue" },
  "prox-cap": { title: "CAPACITIVE M18", tone: "amber" },
  "photo-beam": { title: "THRU-BEAM", tone: "slate" },
  encoder: { title: "ENCODER", tone: "slate" },
  thermocouple: { title: "TYPE K / RELAY", tone: "ivory" },
  pt100: { title: "PT100 / RELAY", tone: "ivory" },
  "pressure-tx": { title: "PRESSURE TX", tone: "slate" },
  flow: { title: "FLOW SWITCH", tone: "blue" },
  smoke: { title: "SMOKE DETECTOR", tone: "ivory" },
  reed: { title: "REED CONTACT", tone: "ivory" },
  pir: { title: "PIR MOTION", tone: "ivory" },
};

function ChangeoverContacts({ detected }: { detected: boolean }) {
  return (
    <g>
      <Housing x={9.5} y={44} w={45} h={17} tone="dark" radius={2}>
        <path d="M12 46 H52" stroke="#d6e4ea" strokeWidth={0.6} opacity={0.55} />
        <rect x={14.5} y={47} width={35} height={1.3} rx={0.5} fill={detected ? "#40bd82" : "#91abb8"} />
        {[{ x: 18, name: "COM" }, { x: 32, name: "NC" }, { x: 46, name: "NO" }].map(({ x, name }) => (
          <g key={name}>
            <Ink x={x} y={52} size={3.25} color={name === (detected ? "NO" : "NC") ? "#a9f2d0" : "#d9e7ec"}>
              {name}
            </Ink>
            <Pin x={x} y={58} copper dark r={1.9} />
          </g>
        ))}
      </Housing>
    </g>
  );
}

function SensorFace({ type, detected }: { type: SensorId; detected: boolean }) {
  switch (type) {
    case "limit":
      return (
        <g>
          <path d={detected ? "M17 20 L22 12" : "M17 20 L11 9"} stroke="#a5b2b8" strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={detected ? 22 : 11} cy={detected ? 12 : 9} r={4.3} fill="url(#g-metal)" stroke="#5c7384" />
          <circle cx={detected ? 22 : 11} cy={detected ? 12 : 9} r={1.4} fill="#63798a" />
          <rect x={17} y={21} width={30} height={18} rx={2} fill="#253b52" stroke="#90aabb" />
          <path d="M22 28 H41 M22 32 H39" stroke="#7794aa" strokeWidth={0.8} />
          <circle cx={26} cy={35} r={1.8} fill={detected ? "#50e29b" : "#8c9ca7"} className={detected ? "ep-glow" : undefined} />
          <Ink x={38} y={38} size={3} color="#e6f1f5">ROLLER</Ink>
        </g>
      );
    case "float":
      return (
        <g>
          <path d="M32 16 V35" stroke="#a3b7c3" strokeWidth={1.6} />
          <circle cx={32} cy={19} r={2} fill="url(#g-metal)" />
          <g className={detected ? "ep-sensor-bob" : undefined}>
            <ellipse cx={32} cy={detected ? 29 : 36} rx={12} ry={7.5} fill={detected ? "url(#hw-blue)" : "url(#hw-slate)"} stroke="#7ca1b5" strokeWidth={0.9} />
            <path d={`M23 ${detected ? 27 : 34} Q32 ${detected ? 23 : 30} 41 ${detected ? 27 : 34}`} stroke="#eaf7f8" strokeWidth={0.9} fill="none" opacity={0.75} />
          </g>
          {detected && <path d="M15 40 Q21 38 27 40 T39 40 T51 40" fill="none" stroke="#98dffa" strokeWidth={1.2} className="ep-sensor-wave" />}
        </g>
      );
    case "pressure":
    case "temp":
      return (
        <g>
          <MeterFace x={32} y={29} r={10.5} active={detected} label={type === "temp" ? "C" : "bar"} />
          <path d="M32 41 V45" stroke="#7c909e" strokeWidth={1.7} />
          {detected && <circle cx={32} cy={29} r={13.5} fill="none" stroke={type === "temp" ? "#fa8264" : "#7ac9e8"} strokeWidth={0.75} className="ep-glow" />}
        </g>
      );
    case "photo":
    case "prox-ind":
    case "prox-cap": {
      const barrel = type !== "photo";
      return (
        <g>
          {barrel && <rect x={14} y={23} width={35} height={16} rx={5} fill="url(#g-metal)" stroke="#687f8e" />}
          {barrel && [18, 22, 26, 30, 34, 38].map((x) => <path key={x} d={`M${x} 23 V39`} stroke="#657987" strokeWidth={0.6} />)}
          <circle cx={barrel ? 42 : 32} cy={30} r={9.5} fill="url(#hw-rubber)" stroke="#a9c1c9" strokeWidth={1} />
          <Lens x={barrel ? 42 : 32} y={30} r={5.1} tint={type === "prox-cap" ? "amber" : type === "prox-ind" ? "blue" : "red"} active={detected} />
          {detected && <path d={`M${barrel ? 52 : 42} 28 H58 M${barrel ? 52 : 42} 32 H58`} stroke="#c6f0fa" strokeDasharray="3 2" strokeWidth={0.9} className="ep-sensor-wave" />}
          <Ink x={32} y={41} size={3.2} color={type === "prox-cap" ? "#e4efec" : "#d7e7f2"}>{barrel ? "M18  PROXIMITY" : "OPTICAL SENSOR"}</Ink>
        </g>
      );
    }
    case "photo-beam":
      return (
        <g>
          {[17, 47].map((x, i) => (
            <g key={x}>
              <rect x={x - 7} y={22} width={14} height={17} rx={2} fill="url(#hw-dark)" stroke="#8ca4b4" />
              <Lens x={x} y={29} r={3.6} tint="red" active={detected} />
              <Ink x={x} y={43} size={3} color="#e9f3f4">{i === 0 ? "TX" : "RX"}</Ink>
            </g>
          ))}
          {detected && <path d="M22 29 H42" stroke="#fa7373" strokeWidth={1.4} strokeDasharray="3 2" className="ep-sensor-wave" />}
        </g>
      );
    case "encoder":
      return (
        <g>
          <circle cx={32} cy={29} r={13.5} fill="url(#g-metal)" stroke="#516b7b" />
          <circle cx={32} cy={29} r={10.5} fill="#1e3344" />
          <g className={detected ? "ep-rotor" : undefined} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => <path key={angle} d="M32 19 V22" transform={`rotate(${angle} 32 29)`} stroke="#d1e8ef" strokeWidth={1.2} />)}
          </g>
          <circle cx={32} cy={29} r={3} fill="url(#g-metal)" />
          <Ink x={32} y={42} size={3.2} color="#e7f2f3">1024 PPR</Ink>
        </g>
      );
    case "thermocouple":
    case "pt100":
      return (
        <g>
          <rect x={23} y={18} width={18} height={8} rx={1.5} fill="url(#hw-ivory)" stroke="#758a9b" />
          <Ink x={32} y={23.5} size={3.7} color="#37546a">{type === "pt100" ? "PT100" : "TYPE K"}</Ink>
          <path d="M28 26 V40 Q32 43 36 40 V26" fill="url(#g-metal)" stroke="#8295a2" strokeWidth={1.1} />
          <path d="M32 26 V41" stroke={detected ? "#ed8b66" : "#7e9cac"} strokeWidth={1.5} className={detected ? "ep-glow" : undefined} />
          <Ink x={32} y={44} size={3} color="#f1f2e9">{detected ? "TRIP" : "SENSING"}</Ink>
        </g>
      );
    case "pressure-tx":
      return (
        <g>
          <Display x={18} y={18} w={28} h={12} text={detected ? "HIGH" : "0.0"} active={detected} sub="bar" />
          <rect x={25} y={32} width={14} height={9} rx={1} fill="url(#g-metal)" stroke="#728698" />
          <path d="M32 41 V45" stroke="#8ca0b2" strokeWidth={2} />
        </g>
      );
    case "flow":
      return (
        <g>
          <rect x={11} y={25} width={42} height={12} rx={5} fill="url(#g-metal)" stroke="#718797" />
          <circle cx={32} cy={31} r={4} fill="#253a4a" />
          <path d="M17 31 H46 M42 28 L46 31 L42 34" fill="none" stroke="#2d5367" strokeWidth={1.3} />
          {detected && <path d="M20 38 H45" stroke="#76ddf6" strokeDasharray="3 4" className="ep-sensor-wave" />}
          <Ink x={32} y={22.3} size={3.6} color="#e1f2ef">FLOW</Ink>
        </g>
      );
    case "smoke":
      return (
        <g>
          <circle cx={32} cy={29} r={15} fill="url(#hw-ivory)" stroke="#859ca9" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => <path key={angle} d="M32 16 V20" transform={`rotate(${angle} 32 29)`} stroke="#738897" strokeWidth={1.6} />)}
          <Led x={32} y={29} active={detected} color="#f06665" r={2.4} />
          {detected && <path d="M21 11 Q18 6 21 4 M32 10 Q29 5 32 3 M43 11 Q40 6 43 4" fill="none" stroke="#d7e6eb" strokeWidth={0.9} className="ep-sensor-wave" />}
        </g>
      );
    case "reed":
      return (
        <g>
          <rect x={15} y={23} width={33} height={15} rx={6} fill="url(#hw-ivory)" stroke="#91a3af" />
          <path d="M19 29 H26 L32 26 M34 34 L39 30 H46" stroke={detected ? "#46a77b" : "#b47163"} strokeWidth={1.2} fill="none" />
          <rect x={detected ? 41 : 50} y={15} width={9} height={8} rx={1} fill="url(#hw-red)" stroke="#835b5d" style={{ transition: "x 220ms ease" }} />
          <Ink x={32} y={43} size={3.2} color="#475d6d">MAGNET / REED</Ink>
        </g>
      );
    case "pir":
      return (
        <g>
          <path d="M18 33 Q18 15 32 15 Q46 15 46 33 Z" fill="url(#hw-ivory)" stroke="#adc0c8" strokeWidth={0.85} />
          {[22, 26, 30].map((y) => <path key={y} d={`M20 ${y} Q32 ${y - 4} 44 ${y}`} fill="none" stroke="#b9ced3" strokeWidth={0.65} />)}
          <circle cx={32} cy={28} r={3.3} fill="url(#hw-glass)" />
          {detected && [0, 1].map((i) => <path key={i} d={`M${17 - i * 4} 20 Q${10 - i * 4} 28 ${17 - i * 4} 36 M${47 + i * 4} 20 Q${54 + i * 4} 28 ${47 + i * 4} 36`} fill="none" stroke="#8dd9ef" strokeWidth={0.8} className="ep-sensor-wave" />)}
          <Ink x={32} y={41} size={3.6} color="#476373">MOTION</Ink>
        </g>
      );
  }
}

function SensorDevice({ type, on, running }: { type: SensorId; on?: boolean; running?: boolean }) {
  const detected = !!on;
  const { title, tone } = appearance[type];
  return (
    <g>
      <Housing x={9} y={7} w={46} h={40} tone={tone} radius={type === "smoke" || type === "pir" ? 5 : 3}>
        <rect x={11} y={9} width={42} height={5.2} rx={0.8} fill="#24465a" opacity={tone === "ivory" ? 0.78 : 0.7} />
        <Ink x={32} y={12.9} size={3.65} color="#f4f9fa">{title}</Ink>
        <g key={detected ? "detected" : "normal"} className={running ? "ep-sensor-switch" : undefined}>
          <SensorFace type={type} detected={detected} />
        </g>
        <Led x={48} y={40} active={detected} color="#45dc92" r={1.15} />
      </Housing>
      <ChangeoverContacts detected={detected} />
    </g>
  );
}

registerGlyphs(Object.fromEntries(
  CONTACT_SENSOR_IDS.map((type) => [type, (props: GlyphProps) => <SensorDevice type={type} on={props.on} running={props.running} />]),
));