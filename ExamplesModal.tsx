import {
  X,
  PlayCircle,
  Cpu,
  ArrowLeftRight,
  Timer,
  Lightbulb,
  Fan,
  MapPin,
  Waves,
  Siren,
  PlugZap,
  Network,
  Droplets,
  Gauge,
  Radar,
} from "lucide-react";
import { EXAMPLES, type Example } from "../engine/examples";

const ICONS = [
  Fan,
  Network,
  PlayCircle,
  Droplets,
  ArrowLeftRight,
  Fan,
  Timer,
  Lightbulb,
  MapPin,
  Waves,
  Siren,
  PlugZap,
  Gauge,
  Radar,
];

export default function ExamplesModal({
  open,
  onClose,
  onLoad,
}: {
  open: boolean;
  onClose: () => void;
  onLoad: (e: Example) => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onPointerDown={onClose}
    >
      <div
        className="ep-pop w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
        style={{ color: "var(--text)" }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-emerald-400">
              <Cpu size={17} />
              Ready-Made Circuits
            </h2>
            <p className="mt-0.5 text-[12px] text-[var(--muted)]">
              افتح دائرة جاهزة بضغطة — افتح دائرة ثم اضغط Run وشغّل الأزرار · Open, press Run, then
              operate the buttons
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid max-h-[70vh] gap-3 overflow-y-auto p-5 sm:grid-cols-2 scroll-thin">
          {EXAMPLES.map((ex, i) => {
            const Icon = ICONS[i] ?? PlayCircle;
            return (
              <button
                key={ex.id}
                onClick={() => {
                  onLoad(ex);
                  onClose();
                }}
                className="group flex flex-col items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-[var(--card-hover)] hover:shadow-[0_10px_30px_-12px_rgba(34,197,94,0.5)]"
              >
                <div className="flex w-full items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-400 transition-transform group-hover:scale-110">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold leading-tight">{ex.nameEn}</div>
                    <div dir="rtl" className="text-[12px] font-medium leading-tight text-emerald-400/90">
                      {ex.nameAr}
                    </div>
                  </div>
                </div>
                <p className="text-[11.5px] leading-relaxed text-[var(--muted)]">{ex.descEn}</p>
                <span className="mt-auto pt-1 text-[11px] font-semibold text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Load circuit →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
