import { memo, useMemo, useRef, useState } from "react";
import {
  X,
  Search,
  Zap,
  ShieldCheck,
  Magnet,
  Cpu,
  ToggleRight,
  Radar,
  Lightbulb,
  Fan,
  Cable,
  PanelTop,
  Package,
  type LucideIcon,
} from "lucide-react";
import { PartGlyph } from "./Icons";
import { ALL_PARTS, MCB_COLORS, SECTIONS, type Part, type SectionId } from "../data/catalog";

type Props = {
  onClose: () => void;
  lang: "en" | "ar";
  onLang: (l: "en" | "ar") => void;
  mcbColor: string;
  onMcbColor: (c: string) => void;
  onAdd: (part: Part, pointerType?: string) => void;
  onDragStart: (e: React.DragEvent, part: Part) => void;
  onDragEnd: () => void;
  running: boolean;
};

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  sources: Zap,
  protection: ShieldCheck,
  contactors: Magnet,
  automation: Cpu,
  buttons: ToggleRight,
  sensors: Radar,
  signaling: Lightbulb,
  loads: Fan,
  wiring: Cable,
  structure: PanelTop,
  units: Package,
};

const RELAY_PREVIEW_IDS = new Set(
  SECTIONS.find((section) => section.id === "contactors")?.parts.map((part) => part.id) ?? []
);

function SectionHead({ id, title }: { id: SectionId; title: string }) {
  const Icon = SECTION_ICONS[id];
  return (
    <div className="flex items-center gap-2 px-3 pt-4 pb-2">
      <Icon size={13} className="text-emerald-400" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">{title}</span>
    </div>
  );
}

function PartCard({
  part,
  color,
  running,
  ar,
  onAdd,
  onDragStart,
  onDragEnd,
}: {
  part: Part;
  color?: string;
  running: boolean;
  ar?: boolean;
  onAdd: (p: Part, pointerType?: string) => void;
  onDragStart: (e: React.DragEvent, p: Part) => void;
  onDragEnd: () => void;
}) {
  const pointerType = useRef("mouse");
  const relayPreview = RELAY_PREVIEW_IDS.has(part.id);

  return (
    <button
      draggable={!running}
      onDragStart={(e) => onDragStart(e, part)}
      onDragEnd={onDragEnd}
      onPointerDown={(e) => {
        pointerType.current = e.pointerType;
      }}
      onClick={() => onAdd(part, pointerType.current)}
      title={part.en}
      className={`group relative flex select-none flex-col items-center rounded-lg border border-[var(--border)] bg-[var(--card)] py-2 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-[var(--card-hover)] hover:shadow-[0_6px_18px_-8px_rgba(34,197,94,0.4)]
        ${running ? "cursor-not-allowed opacity-60" : "cursor-grab active:cursor-grabbing"}`}
    >
      <PartGlyph
        part={part.id}
        color={part.colorable ? color : undefined}
        className="pointer-events-none"
        style={
          part.size
            ? part.size.h / part.size.w < 1
              ? { width: 64, height: Math.max(15, 64 * (part.size.h / part.size.w)) }
              : { height: 64, width: 64 * (part.size.w / part.size.h) }
            : { width: relayPreview ? 66 : 60, height: relayPreview ? 66 : 60 }
        }
      />
      <span className="mt-0.5 w-full truncate px-1 text-center text-[9.5px] leading-tight text-[var(--muted)] group-hover:text-[var(--text)]">
        {ar && part.ar ? part.ar : part.en}
      </span>
    </button>
  );
}

function Sidebar(p: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_PARTS.filter(
      (x) => x.en.toLowerCase().includes(q) || (x.ar ?? "").includes(query.trim())
    );
  }, [query]);

  const protection = SECTIONS.find((s) => s.id === "protection")!;
  const mcbs = protection.parts.slice(0, 4);
  const otherProtection = protection.parts.slice(4);

  return (
    <aside
      className="ep-slide flex h-full w-[292px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--panel)] max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:shadow-2xl max-lg:shadow-black/50"
      style={{ color: "var(--text)" }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-3.5">
        <h2 className="text-[17px] font-bold text-emerald-400">Components</h2>
        <button
          onClick={p.onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text)]"
        >
          <X size={18} />
        </button>
      </div>

      {/* language */}
      <div className="flex items-center gap-3 px-4 pt-3">
        <span className="text-[12px] text-[var(--muted)]">Part names</span>
        <div className="ml-auto flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-0.5">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => p.onLang(l)}
              className={`rounded-md px-3.5 py-1 text-[12px] font-medium transition-all ${
                p.lang === l
                  ? "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {l === "en" ? "english" : "عربي"}
            </button>
          ))}
        </div>
      </div>

      {/* search */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 focus-within:border-emerald-500/50">
          <Search size={14} className="text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[var(--muted)] hover:text-[var(--text)]">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* list */}
      <div className="scroll-thin mt-1 flex-1 overflow-y-auto pb-6">
        {query.trim() ? (
          <div className="px-3 pt-3">
            <SectionHead id="units" title={`${results.length} result(s)`} />
            {results.length === 0 ? (
              <p className="px-2 py-6 text-center text-[12px] text-[var(--muted)]">
                No parts match “{query}”.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {results.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    color={p.mcbColor}
                    running={p.running}
                    ar={p.lang === "ar"}
                    onAdd={p.onAdd}
                    onDragStart={p.onDragStart}
                    onDragEnd={p.onDragEnd}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          SECTIONS.map((section) => {
            if (section.id === "protection") {
              return (
                <div key="protection">
                  <SectionHead id="protection" title={p.lang === "ar" ? section.ar : section.en} />
                  <div className="px-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                        M C B
                      </span>
                      <div className="ml-auto flex gap-1">
                        {MCB_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => p.onMcbColor(c)}
                            className={`h-6 w-6 rounded-md border transition-all ${
                              p.mcbColor === c
                                ? "scale-110 border-white shadow-[0_0_8px_rgba(255,255,255,0.35)]"
                                : "border-black/30 hover:scale-105"
                            }`}
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {mcbs.map((part) => (
                        <PartCard
                          key={part.id}
                          part={part}
                          color={p.mcbColor}
                          running={p.running}
                          ar={p.lang === "ar"}
                          onAdd={p.onAdd}
                          onDragStart={p.onDragStart}
                          onDragEnd={p.onDragEnd}
                        />
                      ))}
                    </div>
                    <div className="pt-3 pb-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      Other
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {otherProtection.map((part) => (
                        <PartCard
                          key={part.id}
                          part={part}
                          color={p.mcbColor}
                          running={p.running}
                          ar={p.lang === "ar"}
                          onAdd={p.onAdd}
                          onDragStart={p.onDragStart}
                          onDragEnd={p.onDragEnd}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={section.id}>
                <SectionHead id={section.id} title={p.lang === "ar" ? section.ar : section.en} />
                <div className="grid grid-cols-3 gap-2 px-3">
                  {section.parts.map((part) => (
                    <PartCard
                      key={part.id}
                      part={part}
                      color={p.mcbColor}
                      running={p.running}
                      ar={p.lang === "ar"}
                      onAdd={(pt, ptType) => p.onAdd(pt, ptType)}
                      onDragStart={p.onDragStart}
                      onDragEnd={p.onDragEnd}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default memo(Sidebar);
