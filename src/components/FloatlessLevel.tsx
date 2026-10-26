import { registerGlyphs, SPlus, type GlyphProps } from "./Icons";
import { FLOATLESS_PORTS, WATER_STAGES } from "../data/floatless";

const font = "Arial, Helvetica, sans-serif";

function FloatlessLevel({ active, supplyActive, levelStage = 0, running }: GlyphProps) {
  const stage = Math.min(3, Math.max(0, levelStage));
  const waterTop = [45, 42.5, 39, 42.5][stage];
  const topPorts = FLOATLESS_PORTS.filter((port) => port.side === "top");
  const bottomPorts = FLOATLESS_PORTS.filter((port) => port.side === "bottom");

  return (
    <g>
      <defs>
        <linearGradient id="fl-housing" x1="0" y1="0" x2="1" y2="0.35">
          <stop stopColor="#c2bfac" />
          <stop offset="0.12" stopColor="#f8f6e9" />
          <stop offset="0.52" stopColor="#f1efe0" />
          <stop offset="0.91" stopColor="#d8d4c3" />
          <stop offset="1" stopColor="#aba897" />
        </linearGradient>
        <linearGradient id="fl-nameplate" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#edf0ec" />
        </linearGradient>
        <linearGradient id="fl-terminal-block" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#3a4042" />
          <stop offset="0.45" stopColor="#22282a" />
          <stop offset="1" stopColor="#101618" />
        </linearGradient>
        <linearGradient id="fl-water" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#a7e8ff" />
          <stop offset="1" stopColor="#147eaf" />
        </linearGradient>
      </defs>

      {/* Straight front elevation. The eight sockets match FLOATLESS_PORTS exactly. */}
      <rect x="4.6" y="3.7" width="55" height="58.6" rx="4.2" fill="#050d12" opacity="0.45" />
      <rect x="3.6" y="2.8" width="56.8" height="58.6" rx="3.7" fill="url(#fl-terminal-block)" stroke="#4c5455" strokeWidth="0.8" />
      <path d="M5.3 4.4 H58.7" stroke="#768184" strokeWidth="0.7" opacity="0.65" />
      <rect x="43" y="1.2" width="11" height="3.2" rx="0.8" fill="url(#hw-amber)" stroke="#a97124" strokeWidth="0.6" />

      {topPorts.map((port) => (
        <g key={port.id}>
          <rect x={port.x - 4.4} y="4.3" width="8.8" height="9.7" rx="1.6" fill="#0d1418" stroke="#555f60" strokeWidth="0.6" />
          <circle cx={port.x} cy={port.y} r="3.35" fill="#555350" stroke="#080d10" strokeWidth="0.55" />
          <SPlus x={port.x} y={port.y} r={2.55} copper />
        </g>
      ))}

      {/* A rectangular moulded ivory housing replaces the skewed perspective case. */}
      <rect x="6" y="14.6" width="52" height="35.2" rx="3.1" fill="url(#fl-housing)" stroke="#aaa99b" strokeWidth="0.8" />
      <path d="M8.2 15.5 H55.2" stroke="#fff" strokeWidth="0.85" opacity="0.85" />
      <path d="M56.5 17 V47" stroke="#827f71" strokeWidth="0.85" opacity="0.48" />
      <rect x="8.4" y="16.7" width="47.2" height="30.9" rx="1.6" fill="url(#fl-nameplate)" stroke="#c4c6bc" strokeWidth="0.5" />

      {topPorts.map((port) => (
        <text key={`label-${port.id}`} x={port.x} y="20.5" fill="#30373a" textAnchor="middle" fontSize="3.7" fontWeight="800" fontFamily={font}>
          {port.id}
        </text>
      ))}

      <path d="M10 21.7 H54" stroke="#c7ceca" strokeWidth="0.6" />
      <text x="32" y="27.3" fill="#263038" textAnchor="middle" fontSize="6.1" fontWeight="800" fontFamily={font}>C61F-GP</text>
      <text x="32" y="31.2" fill="#38434a" textAnchor="middle" fontSize="3.45" fontWeight="800" fontFamily={font}>FLOATLESS LEVEL SWITCH</text>

      <circle cx="13" cy="35.2" r="2.05" fill="#252f33" stroke="#87918b" strokeWidth="0.5" />
      <circle cx="13" cy="35.2" r="1.28" fill={supplyActive ? "#54db96" : "#647677"} className={supplyActive ? "ep-glow" : undefined} />
      <text x="17" y="36.3" fill="#444f53" fontSize="3.1" fontWeight="800" fontFamily={font}>POWER</text>
      <circle cx="31" cy="35.2" r="2.05" fill="#252f33" stroke="#87918b" strokeWidth="0.5" />
      <circle cx="31" cy="35.2" r="1.28" fill={active ? "#ffc667" : "#647677"} className={active ? "ep-glow" : undefined} />
      <text x="35" y="36.3" fill="#444f53" fontSize="3.1" fontWeight="800" fontFamily={font}>OUT</text>

      <rect x="9.4" y="38.4" width="34.4" height="7.6" rx="0.9" fill="#252b2f" />
      <text x="26.6" y="41.5" fill="#f4f6f3" textAnchor="middle" fontSize="3.45" fontWeight="700" fontFamily={font}>SUPPLY AC 110V</text>
      <text x="26.6" y="44.7" fill="#dbe1de" textAnchor="middle" fontSize="2.85" fontWeight="700" fontFamily={font}>PROBE 8V / CONTACT 5A</text>

      <text x="50" y="37.3" fill="#4b626c" textAnchor="middle" fontSize="2.65" fontWeight="800" fontFamily={font}>LEVEL</text>
      <rect x="46.2" y="38.2" width="7.6" height="8" rx="1.2" fill="#1b3545" stroke="#7896a1" strokeWidth="0.55" />
      <rect x="47.1" y={waterTop} width="5.8" height={46.2 - waterTop} rx="0.55" fill="url(#fl-water)" opacity={supplyActive ? 1 : 0.56} style={{ transition: "y 400ms ease, height 400ms ease" }} />
      <text key={stage} x="50" y="43.1" fill="#f5faff" textAnchor="middle" fontSize="2.5" fontWeight="800" fontFamily={font} className={running ? "ep-water-state" : undefined}>
        {WATER_STAGES[stage]}
      </text>

      {bottomPorts.map((port) => (
        <text key={`label-${port.id}`} x={port.x} y="49" fill="#263238" textAnchor="middle" fontSize="3.65" fontWeight="800" fontFamily={font}>
          {port.id}
        </text>
      ))}

      {bottomPorts.map((port) => (
        <g key={port.id}>
          <rect x={port.x - 4.4} y="51.1" width="8.8" height="8.7" rx="1.6" fill="#0d1418" stroke="#555f60" strokeWidth="0.6" />
          <circle cx={port.x} cy={port.y} r="3.25" fill="#555350" stroke="#080d10" strokeWidth="0.55" />
          <SPlus x={port.x} y={port.y} r={2.45} copper />
        </g>
      ))}
      <path d="M6 60.7 H58" stroke="#6a7476" strokeWidth="0.55" />
    </g>
  );
}

