import { Folder, FileText, Calculator as CalcIcon, Compass, Info, TerminalSquare, Trash2 } from "lucide-react";
import { useDesktop, type AppId } from "./store";

const ITEMS: { id: AppId; label: string; Icon: typeof Folder; color: string }[] = [
  { id: "finder", label: "Finder", Icon: Folder, color: "from-sky-300 to-sky-500" },
  { id: "browser", label: "Safari", Icon: Compass, color: "from-blue-400 to-indigo-600" },
  { id: "textedit", label: "TextEdit", Icon: FileText, color: "from-zinc-200 to-zinc-400" },
  { id: "calculator", label: "Calculator", Icon: CalcIcon, color: "from-zinc-700 to-zinc-900" },
  { id: "terminal", label: "Terminal", Icon: TerminalSquare, color: "from-neutral-800 to-black" },
  { id: "about", label: "About", Icon: Info, color: "from-slate-300 to-slate-500" },
];

export function Dock() {
  const { open, windows, focus } = useDesktop();

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9998]">
      <div
        className="glass bg-dock rounded-2xl px-2 py-1.5 flex items-end gap-1 border border-white/40"
        style={{ boxShadow: "var(--shadow-dock)" }}
      >
        {ITEMS.map(({ id, label, Icon, color }) => {
          const running = windows.some((w) => w.appId === id);
          return (
            <button
              key={id}
              title={label}
              onClick={() => {
                const existing = windows.find((w) => w.appId === id);
                if (existing) focus(existing.id);
                else open(id);
              }}
              className="relative group p-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-transform duration-150 group-hover:-translate-y-2 group-hover:scale-110`}
              >
                <Icon className="w-7 h-7 text-white drop-shadow" strokeWidth={2} />
              </div>
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs rounded bg-black/70 text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {label}
              </span>
              {running && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black/60" />
              )}
            </button>
          );
        })}
        <div className="w-px h-10 bg-black/15 mx-1 self-center" />
        <button title="Trash" className="p-1 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-400 flex items-center justify-center shadow-md transition-transform duration-150 group-hover:-translate-y-2 group-hover:scale-110">
            <Trash2 className="w-7 h-7 text-zinc-700" strokeWidth={2} />
          </div>
        </button>
      </div>
    </div>
  );
}
