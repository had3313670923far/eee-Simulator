import {
  X, Type, Palette, Copy, Trash2, Cable, Box, Crosshair,
  Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Plus, Minus, Ruler, RotateCcw,
} from "lucide-react";
import type { Placed, Wire } from "./Canvas";
import type { Part } from "../data/catalog";
import { MCB_COLORS } from "../data/catalog";
import { CONTACT_SENSORS } from "../data/sensorContacts";

type Props =
  | {
      kind: "part";
      item: Placed;
      part: Part | undefined;
      onClose: () => void;
      onRename: (uid: string, name: string) => void;
      onColor: (uid: string, color: string) => void;
      onDuplicate: (uid: string) => void;
      onDelete: (uid: string) => void;
    }
  | {
      kind: "wire";
      wire: Wire;
      onClose: () => void;
      onWireColor: (uid: string, color: string) => void;
      onNudgeWire: (uid: string, dx: number, dy: number) => void;
      onResizeWire: (uid: string, delta: number) => void;
      onResizeThickness: (uid: string, delta: number) => void;
      onResetWire: (uid: string) => void;
      length: number;
      locked: boolean;
      onDeleteWire: (uid: string) => void;
    };

function Row({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

export default function PropertiesPanel(p: Props) {
  const inputCls =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[12.5px] text-[var(--text)] outline-none focus:border-emerald-500/60";
  const actionCls =
    "flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-[11.5px] font-medium text-[var(--muted)] transition-all hover:text-[var(--text)]";

  return (
    <div
      className="ep-pop scroll-thin absolute right-4 top-4 z-40 max-h-[calc(100vh-7rem)] w-[min(260px,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bar)]/97 shadow-2xl shadow-black/50 backdrop-blur"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* header */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-3.5 py-2.5">
        {p.kind === "part" ? (
          <Box size={14} className="text-emerald-400" />
        ) : (
          <Cable size={14} className="text-sky-400" />
        )}
        <span className="flex-1 text-[12.5px] font-bold" style={{ color: "var(--text)" }}>
          {p.kind === "part" ? "Component Properties" : "Cable Properties"}
        </span>
        <button
          onClick={p.onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text)]"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3.5 p-3.5">
        {p.kind === "part" ? (
          <>
            {/* type */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Type
              </div>
              <div className="mt-0.5 truncate text-[13px] font-semibold text-emerald-300">
                {p.part?.en ?? "Component"}
              </div>
            </div>

            {/* custom label */}
            <Row icon={<Type size={11} />} title="Label">
              <input
                className={inputCls}
                value={p.item.name ?? ""}
                placeholder={p.part?.en ?? "Label"}
                onChange={(e) => p.onRename(p.item.uid, e.target.value)}
              />
            </Row>

            {/* MCB color */}
            {p.part?.colorable && (
              <Row icon={<Palette size={11} />} title="Breaker Color">
                <div className="flex flex-wrap gap-1.5">
                  {MCB_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => p.onColor(p.item.uid, c)}
                      className={`h-6 w-6 rounded-md border transition-transform hover:scale-110 ${
                        (p.item.color ?? MCB_COLORS[0]) === c
                          ? "scale-110 border-white ring-2 ring-emerald-400/60"
                          : "border-black/30"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </Row>
            )}

            {/* position */}
            <Row icon={<Crosshair size={11} />} title="Position">
              <div className="font-mono text-[11.5px] text-[var(--muted)]">
                x {Math.round(p.item.x)} · y {Math.round(p.item.y)}
              </div>
            </Row>

            {p.item.id === "floatless-level" && (
              <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 px-2.5 py-2 text-[11px] leading-relaxed text-[var(--muted)]">
                <div className="mb-1 font-semibold text-sky-300">Floatless wiring</div>
                S0/S1: 110V AC. E1: upper probe, E2: lower probe, E3: grounded common.
                Feed COM; wire NC for filling or NO for drainage. In Run, tap the device
                to cycle LOW, RISING, HIGH and FALLING.
              </div>
            )}

            {CONTACT_SENSORS.has(p.item.id) && (
              <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 px-2.5 py-2 text-[11px] leading-relaxed text-[var(--muted)]">
                <div className="mb-1 font-semibold text-sky-300">COM / NC / NO</div>
                Connect the incoming feed to COM. NC is closed normally; click the
                sensor in Run to move COM to NO. Click again to reset. The contact
                block is a virtual training output for passive sensing elements.
              </div>
            )}

            {p.item.id === "level-probe" && (
              <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 px-2.5 py-2 text-[11px] leading-relaxed text-[var(--muted)]">
                This passive electrode has no relay contacts. Wire its lead to
                E1, E2 or E3 on the Floatless Level Switch. In Run you can tap
                a wired probe to simulate a change in water level.
              </div>
            )}

            {/* actions */}
            <div className="flex gap-2 pt-0.5">
              <button className={actionCls} onClick={() => p.onDuplicate(p.item.uid)}>
                <Copy size={13} />
                Duplicate
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-[11.5px] font-medium text-red-400 transition-all hover:bg-red-500/20"
                onClick={() => p.onDelete(p.item.uid)}
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Connection
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-sky-300">
                {p.wire.a.split("::")[0].slice(0, 10)} → {p.wire.b.split("::")[0].slice(0, 10)}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-2 text-[11px] leading-relaxed text-[var(--muted)]">
              Cable color follows the phase automatically while running:
              <span className="mt-1 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10.5px]">
                <span className="text-red-400">● L1</span>
                <span className="text-yellow-300">● L2</span>
                <span className="text-blue-400">● L3</span>
                <span className="text-sky-300">● N</span>
                <span className="text-slate-400">● dead</span>
              </span>
            </div>

            <Row icon={<Move size={11} />} title="Move cable route">
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: "Left", icon: <ArrowLeft size={15} />, dx: -20, dy: 0 },
                  { name: "Up", icon: <ArrowUp size={15} />, dx: 0, dy: -20 },
                  { name: "Right", icon: <ArrowRight size={15} />, dx: 20, dy: 0 },
                  { name: "Down", icon: <ArrowDown size={15} />, dx: 0, dy: 20 },
                ].map((direction) => (
                  <button
                    key={direction.name}
                    title={`Move ${direction.name.toLowerCase()} 20 px`}
                    disabled={p.locked}
                    onClick={() => p.onNudgeWire(p.wire.uid, direction.dx, direction.dy)}
                    className="flex h-8 items-center justify-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition-colors hover:border-emerald-500/50 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {direction.icon}
                    <span className="text-[10px]">{direction.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-[10.5px] text-[var(--muted)]">
                X {Math.round(p.wire.routeOffset?.x ?? 0)} · Y {Math.round(p.wire.routeOffset?.y ?? 0)}.
                You can also drag the cable or its center handle.
              </div>
            </Row>

            <Row icon={<Ruler size={11} />} title="Cable length">
              <div className="flex items-center gap-1.5">
                <button
                  disabled={p.locked || !p.wire.slack}
                  onClick={() => p.onResizeWire(p.wire.uid, -20)}
                  className={`${actionCls} disabled:cursor-not-allowed disabled:opacity-35`}
                  title="Shorten the cable bend"
                >
                  <Minus size={13} /> Shorter
                </button>
                <span className="min-w-[48px] text-center font-mono text-[11px] text-emerald-300">{p.length} px</span>
                <button
                  disabled={p.locked || (p.wire.slack ?? 0) >= 240}
                  onClick={() => p.onResizeWire(p.wire.uid, 20)}
                  className={`${actionCls} disabled:cursor-not-allowed disabled:opacity-35`}
                  title="Lengthen the cable with an extra bend"
                >
                  <Plus size={13} /> Longer
                </button>
              </div>
              <span className="block text-[10.5px] text-[var(--muted)]">
                Detour: {Math.round(p.wire.slack ?? 0)} px. Terminals stay connected.
              </span>
            </Row>

            <Row icon={<Cable size={11} />} title="Cable size">
              <div className="flex items-center gap-1.5">
                <button
                  disabled={p.locked || (p.wire.thickness ?? 4.5) <= 2}
                  onClick={() => p.onResizeThickness(p.wire.uid, -1)}
                  className={`${actionCls} disabled:cursor-not-allowed disabled:opacity-35`}
                  title="Make this cable thinner"
                >
                  <Minus size={13} /> Thinner
                </button>
                <span className="min-w-[38px] text-center font-mono text-[11px] text-emerald-300">
                  {(p.wire.thickness ?? 4.5).toFixed(1)}
                </span>
                <button
                  disabled={p.locked || (p.wire.thickness ?? 4.5) >= 10}
                  onClick={() => p.onResizeThickness(p.wire.uid, 1)}
                  className={`${actionCls} disabled:cursor-not-allowed disabled:opacity-35`}
                  title="Make this cable thicker"
                >
                  <Plus size={13} /> Thicker
                </button>
              </div>
            </Row>

            <button
              disabled={p.locked}
              onClick={() => p.onResetWire(p.wire.uid)}
              className={`${actionCls} w-full disabled:cursor-not-allowed disabled:opacity-35`}
              title="Remove extra bends and use the shortest automatic route"
            >
              <RotateCcw size={13} /> Shortest automatic route
            </button>

            <button
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-[11.5px] font-medium text-red-400 transition-all hover:bg-red-500/20"
              onClick={() => p.onDeleteWire(p.wire.uid)}
            >
              <Trash2 size={13} />
              Delete Cable
            </button>
          </>
        )}
      </div>
    </div>
  );
}