function LevelProbe({ label, active }: GlyphProps) {
  const name = label?.includes("HIGH") ? "E1 HIGH" : label?.includes("LOW") ? "E2 LOW" : label?.includes("COM") ? "E3 COM" : "ELECTRODE";
  return (
    <g>
      <defs>
        <linearGradient id="fl-probe" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#6c7b85" />
          <stop offset="0.35" stopColor="#fcffff" />
          <stop offset="1" stopColor="#8295a0" />
        </linearGradient>
      </defs>
      <path d="M30 15 V52" stroke="url(#fl-probe)" strokeWidth="4" strokeLinecap="round" />
      <path d="M31 15 V48" stroke="#fff" strokeWidth="0.6" opacity="0.7" />
      <rect x="22" y="10" width="18" height="17" rx="2" fill="url(#hw-ivory)" stroke="#879ba3" strokeWidth="0.85" />
      <path d="M24 23 H38" stroke="#86a5ae" strokeWidth="0.7" />
      <text x="31" y="34" fill="#d9e4e9" fontFamily={font} fontSize="4" textAnchor="middle" fontWeight="700">{name}</text>
      {active && (
        <g className="ep-sensor-wave">
          <path d="M21 43 Q26 41 31 43 T41 43" fill="none" stroke="#8edbf7" strokeWidth="1.2" strokeDasharray="3 2" />
          <ellipse cx="32" cy="51" rx="5" ry="2" fill="#79dafa" opacity="0.65" />
        </g>
      )}
      <text x="32" y="40" fill={active ? "#a4edfd" : "#9badb6"} fontFamily={font} fontSize="3.4" textAnchor="middle">{active ? "WET" : "DRY"}</text>
    </g>
  );
}

registerGlyphs({
  "floatless-level": (p) => <FloatlessLevel {...p} />,
  "level-probe": (p) => <LevelProbe label={p.label} active={p.active} />,
});