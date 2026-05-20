import { useRef, useState, type ReactNode } from "react";
import { useDesktop, type WindowState } from "./store";

interface Props {
  win: WindowState;
  children: ReactNode;
}

export function Window({ win, children }: Props) {
  const { focus, close, minimize, toggleMax, update, focusedId } = useDesktop();
  const focused = focusedId === win.id;
  const dragRef = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(null);
  const resizeRef = useRef<{ sw: number; sh: number; sx: number; sy: number } | null>(null);
  const [hoverChrome, setHoverChrome] = useState(false);

  if (win.minimized) return null;

  const onDragStart = (e: React.PointerEvent) => {
    if (win.maximized) return;
    focus(win.id);
    dragRef.current = { ox: win.x, oy: win.y, sx: e.clientX, sy: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    update(win.id, {
      x: Math.max(0, d.ox + (e.clientX - d.sx)),
      y: Math.max(28, d.oy + (e.clientY - d.sy)),
    });
  };
  const onDragEnd = () => { dragRef.current = null; };

  const onResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    focus(win.id);
    resizeRef.current = { sw: win.w, sh: win.h, sx: e.clientX, sy: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onResizeMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const r = resizeRef.current;
    update(win.id, {
      w: Math.max(280, r.sw + (e.clientX - r.sx)),
      h: Math.max(200, r.sh + (e.clientY - r.sy)),
    });
  };
  const onResizeEnd = () => { resizeRef.current = null; };

  return (
    <div
      className="absolute flex flex-col rounded-xl overflow-hidden bg-window border"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        boxShadow: focused ? "var(--shadow-window)" : "0 10px 30px -10px rgba(0,0,0,0.3)",
        borderColor: "var(--window-border)",
      }}
      onPointerDown={() => focus(win.id)}
    >
      <div
        className="h-9 flex items-center px-3 gap-2 select-none glass bg-window-chrome border-b cursor-default"
        style={{ borderColor: "var(--window-border)" }}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onDoubleClick={() => toggleMax(win.id)}
        onMouseEnter={() => setHoverChrome(true)}
        onMouseLeave={() => setHoverChrome(false)}
      >
        <div className="flex gap-2 items-center">
          <button
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); close(win.id); }}
            className="traffic-light"
            style={{ background: focused ? "#ff5f57" : "#c7c7c7" }}
          >
            {hoverChrome && focused && <span className="text-[8px] leading-none text-black/60">×</span>}
          </button>
          <button
            aria-label="Minimize"
            onClick={(e) => { e.stopPropagation(); minimize(win.id); }}
            className="traffic-light"
            style={{ background: focused ? "#febc2e" : "#c7c7c7" }}
          >
            {hoverChrome && focused && <span className="text-[8px] leading-none text-black/60">−</span>}
          </button>
          <button
            aria-label="Maximize"
            onClick={(e) => { e.stopPropagation(); toggleMax(win.id); }}
            className="traffic-light"
            style={{ background: focused ? "#28c840" : "#c7c7c7" }}
          >
            {hoverChrome && focused && <span className="text-[8px] leading-none text-black/60">+</span>}
          </button>
        </div>
        <div className="flex-1 text-center text-xs font-semibold text-foreground/80 truncate px-2">
          {win.title}
        </div>
        <div className="w-[54px]" />
      </div>

      <div className="flex-1 overflow-auto bg-window text-foreground">{children}</div>

      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onPointerDown={onResizeStart}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
        />
      )}
    </div>
  );
}
