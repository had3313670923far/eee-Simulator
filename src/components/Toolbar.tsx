import {
  LayoutGrid,
  Play,
  Square,
  Undo2,
  Redo2,
  Maximize2,
  Sun,
  Moon,
  Save,
  FilePlus2,
  BookOpenText,
  ImageDown,
  Pencil,
  Check,
} from "lucide-react";

type Props = {
  sidebarOpen: boolean;
  onToggleParts: () => void;
  onExamples: () => void;
  running: boolean;
  onToggleRun: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onFit: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onSave: () => void;
  onNew: () => void;
  onExport: () => void;
  editMode: boolean;
  onToggleEdit: () => void;
};

function ToolButton({
  children,
  onClick,
  title,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-all
        ${
          active
            ? "border-emerald-500/60 bg-emerald-600/15 text-emerald-300"
            : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-emerald-500/40 hover:text-[var(--text)]"
        }
        disabled:cursor-not-allowed disabled:opacity-35`}
    >
      {children}
    </button>
  );
}

export default function Toolbar(p: Props) {
  return (
    <header
      className="scroll-thin flex h-[52px] shrink-0 items-center gap-2 overflow-x-auto border-b border-[var(--border)] bg-[var(--bar)] px-3 [&>button]:shrink-0"
      style={{ color: "var(--text)" }}
    >
      <button
        onClick={p.onToggleParts}
        className={`flex h-10 items-center gap-2 rounded-lg px-3.5 text-[13.5px] font-semibold transition-all ${
          p.sidebarOpen
            ? "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--text)]"
        }`}
      >
        <LayoutGrid size={16} />
        Parts
        <span
          className={`h-2 w-2 rounded-full ${p.sidebarOpen ? "bg-yellow-300 shadow-[0_0_6px_#fde047]" : "bg-emerald-500"}`}
        />
      </button>

      <button
        onClick={p.onExamples}
        className="flex h-10 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-600/10 px-3.5 text-[13.5px] font-semibold text-emerald-300 transition-all hover:bg-emerald-600/20"
      >
        <BookOpenText size={16} />
        <span className="hidden sm:inline">Examples</span>
      </button>

      {p.running ? (
        <button
          onClick={p.onToggleRun}
          className="flex h-10 items-center gap-2 rounded-lg border border-red-500/50 bg-red-600/20 px-4 text-[13.5px] font-semibold text-red-300 transition-all hover:bg-red-600/30"
        >
          <Square size={15} className="fill-red-400 text-red-400" />
          Stop
        </button>
      ) : (
        <button
          onClick={p.onToggleRun}
          className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-[13.5px] font-medium text-[var(--muted)] transition-all hover:border-emerald-500/40 hover:text-[var(--text)]"
        >
          <Play size={15} className="fill-current" />
          Run
        </button>
      )}

      <div className="mx-1 h-6 w-px bg-[var(--border)]" />

      <ToolButton title="Undo (Ctrl+Z)" onClick={p.onUndo} disabled={!p.canUndo}>
        <Undo2 size={16} />
      </ToolButton>
      <ToolButton title="Redo (Ctrl+Y)" onClick={p.onRedo} disabled={!p.canRedo}>
        <Redo2 size={16} />
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-[var(--border)]" />

      <button
        onClick={p.onToggleEdit}
        title="Edit properties of selected parts / cables"
        className={`flex h-10 items-center gap-2 rounded-lg border px-3.5 text-[13px] font-semibold transition-all ${
          p.editMode
            ? "border-amber-400/60 bg-amber-500/15 text-amber-300 shadow-[0_0_14px_rgba(245,179,66,0.25)]"
            : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-amber-400/50 hover:text-[var(--text)]"
        }`}
      >
        {p.editMode ? <Check size={15} /> : <Pencil size={14} />}
        {p.editMode ? "Done" : "Edit"}
      </button>

      <ToolButton title="Fit diagram to view" onClick={p.onFit}>
        <Maximize2 size={15} />
        Fit
      </ToolButton>
      <ToolButton title={p.theme === "dark" ? "Light mode" : "Dark mode"} onClick={p.onToggleTheme}>
        {p.theme === "dark" ? <Sun size={16} className="text-amber-300" /> : <Moon size={15} />}
      </ToolButton>
      <ToolButton title="Save design" onClick={p.onSave}>
        <Save size={15} />
        Save
      </ToolButton>
      <ToolButton title="Export schematic as PNG image" onClick={p.onExport}>
        <ImageDown size={15} />
        <span className="hidden lg:inline">PNG</span>
      </ToolButton>
      <ToolButton title="New blank design" onClick={p.onNew}>
        <FilePlus2 size={15} />
      </ToolButton>

      <div className="ml-auto hidden items-center gap-2 pr-1 text-[11px] text-[var(--muted)] md:flex">
        <span className="rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1 font-mono">
          Electro Panel · v1.0
        </span>
      </div>
    </header>
  );
}
