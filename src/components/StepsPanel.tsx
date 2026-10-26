import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ListChecks, RotateCcw, ChevronDown } from "lucide-react";
import type { Step, StepCtx } from "../engine/examples";

export default function StepsPanel({
  title,
  steps,
  ctx,
  resetKey,
}: {
  title: string;
  steps: Step[];
  ctx: StepCtx;
  resetKey: string;
}) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setDone(new Set());
    setOpen(true);
  }, [resetKey]);

  const live = useMemo(() => steps.map((s) => s.check(ctx)), [steps, ctx]);

  useEffect(() => {
    setDone((prev) => {
      let changed = false;
      const next = new Set(prev);
      live.forEach((ok, i) => {
        if (ok && !next.has(i)) {
          next.add(i);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [live]);

  const completed = done.size;
  const allDone = completed === steps.length;

  return (
    <div className="absolute left-4 top-4 z-30 w-[280px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bar)]/95 shadow-2xl shadow-black/40 backdrop-blur">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left"
      >
        <ListChecks size={15} className={allDone ? "text-emerald-400" : "text-sky-400"} />
        <span className="flex-1 truncate text-[12.5px] font-semibold" style={{ color: "var(--text)" }}>
          {title}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold ${
            allDone ? "bg-emerald-600/20 text-emerald-300" : "bg-sky-600/20 text-sky-300"
          }`}
        >
          {completed}/{steps.length}
        </span>
        <ChevronDown size={14} className={`text-[var(--muted)] transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>

      {open && (
        <div className="border-t border-[var(--border)] px-3 py-2.5">
          <ol className="space-y-2">
            {steps.map((s, i) => {
              const isDone = done.has(i);
              const active = !isDone && (i === 0 || done.has(i - 1));
              return (
                <li key={i} className="flex items-start gap-2">
                  {isDone ? (
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle
                      size={15}
                      className={`mt-0.5 shrink-0 ${active ? "text-sky-400 ep-blink" : "text-[var(--border)]"}`}
                    />
                  )}
                  <span
                    className={`text-[11.5px] leading-snug ${
                      isDone
                        ? "text-[var(--muted)] line-through decoration-emerald-500/40"
                        : active
                          ? "font-medium text-[var(--text)]"
                          : "text-[var(--muted)]"
                    }`}
                  >
                    {s.en}
                    <span dir="rtl" className="block text-[10.5px] text-emerald-400/80">
                      {s.ar}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-2.5 flex items-center justify-end gap-1">
            <button
              onClick={() => setDone(new Set())}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-medium text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text)]"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
          {allDone && (
            <div className="mt-1 rounded-lg border border-emerald-500/30 bg-emerald-600/10 px-2.5 py-1.5 text-center text-[11px] font-semibold text-emerald-300">
              ✓ Circuit completed successfully
            </div>
          )}
        </div>
      )}
    </div>
  );
}
